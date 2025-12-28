"use client";

import React, { useState, useEffect } from "react";
import { Terminal } from "lucide-react";
import UsernameForm from "@/components/UsernameForm";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import Background from "@/components/Background";
import { Toaster, toast } from "sonner";
import config from '../config.json';

function PageContent() {
  const [isSliding, setIsSliding] = useState(false);
  const [showLoadingPage, setShowLoadingPage] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [hasApiError, setHasApiError] = useState(false);

  const [loadingStep, setLoadingStep] = useState(0);
  const [trainingCount, setTrainingCount] = useState(0);
  const [finalizationProgress, setFinalizationProgress] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTrainingComplete, setIsTrainingComplete] = useState(false);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const handleRoastComplete = () => {
      setShouldRedirect(true);
    };

    const handleRoastError = () => {
      setHasApiError(true);

      setShowLoadingPage(false);
      setIsSliding(false);
      setLoadingStep(0);
      setTrainingCount(0);
      setFinalizationProgress(0);
      setIsInitialized(false);
      setIsTrainingComplete(false);
      setIsStuck(false);
    };

    const handleResetHomepage = () => {
      setIsSliding(false);
      setShowLoadingPage(false);
      setShouldRedirect(false);
      setHasApiError(false);
      setLoadingStep(0);
      setTrainingCount(0);
      setFinalizationProgress(0);
      setIsInitialized(false);
      setIsTrainingComplete(false);
      setIsStuck(false);
    };

    const urlParams = new URLSearchParams(window.location.search);
    const regenerateUsername = urlParams.get('regenerate');
    
    if (regenerateUsername) {
      window.history.replaceState({}, document.title, '/');
      
      handleFormSubmit();

      setTimeout(async () => {
        try {
          const response = await fetch(`${config.url}/api/responses`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              username: regenerateUsername
            }),
          });

          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }

          const apiResponse = await response.json();
          
          if (apiResponse.success) {
            setTimeout(() => {
              if (apiResponse.redirect) {
                window.location.href = `/roast?user=${encodeURIComponent(apiResponse.username)}`;
              } else {
                window.location.href = `/roast?user=${encodeURIComponent(regenerateUsername)}`;
              }
            }, 100);
          } else {
            throw new Error(apiResponse.message || 'Failed to regenerate roast');
          }
        } catch (error) {
          console.error('Error during regenerate:', error);
          handleRoastError();
        }
      }, 1000);
    }

    window.addEventListener('roastComplete', handleRoastComplete);
    window.addEventListener('roastError', handleRoastError);
    window.addEventListener('resetHomepage', handleResetHomepage);

    return () => {
      window.removeEventListener('roastComplete', handleRoastComplete);
      window.removeEventListener('roastError', handleRoastError);
      window.removeEventListener('resetHomepage', handleResetHomepage);
    };
  }, []);

  useEffect(() => {
    if (shouldRedirect && finalizationProgress >= 100) {
      setTimeout(() => {
        window.location.href = '/roast';
      }, 1000);
    }
  }, [shouldRedirect, finalizationProgress]);

  const handleFormSubmit = () => {
    setIsSliding(true);
    setTimeout(() => {
      setShowLoadingPage(true);
      startLoadingSequence();
    }, 800);
  };

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
        setTimeout(updateCount, 50);
      } else {
        setTrainingCount(targetCount);
        setIsTrainingComplete(true);
        setTimeout(() => {
          setLoadingStep(2);
          startFinalization();
        }, 1300);
      }
    };
    
    updateCount();
  };

  const startFinalization = () => {
    const duration = 15600; // 30% slower (12000 * 1.3)
    const startTime = Date.now();
    let lastShouldRedirect = false;
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

        const currentProgress = finalizationProgress / 100;

        const t = Math.min(finishElapsed / finishDuration, 1);
        const easeOutQuad = t * (2 - t);

        progress = currentProgress + (1 - currentProgress) * easeOutQuad;
      } else {
        const elapsed = Date.now() - startTime;
        progress = Math.min(elapsed / duration, 1);

        if (progress >= 0.9) {
          progress = 0.9;
          if (!isStuck) {
            setIsStuck(true);
          }
        }
      }

      setFinalizationProgress(Math.floor(progress * 100));
      
      if (progress < 1) {
        const interval = isFinishing ? 16 : 100;
        setTimeout(updateProgress, interval);
      }
    };
    
    updateProgress();
  };

  useEffect(() => {
    if (hasApiError) {
      // toast.error('Failed to generate roast. Please try again.');
      setTimeout(() => {
        setShowLoadingPage(false);
        setIsSliding(false);
        setLoadingStep(0);
        setTrainingCount(0);
        setFinalizationProgress(0);
        setIsInitialized(false);
        setIsTrainingComplete(false);
        setIsStuck(false);
        setHasApiError(false);
        setShouldRedirect(false);
      }, 4000);
    }
  }, [hasApiError]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Toaster theme="light" position="bottom-right" richColors />
      
      {!showLoadingPage && (
        <div className="fixed top-4 left-4 right-4 z-50">
          <div className="sm:hidden flex justify-between items-start space-x-4">
            {/* <ThemeToggle /> */}
            
          </div>
          <div className="hidden sm:flex justify-between items-start">
            <div className="flex items-center space-x-3">
              {/* <ThemeToggle /> */}
            </div>
            <div className="max-w-md"></div>
          </div>
        </div>
      )}

      <div
        className={`relative min-h-screen flex flex-col transition-transform duration-500 ease-in-out ${
          isSliding ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <Background />
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative z-10">
          
          <div className="max-w-5xl mb-16 mt-24 sm:mt-20 w-full text-center">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-7">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-widest font-space">Chronically Redditor v2.0</span>
            </div>
            
            <h1 className="font-space text-4xl sm:text-7xl md:text-7xl max-w-[45rem] mx-auto font-bold tracking-tighter text-gray-900 mb-8 leading-[0.9]">
              Your Reddit History, Finally Judged.
            </h1>

            <p className="font-space text-lg sm:text-xl text-gray-500 mb-9 max-w-2xl mx-auto leading-relaxed">
              Enter your username and witness the art of digital destruction. Our sophisticated A.I roasts you by your comments and posts.
            </p>

            <UsernameForm onSubmitComplete={handleFormSubmit} />

            <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left max-w-6xl mx-auto sm:px-4 px-1">
              {[
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  ),
                  title: "Deep Analysis",
                  desc: "We analyze your entire Reddit history to find your deepest insecurities and patterns.",
                  color: "text-blue-600",
                  bg: "bg-blue-50"
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-2.072-4-3-6-.523 2-.928 4-3 6 0 1.38.5 2 1 3a2.5 2.5 0 0 0 2.5 2.5z"/><path d="M15.5 14.5A2.5 2.5 0 0 0 18 12c0-1.38-.5-2-1-3-1.072-2.143-2.072-4-3-6-.523 2-.928 4-3 6 0 1.38.5 2 1 3a2.5 2.5 0 0 0 2.5 2.5z"/><line x1="12" y1="8" x2="12" y2="16"/></svg>
                  ),
                  title: "Brutally Honest",
                  desc: "No sugar-coating. Get ready for a reality check powered by advanced AI models.",
                  color: "text-orange-600",
                  bg: "bg-orange-50"
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5c0-5.523 4.477-10 10-10z"/><path d="M8.5 8.5a2.5 2.5 0 0 0-2.5 2.5"/><path d="M15.5 8.5a2.5 2.5 0 0 1 2.5 2.5"/></svg>
                  ),
                  title: "Personality Profile",
                  desc: "Discover what your comments say about your true persona and online behavior.",
                  color: "text-purple-600",
                  bg: "bg-purple-50"
                }
              ].map((feature, idx) => (
                <div key={idx} className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-sm shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2 font-outfit">{feature.title}</h3>
                  <p className="text-base text-gray-500 font-space leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* <div className="mt-32 border-t border-gray-100 pt-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { label: "Profiles Roasted", value: "10k+" },
                  { label: "Egos Destroyed", value: "99%" },
                  // { label: "AI Models", value: "GPT-4" },
                  { label: "Accuracy", value: "100%" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="font-space text-3xl sm:text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="font-outfit text-sm text-gray-400 uppercase tracking-wider font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <p className="font-outfit text-sm text-gray-400 mt-12 tracking-wide">
              Crafted with precision. Delivered without mercy.
            </p>

            {/* What You'll Get Section */}
            <div className="mt-20 sm:mt-32 max-w-4xl mx-auto">
              <h2 className="font-space text-3xl sm:text-4xl font-bold text-gray-900 mb-1 tracking-tight">
                What Awaits You
              </h2>
              <p className="font-outfit text-lg text-gray-500 mb-12">
                Brace yourself for a multi-dimensional personality autopsy
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    emoji: "🔥",
                    title: "The Ultimate Roast",
                    desc: "A savage breakdown of your Reddit persona. No survivors, no apologies.",
                    gradient: "from-red-50 to-orange-50"
                  },
                  {
                    emoji: "💪",
                    title: "Hidden Strengths",
                    desc: "We'll admit when you're not completely hopeless. Rare, but it happens.",
                    gradient: "from-green-50 to-emerald-50"
                  },
                  {
                    emoji: "💔",
                    title: "Weakness Exposed",
                    desc: "Every flaw, insecurity, and cringe moment laid bare for all to see.",
                    gradient: "from-purple-50 to-pink-50"
                  },
                  {
                    emoji: "💘",
                    title: "Love Life Analysis",
                    desc: "Spoiler: Your Reddit history explains why you're still single.",
                    gradient: "from-pink-50 to-rose-50"
                  }
                ].map((item, idx) => (
                  <div key={idx} className={`relative p-6 rounded-2xl bg-gradient-to-br ${item.gradient} border border-gray-100 hover:scale-[1.02] transition-transform ease-out duration-300 cursor-default`}>
                    <div className="text-4xl mb-3">{item.emoji}</div>
                    <h3 className="font-space text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="font-outfit max-w-[19rem] mx-auto text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        <Footer />
      </div>

      <div
        className={`fixed inset-0 bg-gradient-to-br from-white to-gray-50 flex items-center justify-center transition-transform duration-700 ease-in-out ${
          showLoadingPage ? "translate-x-0" : "translate-x-full"
        } overflow-hidden`}
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
                    <div className="flex space-x-0.5 h-4 items-end">
                      {[...Array(40)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 rounded-sm transition-all duration-100 ${
                            i < (trainingCount / 79032) * 40
                              ? "bg-orange-500"
                              : "bg-gray-100"
                          }`}
                          style={{
                            height: '60%',
                            opacity: i < (trainingCount / 79032) * 40 ? 1 : 0.3
                          }}
                        />
                      ))}
                    </div>
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
    </div>
  );
}

export default function Page() {
  return (
    <PageContent />
  );
}
