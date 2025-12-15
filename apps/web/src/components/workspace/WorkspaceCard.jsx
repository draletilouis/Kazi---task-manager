import { Link } from 'react-router-dom';
import { Users, MoreVertical, Edit2, Trash2, FolderOpen } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const WorkspaceCard = ({ workspace, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate gradient based on workspace ID
  const getGradient = (id) => {
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-teal-600',
      'from-orange-500 to-red-600',
      'from-pink-500 to-rose-600',
      'from-indigo-500 to-blue-600',
      'from-cyan-500 to-blue-600',
    ];
    const index = id ? id.charCodeAt(0) % gradients.length : 0;
    return gradients[index];
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Colored Header Bar */}
      <div className={`h-2 bg-gradient-to-r ${getGradient(workspace.id)}`}></div>

      <div className="p-6">
        {/* Header with Icon and Menu */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1">
            {/* Workspace Icon */}
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getGradient(workspace.id)} flex items-center justify-center shadow-md`}>
              <FolderOpen className="w-6 h-6 text-white" />
            </div>

            {/* Workspace Name */}
            <div className="flex-1 min-w-0">
              <Link to={`/workspaces/${workspace.id}`}>
                <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors truncate">
                  {workspace.name}
                </h3>
              </Link>
              <p className="text-xs text-gray-500 mt-0.5">
                {workspace.role || 'Member'}
              </p>
            </div>
          </div>

          {/* Actions Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => {
                    onEdit(workspace);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(workspace.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
          {workspace.description || 'No description provided'}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center text-gray-500">
              <Users className="w-4 h-4 mr-1.5" />
              <span>{workspace.memberCount || 0}</span>
            </div>
          </div>

          {/* View Link */}
          <Link
            to={`/workspaces/${workspace.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceCard;
