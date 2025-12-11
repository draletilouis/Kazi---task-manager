import TaskCard from './TaskCard';

const TaskBoard = ({ tasks = [], workspaceId, projectId, loading, error }) => {
  // Group tasks by status
  const groupTasksByStatus = () => {
    return {
      TODO: tasks.filter(task => task.status === 'TODO'),
      IN_PROGRESS: tasks.filter(task => task.status === 'IN_PROGRESS'),
      DONE: tasks.filter(task => task.status === 'DONE')
    };
  };

  const groupedTasks = groupTasksByStatus();

  // Column configuration
  const columns = [
    {
      id: 'TODO',
      title: 'To Do',
      tasks: groupedTasks.TODO,
      bgColor: 'bg-gray-50'
    },
    {
      id: 'IN_PROGRESS',
      title: 'In Progress',
      tasks: groupedTasks.IN_PROGRESS,
      bgColor: 'bg-yellow-50'
    },
    {
      id: 'DONE',
      title: 'Done',
      tasks: groupedTasks.DONE,
      bgColor: 'bg-green-50'
    }
  ];

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">Error loading tasks: {error}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map(column => (
        <div key={column.id} className={`${column.bgColor} rounded-lg p-4`}>
          {/* Column header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700">{column.title}</h2>
            <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-600">
              {column.tasks.length}
            </span>
          </div>

          {/* Task cards */}
          <div className="space-y-3">
            {column.tasks.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-8">
                No tasks
              </div>
            ) : (
              column.tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  workspaceId={workspaceId}
                  projectId={projectId}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
