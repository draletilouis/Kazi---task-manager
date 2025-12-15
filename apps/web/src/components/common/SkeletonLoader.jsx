const SkeletonLoader = ({ className = '', width = 'w-full', height = 'h-4' }) => {
  return (
    <div className={`${width} ${height} bg-gray-200 rounded animate-pulse ${className}`} />
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <SkeletonLoader height="h-6" width="w-3/4" className="mb-3" />
      <SkeletonLoader height="h-4" width="w-full" className="mb-2" />
      <SkeletonLoader height="h-4" width="w-5/6" className="mb-4" />
      <div className="flex gap-2">
        <SkeletonLoader height="h-10" width="w-24" />
        <SkeletonLoader height="h-10" width="w-24" />
      </div>
    </div>
  );
};

export const SkeletonTaskCard = () => {
  return (
    <div className="bg-white border rounded-lg p-3 shadow-sm">
      <div className="flex items-start gap-2 mb-2">
        <SkeletonLoader height="h-3" width="w-3" className="rounded-full mt-1" />
        <SkeletonLoader height="h-5" width="w-full" />
      </div>
      <SkeletonLoader height="h-4" width="w-4/5" className="mb-2" />
      <div className="flex items-center gap-2 mt-3">
        <SkeletonLoader height="h-6" width="w-16" className="rounded-full" />
        <SkeletonLoader height="h-6" width="w-6" className="rounded-full" />
      </div>
    </div>
  );
};

export default SkeletonLoader;
