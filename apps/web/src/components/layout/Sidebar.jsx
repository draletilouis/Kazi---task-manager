import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Folder,
  FolderOpen,
  Users,
  Settings,
  Briefcase
} from 'lucide-react';
import { getWorkspaces } from '../../api/workspaces';
import { getProjects } from '../../api/projects';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [expandedWorkspaces, setExpandedWorkspaces] = useState(new Set());
  const [workspaceProjects, setWorkspaceProjects] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch workspaces on mount
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setLoading(true);
        const data = await getWorkspaces();
        // Ensure data is an array
        setWorkspaces(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
        setWorkspaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  // Toggle workspace expansion and fetch projects if needed
  const toggleWorkspace = async (workspaceId) => {
    const newExpanded = new Set(expandedWorkspaces);

    if (newExpanded.has(workspaceId)) {
      newExpanded.delete(workspaceId);
    } else {
      newExpanded.add(workspaceId);

      // Fetch projects if not already loaded
      if (!workspaceProjects[workspaceId]) {
        try {
          const projects = await getProjects(workspaceId);
          setWorkspaceProjects(prev => ({
            ...prev,
            [workspaceId]: projects
          }));
        } catch (error) {
          console.error(`Error fetching projects for workspace ${workspaceId}:`, error);
        }
      }
    }

    setExpandedWorkspaces(newExpanded);
  };

  // Check if a path is active
  const isActive = (path) => location.pathname === path;
  const isWorkspaceActive = (workspaceId) => location.pathname.includes(`/workspaces/${workspaceId}`);
  const isProjectActive = (workspaceId, projectId) =>
    location.pathname.includes(`/workspaces/${workspaceId}/projects/${projectId}`);

  return (
    <div
      className={`bg-gray-900 text-gray-100 h-full flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Toggle Button */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        {!isCollapsed && (
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Navigation
          </h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors ml-auto"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Workspaces Section */}
        <div className="p-3">
          {!isCollapsed && (
            <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Workspaces
            </h3>
          )}

          {loading ? (
            <div className="px-3 py-4 text-sm text-gray-500">
              {isCollapsed ? '...' : 'Loading...'}
            </div>
          ) : workspaces.length === 0 ? (
            !isCollapsed && (
              <div className="px-3 py-4 text-sm text-gray-500">
                No workspaces yet
              </div>
            )
          ) : (
            <div className="space-y-1">
              {workspaces.map((workspace) => {
                const isExpanded = expandedWorkspaces.has(workspace.id);
                const projects = workspaceProjects[workspace.id] || [];
                const active = isWorkspaceActive(workspace.id);

                return (
                  <div key={workspace.id}>
                    {/* Workspace Item */}
                    <div className="flex items-center">
                      <Link
                        to={`/workspaces/${workspace.id}`}
                        className={`flex-1 flex items-center px-3 py-2 rounded-lg transition-colors ${
                          active
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                        title={isCollapsed ? workspace.name : ''}
                      >
                        {isExpanded ? (
                          <FolderOpen className="w-5 h-5 flex-shrink-0" />
                        ) : (
                          <Folder className="w-5 h-5 flex-shrink-0" />
                        )}
                        {!isCollapsed && (
                          <span className="ml-3 text-sm font-medium truncate">
                            {workspace.name}
                          </span>
                        )}
                      </Link>

                      {!isCollapsed && (
                        <button
                          onClick={() => toggleWorkspace(workspace.id)}
                          className="px-2 py-2 text-gray-400 hover:text-white transition-colors"
                          aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Projects List (when expanded) */}
                    {!isCollapsed && isExpanded && (
                      <div className="ml-6 mt-1 space-y-1 border-l border-gray-700">
                        {projects.length === 0 ? (
                          <div className="pl-6 py-2 text-xs text-gray-500">
                            No projects yet
                          </div>
                        ) : (
                          projects.map((project) => (
                            <Link
                              key={project.id}
                              to={`/workspaces/${workspace.id}/projects/${project.id}`}
                              className={`flex items-center pl-6 pr-3 py-2 rounded-r-lg transition-colors ${
                                isProjectActive(workspace.id, project.id)
                                  ? 'bg-gray-800 text-white border-l-2 border-blue-500'
                                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                              }`}
                            >
                              <Briefcase className="w-4 h-4 flex-shrink-0" />
                              <span className="ml-3 text-sm truncate">
                                {project.name}
                              </span>
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Links Section */}
        <div className="p-3 border-t border-gray-800 mt-auto">
          {!isCollapsed && (
            <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Quick Links
            </h3>
          )}

          <div className="space-y-1">
            <Link
              to="/profile"
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                isActive('/profile')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              title={isCollapsed ? 'Profile' : ''}
            >
              <Users className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="ml-3 text-sm font-medium">Profile</span>
              )}
            </Link>

            <Link
              to="/settings"
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                isActive('/settings')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              title={isCollapsed ? 'Settings' : ''}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="ml-3 text-sm font-medium">Settings</span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
