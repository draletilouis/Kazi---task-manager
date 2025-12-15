import { useState, useMemo } from 'react';
import { useWorkspaces } from '../../hooks/useWorkspaces';
import WorkspaceCard from '../../components/workspace/WorkspaceCard';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../context/ToastContext';
import { validateLength } from '../../utils/validation';

const WorkspacesPage = () => {
  const {
    workspaces,
    loading,
    error,
    addWorkspace,
    editWorkspace,
    removeWorkspace
  } = useWorkspaces();
  const toast = useToast();

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  // Form data
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Calculate pagination
  const paginatedWorkspaces = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return workspaces.slice(startIndex, endIndex);
  }, [workspaces, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(workspaces.length / itemsPerPage);

  // Reset to first page when workspaces change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Validate form
  const validateForm = () => {
    const nameValidation = validateLength(formData.name, 3, 50);
    const descValidation = formData.description
      ? validateLength(formData.description, 0, 500)
      : { valid: true, message: '' };

    setErrors({
      name: nameValidation.valid ? '' : nameValidation.message,
      description: descValidation.valid ? '' : descValidation.message
    });

    return nameValidation.valid && descValidation.valid;
  };

  // Handle create workspace
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await addWorkspace(formData);
      setShowCreateModal(false);
      setFormData({ name: '', description: '' });
      setErrors({ name: '', description: '' });
      toast.success('Workspace created successfully');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit workspace
  const handleEditClick = (workspace) => {
    setSelectedWorkspace(workspace);
    setFormData({
      name: workspace.name,
      description: workspace.description || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await editWorkspace(selectedWorkspace.id, formData);
      setShowEditModal(false);
      setFormData({ name: '', description: '' });
      setSelectedWorkspace(null);
      setErrors({ name: '', description: '' });
      toast.success('Workspace updated successfully');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete workspace
  const handleDelete = async (workspaceId) => {
    // Confirm before deleting
    if (window.confirm('Are you sure you want to delete this workspace?')) {
      try {
        await removeWorkspace(workspaceId);
        toast.success('Workspace deleted successfully');
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  // Loading state
  if (loading) return <Spinner />;

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error}</p>
          <Button 
            variant="secondary" 
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="w-full px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">My Workspaces</h1>
              <p className="mt-2 text-sm text-gray-600">
                Organize and manage your work across different workspaces
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Workspace
            </Button>
          </div>
        </div>

        {/* Workspaces grid */}
        {workspaces.length === 0 ? (
          // Empty state
          <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No workspaces yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Get started by creating your first workspace to organize your projects and collaborate with your team
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Workspace
            </Button>
          </div>
        ) : (
          <>
            {/* Workspace count and items per page selector */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <p className="text-sm font-medium text-gray-700">
                <span className="text-gray-900">{workspaces.length}</span> {workspaces.length === 1 ? 'workspace' : 'workspaces'}
              </p>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Show:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value={6}>6 per page</option>
                  <option value={9}>9 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={18}>18 per page</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedWorkspaces.map(workspace => (
                <WorkspaceCard
                  key={workspace.id}
                  workspace={workspace}
                  onEdit={handleEditClick}
                  onDelete={handleDelete}
                />
              ))}
            </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  // Show first page, last page, current page, and pages around current page
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 border rounded-md text-sm font-medium ${
                          currentPage === page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2 py-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <Modal
          onClose={() => setShowCreateModal(false)}
          title="Create Workspace"
        >
          <form onSubmit={handleCreate}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workspace Name * <span className="text-xs text-gray-500">({formData.name.length}/50)</span>
              </label>
              <input
                type="text"
                placeholder="My Workspace"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                maxLength={50}
                required
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-xs text-gray-500">({formData.description.length}/500)</span>
              </label>
              <textarea
                placeholder="What is this workspace for?"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                rows="3"
                maxLength={500}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create'}
              </Button>
              <Button 
                type="button"
                variant="secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <Modal
          onClose={() => setShowEditModal(false)}
          title="Edit Workspace"
        >
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workspace Name * <span className="text-xs text-gray-500">({formData.name.length}/50)</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                maxLength={50}
                required
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-xs text-gray-500">({formData.description.length}/500)</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                rows="3"
                maxLength={500}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update'}
              </Button>
              <Button 
                type="button"
                variant="secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default WorkspacesPage;