// Y.K Logo Component - Custom SVG Design
const YKLogo = ({ size = 80 }: { size?: number }) => (
  <div className="relative" style={{ width: size, height: size }}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="animate-pulse"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hexagonal Background */}
      <path
        d="M50 5 L85 25 L85 65 L50 85 L15 65 L15 25 Z"
        fill="url(#hexGradient)"
        stroke="currentColor"
        strokeWidth="2"
      />
      
      {/* Y Letter */}
      <path
        d="M25 25 L35 40 L45 25 M35 40 L35 55"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* K Letter */}
      <path
        d="M55 25 L55 55 M55 40 L70 25 M55 40 L70 55"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Circuit Pattern */}
      <circle cx="30" cy="65" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="50" cy="70" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="70" cy="65" r="2" fill="currentColor" opacity="0.6" />
      <path
        d="M30 65 L50 70 L70 65"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />
      
      {/* Gradient Definition */}
      <defs>
        <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
          <stop offset="50%" stopColor="rgba(147, 51, 234, 0.1)" />
          <stop offset="100%" stopColor="rgba(236, 72, 153, 0.1)" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

// Alternative: Image Logo Component (if you want to use an actual logo file)
const ImageLogo = ({ size = 80 }: { size?: number }) => (
  <div className="relative" style={{ width: size, height: size }}>
    <img
      src="/logo.png" // Place your logo in public/logo.png
      alt="Y.K Mini App Logo"
      width={size}
      height={size}
      className="animate-pulse object-contain"
      onError={(e) => {
        // Fallback to Y.K SVG if image fails to load
        e.currentTarget.style.display = 'none';
      }}
    />
  </div>
);
  

export const DefaultLoadingFallback = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center z-50">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
    </div>
    
    {/* Main Content */}
    <div className="flex flex-col items-center space-y-8 z-10">
      {/* Logo with Animation */}
      <div className="relative">
        <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-20 animate-pulse" />
        <div className="relative text-yellow-400">
          <YKLogo size={100} />
        </div>
      </div>
      
      {/* App Name */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Y.K MINI APP</h1>
         
      </div>
      
      {/* Loading Progress Bar */}
      <div className="w-48 bg-gray-700 rounded-full h-1 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-100 ease-out"
          style={{
            width: '0%',
            animation: 'progressFill 3s ease-out infinite'
          }}
        />
      </div>
      
      {/* Loading Dots Animation */}
      <div className="flex items-center space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
            style={{ 
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1s',
              transform: 'scale(1)',
              animation: `dotPulse 1.4s ease-in-out ${i * 0.2}s infinite`
            }}
          />
        ))}
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes dotPulse {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
        
        @keyframes progressFill {
          0% {
            width: 0%;
          }
          70% {
            width: 85%;
          }
          85% {
            width: 92%;
          }
          95% {
            width: 98%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
    
    {/* Footer with Developer Info */}
<div className="absolute bottom-4 left-0 right-0 text-center space-y-2">
  <div className="flex flex-col items-center space-y-1">
    <div className="text-gray-500 text-xs flex gap-1">
      Developed by{" "}
      <a
        href="https://t.me/FutureApps_Dev"
        target="_blank"
        rel="noopener noreferrer"
        className="text-yellow-400 font-medium hover:underline"
      >
         <p className="text-yellow-400">FutureApps_Dev</p>
      </a>
    </div>
    <p className="text-gray-600 text-xs">
      © {new Date().getFullYear()} FutureApps_Dev. All rights reserved.
    </p>
  </div>
</div>

  </div>
);