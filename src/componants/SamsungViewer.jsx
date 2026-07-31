import React from 'react';

const LaurelBranch = ({ className, flip = false }) => {
  const leafPath = "M0,0 C-15,-15 -15,-40 0,-50 C15,-40 15,-15 0,0 Z";
  
  return (
    <svg 
      viewBox="0 -15 100 240" 
      className={`${className} ${flip ? 'scale-x-[-1]' : ''}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stem */}
      <path d="M 50 210 Q 10 110 50 10" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      
      {/* Leaves Pair 1 (Bottom) */}
      <g transform="translate(43, 190) rotate(-70) scale(0.55)"><path d={leafPath} fill="currentColor"/></g>
      <g transform="translate(44, 180) rotate(10) scale(0.55)"><path d={leafPath} fill="currentColor"/></g>
      
      {/* Leaves Pair 2 */}
      <g transform="translate(33, 150) rotate(-60) scale(0.65)"><path d={leafPath} fill="currentColor"/></g>
      <g transform="translate(35, 140) rotate(30) scale(0.65)"><path d={leafPath} fill="currentColor"/></g>
      
      {/* Leaves Pair 3 */}
      <g transform="translate(30, 110) rotate(-45) scale(0.7)"><path d={leafPath} fill="currentColor"/></g>
      <g transform="translate(32, 100) rotate(45) scale(0.7)"><path d={leafPath} fill="currentColor"/></g>
      
      {/* Leaves Pair 4 */}
      <g transform="translate(33, 70) rotate(-30) scale(0.7)"><path d={leafPath} fill="currentColor"/></g>
      <g transform="translate(36, 60) rotate(60) scale(0.7)"><path d={leafPath} fill="currentColor"/></g>
      
      {/* Leaves Pair 5 */}
      <g transform="translate(43, 35) rotate(-10) scale(0.6)"><path d={leafPath} fill="currentColor"/></g>
      <g transform="translate(47, 28) rotate(70) scale(0.6)"><path d={leafPath} fill="currentColor"/></g>
      
      {/* Top Leaf */}
      <g transform="translate(50, 10) rotate(30) scale(0.6)"><path d={leafPath} fill="currentColor"/></g>
    </svg>
  );
};

const SamsungViewer = () => {
  return (
    <div className="relative top-7">
      <div className="flex items-center justify-center">
        
        {/* Left Laurel */}
        <div className="text-[#B69D74] shrink-0 pt-0.5">
          <LaurelBranch className="w-5 h-auto md:w-6" />
        </div>
        
        {/* Center Content */}
        <div className="flex flex-col items-center mx-2.5 text-center">
          <h1 
            className="text-sm md:text-base font-bold text-[#B69D74] leading-none mb-0.5" 
            style={{ fontFamily: '"Times New Roman", Times, serif', letterSpacing: '-0.02em' }}
          >
            Samsung
          </h1>
          <h2 
            className="text-[8px] md:text-[10px] text-[#B69D74] mb-1 whitespace-nowrap" 
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            Innovation Campus
          </h2>
          
          {/* Divider */}
          <div className="flex items-center justify-center space-x-1 mb-1 w-full">
            <div className="w-3 md:w-4 h-[1px] bg-[#B69D74] opacity-70"></div>
            <div className="w-[2px] h-[2px] rounded-full bg-[#B69D74]"></div>
            <div className="w-3 md:w-4 h-[1px] bg-[#B69D74] opacity-70"></div>
          </div>
          
          <p className="text-[5px] md:text-[6px] font-bold tracking-[0.15em] text-[#B69D74] whitespace-nowrap">
            250+ HOURS OF ML TRAINING
          </p>
        </div>
        
        {/* Right Laurel */}
        <div className="text-[#B69D74] shrink-0 pt-0.5">
          <LaurelBranch className="w-5 h-auto md:w-6" flip />
        </div>
        
      </div>
    </div>
  );
};

export default SamsungViewer;
