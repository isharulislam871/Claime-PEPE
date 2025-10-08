// Binance-style Logo Component for Suspense
const BinanceLogo = ({ size = 80 }: { size?: number }) => (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 326.1 326.1"
        className="animate-pulse"
        fill="currentColor"
      >
        <polygon points="163.1,126.8 163.1,126.8 163.1,126.8 130.7,94.4 98.3,126.8 130.7,159.2" />
        <polygon points="228.4,94.4 196,126.8 228.4,159.2 260.8,126.8" />
        <polygon points="163.1,62 130.7,94.4 163.1,126.8 195.5,94.4" />
        <polygon points="163.1,199.3 195.5,231.7 163.1,264.1 130.7,231.7" />
        <polygon points="98.3,199.3 65.9,231.7 98.3,264.1 130.7,231.7" />
        <polygon points="228.4,199.3 260.8,231.7 228.4,264.1 196,231.7" />
        <polygon points="163.1,0 98.3,64.8 130.7,97.2 163.1,64.8 195.5,97.2 228.4,64.8" />
        <polygon points="163.1,326.1 228.4,261.3 196,228.9 163.1,261.3 130.7,228.9 98.3,261.3" />
      </svg>
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
          <BinanceLogo size={100} />
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