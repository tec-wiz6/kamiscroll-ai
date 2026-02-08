
import React from 'react';

interface BubbleProps {
  text: string;
  type?: 'speech' | 'thought' | 'shout';
}

const Bubble: React.FC<BubbleProps> = ({ text, type = 'speech' }) => {
  // Simple heuristic for bubble placement based on text length or random (for demo)
  // In a real app, the AI could suggest coordinates.
  const isShort = text.length < 30;
  
  const getBubbleStyle = () => {
    switch (type) {
      case 'shout':
        return 'border-4 border-black bg-white shadow-[4px_4px_0_rgba(0,0,0,1)] clip-shout';
      case 'thought':
        return 'border-2 border-slate-300 bg-white rounded-[50%]';
      default:
        return 'border-2 border-black bg-white rounded-3xl';
    }
  };

  return (
    <div 
      className={`absolute bottom-8 left-8 max-w-[70%] p-4 md:p-6 shadow-xl z-10 pointer-events-none ${getBubbleStyle()}`}
    >
      <p className="text-black text-xs md:text-sm lg:text-base font-bold leading-tight jp-font uppercase">
        {text}
      </p>
      
      {/* Speech tail */}
      <div className="absolute -bottom-4 left-6 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-black">
        <div className="absolute -top-[22px] -left-[12px] w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[18px] border-t-white"></div>
      </div>
    </div>
  );
};

export default Bubble;
