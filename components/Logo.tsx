import React from 'react';

interface LogoProps {
  className?: string;
  collapsed?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", collapsed = false }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 bg-royal-600 rounded-xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
           {/* Robot Icon */}
           <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="4" width="16" height="16" rx="4" className="fill-royal-600" />
              <path d="M9 10h.01" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <path d="M15 10h.01" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <path d="M8 16c1.5 1.5 6.5 1.5 8 0" stroke="white" strokeLinecap="round" />
           </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-400 rounded-full border-2 border-white animate-pulse"></div>
      </div>
      
      {!collapsed && (
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-royal-900 leading-none tracking-tight">
            LeadFinder<span className="text-royal-600">AI</span>
          </h1>
          <span className="text-[10px] font-semibold text-royal-500 uppercase tracking-widest mt-0.5">
            Automated Growth
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;