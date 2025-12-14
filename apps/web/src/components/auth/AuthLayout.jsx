import logo from '../../assets/task-m.jpg';

// Updated layout with larger content areas
const AuthLayout = ({ children, title, subtitle, showBranding = true }) => {
  return (
    <div className="min-h-screen flex">
      {/* Branding Side - Desktop Only */}
      {showBranding && (
        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 to-blue-800 px-16 py-16">
          <div className="max-w-2xl text-white w-full flex flex-col justify-center">
            <div className="mb-16">
              <img
                src={logo}
                alt="Task Manager"
                className="h-32 w-32 rounded-2xl mb-10 shadow-2xl"
              />
            </div>
            <h1 className="text-6xl lg:text-7xl font-bold mb-8 leading-tight">Task Manager</h1>
            <p className="text-3xl text-blue-100 leading-relaxed mb-8">
              Organize your work and life, finally.
            </p>
            <p className="text-2xl text-blue-200 leading-relaxed mb-12">
              Simple, powerful task management for teams and individuals.
            </p>
            <div className="mt-20 space-y-8">
              <div className="flex items-start space-x-5">
                <div className="flex-shrink-0 w-3 h-3 bg-blue-300 rounded-full mt-2.5"></div>
                <p className="text-xl text-blue-100 leading-relaxed">Track tasks across multiple workspaces</p>
              </div>
              <div className="flex items-start space-x-5">
                <div className="flex-shrink-0 w-3 h-3 bg-blue-300 rounded-full mt-2.5"></div>
                <p className="text-xl text-blue-100 leading-relaxed">Collaborate with your team in real-time</p>
              </div>
              <div className="flex items-start space-x-5">
                <div className="flex-shrink-0 w-3 h-3 bg-blue-300 rounded-full mt-2.5"></div>
                <p className="text-xl text-blue-100 leading-relaxed">Stay organized with powerful filtering</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Form Side */}
      <div className="flex-1 flex items-center justify-center px-8 lg:px-20 py-12 bg-white">
        <div className="w-full max-w-[550px]">
          {/* Logo - Desktop */}
          <div className="flex justify-center lg:justify-start mb-10">
            <img
              src={logo}
              alt="Task Manager"
              className="h-12 w-12 rounded-lg"
            />
          </div>

          {/* Form Container */}
          <div className="w-full">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {title}
              </h2>
              {subtitle && (
                <p className="text-base text-gray-700">{subtitle}</p>
              )}
            </div>

            {/* Form Content */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
