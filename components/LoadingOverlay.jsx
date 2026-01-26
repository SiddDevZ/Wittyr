import React, { useState, useEffect } from "react";
import Background from "@/components/Background";

export default function LoadingOverlay({ show, onComplete, hasApiError, shouldRedirect }) {
  const [loadingStep, setLoadingStep] = useState(0);
  const [trainingCount, setTrainingCount] = useState(0);
  const [finalizationProgress, setFinalizationProgress] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTrainingComplete, setIsTrainingComplete] = useState(false);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    if (show) {
      startLoadingSequence();
    } else {
        setLoadingStep(0);
        setTrainingCount(0);
        setFinalizationProgress(0);
        setIsInitialized(false);
        setIsTrainingComplete(false);
        setIsStuck(false);
    }
  }, [show]);

  const startLoadingSequence = () => {
    setTimeout(() => {
      setIsInitialized(true);
      setLoadingStep(1);
      startTraining();
    }, 2300);
  };

  const startTraining = () => {
    const targetCount = 79032;
    const duration = 12000;
    const startTime = Date.now();

    const updateCount = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentCount = Math.floor(targetCount * progress);
      
      setTrainingCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(updateCount); 
      } else {
        setTrainingCount(targetCount);
        setIsTrainingComplete(true);
        setTimeout(() => {
          setLoadingStep(2);
          startFinalization();
        }, 1300);
      }
    };
    
    requestAnimationFrame(updateCount);
  };

  const startFinalization = () => {
    const duration = 15600; // 30% slower
    const startTime = Date.now();
    let isFinishing = false;
    let finishStartTime = 0;
    
    const isResponseReceived = () => {
      return localStorage.getItem('roastData') !== null || shouldRedirect;
    };
    
    const updateProgress = () => {

      const responseReceived = isResponseReceived();

      if (responseReceived && !isFinishing) {
        isFinishing = true;
        finishStartTime = Date.now();
        setIsStuck(false);
      }
      
      let progress;
      
      if (isFinishing) {
        const finishElapsed = Date.now() - finishStartTime;
        const finishDuration = 1040;

        const t = Math.min(finishElapsed / finishDuration, 1);
        const easeOutQuad = t * (2 - t);

         progress = 0.9 + (0.1 * easeOutQuad);
      } else {
        const elapsed = Date.now() - startTime;
        progress = Math.min(elapsed / duration, 1);

        if (progress >= 0.9) {
          progress = 0.9;
          if (!isStuck) {

          }
        }
      }

      setFinalizationProgress(Math.floor(progress * 100));
      if (progress >= 0.9 && !isFinishing) setIsStuck(true);
      
      if (progress < 1) {
         requestAnimationFrame(updateProgress);
      } else {
          // Complete
          if (onComplete) onComplete();
      }
    };
    
    requestAnimationFrame(updateProgress);
  };

  useEffect(() => {
    if (shouldRedirect && finalizationProgress >= 100) {
       // Parent handles redirect usually, or we do it here.
       // The original code had:
       /*
       useEffect(() => {
            if (shouldRedirect && finalizationProgress >= 100) {
            setTimeout(() => {
                window.location.href = '/roast';
            }, 1000);
            }
        }, [shouldRedirect, finalizationProgress]);
       */
       setTimeout(() => {
         window.location.href = '/roast';
       }, 1000);
    }
  }, [shouldRedirect, finalizationProgress]);


  return (
      <div
        className={`fixed inset-0 bg-gradient-to-br from-white to-gray-50 flex items-center justify-center transition-transform duration-700 ease-in-out ${
          show ? "translate-x-0" : "translate-x-full"
        } overflow-hidden z-[100]`}
      >
        <Background reduced={true} />
        <div className="text-center max-w-3xl unselectable w-full px-4 sm:px-8">
          <div className="mb-12">
            <h2 className="font-space text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight uppercase">
              System Processing
            </h2>
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Initiating behavioral analysis protocols...</p>
          </div>

          <div className="bg-white/90 backdrop-blur-xl border border-gray-300 rounded-xl p-8 shadow-2xl shadow-black/5 max-w-2xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.02)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-0 pointer-events-none bg-[length:100%_4px,6px_100%]"></div>
            
            <div className="space-y-8 font-mono text-sm relative z-10">

              <div className="text-left group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      loadingStep >= 0 && isInitialized 
                        ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" 
                        : "bg-gray-300"
                    }`}></div>
                    <span className={`font-bold tracking-tight ${loadingStep >= 0 ? "text-gray-900" : "text-gray-400"}`}>
                       DATA_EXTRACTION
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    loadingStep >= 0 && isInitialized 
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 text-gray-400"
                  }`}>
                    {loadingStep >= 0 && isInitialized ? "[COMPLETE]" : "[WAITING]"}
                  </span>
                </div>
                <div className="pl-5 text-xs text-gray-500">
                  Extracting behavioral data from Reddit footprint...
                </div>
              </div>

              {/* Step 2 */}
              <div className={`text-left group transition-all duration-700 ease-out ${
                loadingStep >= 1 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-50 translate-y-2"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      isTrainingComplete 
                        ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" 
                        : "bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.6)]"
                    }`}></div>
                    <span className={`font-bold tracking-tight ${loadingStep >= 1 ? "text-gray-900" : "text-gray-400"}`}>
                       PATTERN_RECOGNITION
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    isTrainingComplete 
                      ? "bg-green-100 text-green-700" 
                      : loadingStep >= 1 ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-400"
                  }`}>
                    {isTrainingComplete ? "[COMPLETE]" : loadingStep >= 1 ? "[PROCESSING]" : "[WAITING]"}
                  </span>
                </div>
                
                <div className="pl-5 mb-2 text-xs text-gray-500">
                  Analyzing {trainingCount.toLocaleString()} behavioral vectors...
                </div>

                {loadingStep === 1 && (
                    <div className="pl-5 mt-2">

                        <PatternVisualizer count={trainingCount} total={79032} />
                  </div>
                )}
              </div>

              {/* Step 3 */}
              <div className={`text-left group transition-all duration-700 ease-out ${
                loadingStep >= 2 
                  ? "opacity-100" 
                  : "opacity-0"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      finalizationProgress >= 100 
                        ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" 
                        : "bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                    }`}></div>
                    <span className={`font-bold tracking-tight ${loadingStep >= 2 ? "text-gray-900" : "text-gray-400"}`}>
                       ROAST_GENERATION
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    finalizationProgress >= 100 
                      ? "bg-green-100 text-green-700" 
                      : loadingStep >= 2 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"
                  }`}>
                    {finalizationProgress >= 100 ? "[READY]" : loadingStep >= 2 ? `${finalizationProgress}%` : "[WAITING]"}
                  </span>
                </div>

                <div className="pl-5 mt-3">
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                     <div 
                        className="h-full bg-blue-600 transition-all duration-200 ease-out relative"
                        style={{ width: `${finalizationProgress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_1s_infinite]"></div>
                      </div>
                  </div>
                </div>
              </div>

              {!isInitialized && (
                <div className="mt-8 flex justify-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-black"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-black animate-ping opacity-20"></div>
                  </div>
                </div>
              )}

            </div>
          </div>

          <div className="mt-8 text-xs text-gray-400 font-mono tracking-wide uppercase">
            System resources allocated...
          </div>
        </div>
      </div>
  );
}

// Memoized Visualizer to avoid unnecessary DOM thrashing if props strictly equal (not likely here as count changes)
// But isolating it is good practice
const PatternVisualizer = React.memo(({ count, total }) => {
    return (
        <div className="flex space-x-0.5 h-4 items-end">
            {[...Array(40)].map((_, i) => (
            <div
                key={i}
                className={`w-1.5 rounded-sm transition-all duration-100 ${
                i < (count / total) * 40
                    ? "bg-orange-500"
                    : "bg-gray-100"
                }`}
                style={{
                height: '60%',
                opacity: i < (count / total) * 40 ? 1 : 0.3
                }}
            />
            ))}
        </div>
    );
});
