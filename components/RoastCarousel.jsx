import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function RoastCarousel({ roasts }) {
  const [activeRoastIndex, setActiveRoastIndex] = useState(0);
  const [roastProgress, setRoastProgress] = useState(0);
  const [shuffledRoasts, setShuffledRoasts] = useState([]);
  const [slideDirection, setSlideDirection] = useState('right');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (roasts && roasts.length > 0) {
        setShuffledRoasts([...roasts].sort(() => Math.random() - 0.5));
    }
  }, [roasts]);

  useEffect(() => {
    if (shuffledRoasts.length === 0 || isTransitioning) return;

    const duration = 10000; // 10 seconds
    const startTimeComponent = Date.now();
    let animationFrameId;

  }, [shuffledRoasts, isTransitioning]);
  

  useEffect(() => {
      if (shuffledRoasts.length === 0) return;
      
      const timer = setInterval(() => {
          handleAutoSlide();
      }, 10000);
      
      return () => clearInterval(timer);
  }, [shuffledRoasts.length, activeRoastIndex]); // Restart timer on slide change?

  const handleAutoSlide = () => {
    changeSlide('next');
  };

  const changeSlide = (direction) => {
    if (isTransitioning) return;
    
    setSlideDirection(direction);
    setIsTransitioning(true);

    setTimeout(() => {
      if (direction === 'next') {
        setActiveRoastIndex(curr => (curr + 1) % shuffledRoasts.length);
      } else {
        setActiveRoastIndex(curr => (curr - 1 + shuffledRoasts.length) % shuffledRoasts.length);
      }
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50); 
    }, 300);
  };
  
  if (shuffledRoasts.length === 0) return null;

  return (
    <div className="relative group min-h-[460px] sm:min-h-[420px]">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-100 rounded-2xl blur opacity-20 transition duration-500"></div>
        
        {/* Active Slide Content */}
        <div className="relative">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm transition-all duration-500 min-h-[340px] flex flex-col justify-between overflow-hidden">
            <div 
                key={activeRoastIndex} 
                className={`transition-all duration-300 ease-in-out ${
                isTransitioning 
                    ? slideDirection === 'next' 
                    ? '-translate-x-10 opacity-0' 
                    : 'translate-x-10 opacity-0'
                    : 'translate-x-0 opacity-100'
                }`}
            >
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-tr from-gray-50 to-white border border-gray-100 rounded-full flex items-center justify-center text-xl shadow-sm shrink-0">
                        {shuffledRoasts[activeRoastIndex].emoji}
                    </div>
                    <div className="text-left">
                        <div className="font-space font-bold text-gray-900 text-lg">{shuffledRoasts[activeRoastIndex].username}</div>
                        <div className="font-mono text-xs text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <span className="hidden mt-1 sm:inline">Roast Level:</span> 
                        <span className="text-red-500 mt-1 font-bold bg-red-50 px-2 py-0.5 rounded-full">{shuffledRoasts[activeRoastIndex].roastLevel}</span>
                        </div>
                    </div>
                </div>
                </div>
                
                <p className="font-pop text-gray-600 leading-relaxed text-lg mb-8">
                "{shuffledRoasts[activeRoastIndex].roast}"
                </p>

                <div className="flex flex-wrap gap-2">
                {shuffledRoasts[activeRoastIndex].tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-xs font-mono text-gray-500">
                    {tag}
                    </span>
                ))}
                </div>
            </div>
        </div>

        <div 
            key={`reaction-${activeRoastIndex}`} 
            className={`
            mt-4 sm:mt-0 sm:absolute sm:-right-8 sm:-bottom-6 sm:max-w-md 
            bg-gray-50 rounded-2xl border border-gray-200 p-6 
            relative z-20 shadow-lg sm:rotate-1 sm:transform
            transition-all duration-500 ease-in-out
            ${isTransitioning 
                ? 'opacity-0 translate-y-4' 
                : 'opacity-100 translate-y-0'
            }
            `}
        >
            <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 font-space font-bold text-gray-900 text-sm">{shuffledRoasts[activeRoastIndex].username}</div>
                <span className="text-xs text-gray-400">just now</span>
            </div>
            <p className="font-outfit text-gray-700 text-sm italic">
                <span className="text-red-500 font-bold mr-1 not-italic">{shuffledRoasts[activeRoastIndex].reactionSentiment === 'Angry' ? 'WTF??' : shuffledRoasts[activeRoastIndex].reactionSentiment === 'Sad' ? 'Ouch.' : shuffledRoasts[activeRoastIndex].reactionSentiment === 'Defensive' ? 'Excuse me?' : 'Uhm...'}</span>
                {shuffledRoasts[activeRoastIndex].reaction}
            </p>
        </div>

        <div className="mt-8 flex items-center justify-between px-1 sm:px-4">
            <div className="flex items-center gap-4">
                <button 
                onClick={() => changeSlide('prev')}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
                disabled={isTransitioning}
                >
                <ChevronLeft size={20} />
                </button>
                
                <div className="h-1 w-32 sm:w-48 bg-gray-100 rounded-full overflow-hidden">
                   {/* CSS Animation for progress bar */}
                    <div 
                        key={activeRoastIndex} // Reset animation on slide change
                        className="h-full bg-gray-900 rounded-full origin-left"
                        style={{ 
                            animation: `progress 10s linear forwards`
                        }}
                    ></div>
                    <style jsx>{`
                        @keyframes progress {
                            from { width: 0%; }
                            to { width: 100%; }
                        }
                    `}</style>
                </div>

                <button 
                onClick={() => changeSlide('next')}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
                disabled={isTransitioning}
                >
                <ChevronRight size={20} />
                </button>
            </div>
            <div className="font-mono text-xs text-gray-400">
            {activeRoastIndex + 1} / {shuffledRoasts.length}
            </div>
        </div>

        </div>
    </div>
  );
}
