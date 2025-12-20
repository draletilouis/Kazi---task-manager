import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Briefcase } from 'lucide-react';
import { getWorkspaces } from '../../api/workspaces';
import { getProjects } from '../../api/projects';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ workspaces: [], projects: [] });
  const [allData, setAllData] = useState({ workspaces: [], projects: [] });
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const workspacesData = await getWorkspaces();

      // Load projects for all workspaces
      const allProjects = [];
      for (const workspace of workspacesData.workspaces || []) {
        try {
          const projects = await getProjects(workspace.id);
          const projectsWithWorkspace = projects.map(p => ({
            ...p,
            workspaceId: workspace.id,
            workspaceName: workspace.name
          }));
          allProjects.push(...projectsWithWorkspace);
        } catch {
          console.error('Failed to load projects for workspace:', workspace.id);
        }
      }

      setAllData({
        workspaces: workspacesData.workspaces || [],
        projects: allProjects
      });
    } catch (error) {
      console.error('Failed to load search data:', error);
    }
  };

  // Load all workspaces and projects when component mounts
  useEffect(() => {
    loadData();
  }, []);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Search function
  useEffect(() => {
    if (!query.trim()) {
      setResults({ workspaces: [], projects: [] });
      return;
    }

    const searchQuery = query.toLowerCase();

    // Filter workspaces
    const matchedWorkspaces = allData.workspaces.filter(w =>
      w.name?.toLowerCase().includes(searchQuery) ||
      w.description?.toLowerCase().includes(searchQuery)
    );

    // Filter projects
    const matchedProjects = allData.projects.filter(p =>
      p.name?.toLowerCase().includes(searchQuery) ||
      p.description?.toLowerCase().includes(searchQuery)
    );

    setResults({
      workspaces: matchedWorkspaces.slice(0, 5),
      projects: matchedProjects.slice(0, 5)
    });
  }, [query, allData]);

  const handleSelect = (type, item) => {
    if (type === 'workspace') {
      navigate(`/workspaces/${item.id}`);
    } else if (type === 'project') {
      navigate(`/workspaces/${item.workspaceId}/projects/${item.id}`);
    }
    onClose();
    setQuery('');
  };

  const hasResults = results.workspaces.length > 0 || results.projects.length > 0;

  return (
    <div ref={containerRef} className="relative">
      {/* Search Input - Always Visible */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => !isOpen && onClose()}
        placeholder="Search workspaces, projects..."
        className="w-full px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm"
      />

      {/* Results Dropdown - Shows when typing */}
      {query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[400px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {!hasResults && (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">
              No results found for "{query}"
            </div>
          )}

          {/* Workspaces */}
          {results.workspaces.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Workspaces
              </div>
              {results.workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => handleSelect('workspace', workspace)}
                  className="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-3 flex-shrink-0">
                    <FolderOpen className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {workspace.name}
                    </div>
                    {workspace.description && (
                      <div className="text-xs text-gray-500 truncate">
                        {workspace.description}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 ml-2 flex-shrink-0">
                    {workspace.role}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Projects */}
          {results.projects.length > 0 && (
            <div className={`py-2 ${results.workspaces.length > 0 ? 'border-t border-gray-100' : ''}`}>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Projects
              </div>
              {results.projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleSelect('project', project)}
                  className="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center mr-3 flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {project.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      in {project.workspaceName}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchModal;
