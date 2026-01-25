"use client";

import React, { useState, useEffect } from "react";
import { Terminal, ChevronLeft, ChevronRight } from "lucide-react";
import UsernameForm from "@/components/UsernameForm";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import Background from "@/components/Background";
import { Toaster, toast } from "sonner";
import config from '../config.json';

const SAMPLE_ROASTS = [
  {
    username: "u/CryptoGod_69",
    roastLevel: "Critical",
    emoji: "🥀",
    roast: "You claim to be a 'visionary investor' in r/WallStreetBets but your post history is just you asking r/povertyfinance how to make ramen last for three days. You talk about 'HODLing' like it's a war strategy, but really you just lost the seed phrase to your wallet in 2021. Your personality is 50% Elon Musk retweet and 50% desperate validation seeking.",
    tags: ['#BagHolder', '#PaperHands', '#ToTheMoon...Eventually'],
    reaction: "WTF?? This is literally harassment. I actually prefer instant noodles over ramen for the sodium content. And I didn't lose my keys, I'm just forcing a long-term hold!! 🥀",
    reactionSentiment: "Angry"
  },
  {
    username: "u/GymRat_Chad",
    roastLevel: "Steroid-Fueled",
    emoji: "💪",
    roast: "Your entire personality is built around lifting heavy circles to quiet the voices in your head. You post 'form checks' solely to fish for compliments on your vascularity. You're one missed meal prep away from a complete existential breakdown. We get it, you lift. But maybe lift a book occasionally?",
    tags: ['#NeverLegDay', '#ProteinFarts', '#GymCrushDreams'],
    reaction: "Bro... why you gotta come at me like that? I read... I read the nutrition labels. That counts right? 🥺",
    reactionSentiment: "Sad"
  },
   {
    username: "u/TravelBabe_99",
    roastLevel: "Wanderlust-Cringe",
    emoji: "✈️",
    roast: "You call yourself a 'digital nomad' but you've been in the same Bali hostel for 6 months living off your parents' allowance. Your 'authentic travel experiences' are just queued Instagram posts of açai bowls. You think you're finding yourself, but you're just finding new backgrounds for selfies.",
    tags: ['#Blessed', '#RemoteWork', '#VanLifeDreams'],
    reaction: "Omg stop. I am literally shaking. My journey is valid!! And for the record, it's a co-living space, not a hostel. 💅",
    reactionSentiment: "Defensive"
  },
  {
    username: "u/IncelTears_Warrior",
    roastLevel: "Touch Grass",
    emoji: "⚔️",
    roast: "You spend 18 hours a day arguing about gender politics on Reddit while your own love life is a 404 error. You have strong opinions on relationships for someone whose only intimate contact is with a mechanical keyboard. Your 'Logic and Reason' is just a mask for being terrified of eye contact.",
    tags: ['#WhiteKnight', '#ForeverAlone', '#DebateMeBro'],
    reaction: "Actually, statistically speaking, my points are valid. I don't need ad hominem attacks to prove my intellectual superiority. *pushes up glasses* 🤓",
    reactionSentiment: "Nerdy"
  },
  {
      username: "u/Relationship_Guru_247",
      roastLevel: "Single Pringle",
      emoji: "💔",
      roast: "You write 5000-word essays on r/relationship_advice analyzing 'red flags' in strangers' marriages, yet your own longest relationship was with a sourdough starter during lockdown. You treat human connection like a math problem where the answer is always 'Break Up' and 'Hit the Gym'.",
      tags: ['#DivorceLawyerWannabe', '#ProjectingHard', '#RedFlagCollector'],
      reaction: "Excuse me? Seeing red flags is a survival skill. And my sourdough, yeast-fer-sutherland, was a very fulfilling partner. 🥖",
      reactionSentiment: "Defensive"
  }
];

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

  // Carousel State
  const [activeRoastIndex, setActiveRoastIndex] = useState(0);
  const [roastProgress, setRoastProgress] = useState(0);
  const [shuffledRoasts, setShuffledRoasts] = useState([]);
  const [slideDirection, setSlideDirection] = useState('right'); // 'left' or 'right'
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    // Shuffle roasts on mount to ensure randomness
    setShuffledRoasts([...SAMPLE_ROASTS].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (shuffledRoasts.length === 0 || isTransitioning) return;

    const interval = 100; // Update every 100ms
    const duration = 10000; // 10 seconds per slide
    const progressStep = (interval / duration) * 100;

    const timer = setInterval(() => {
      setRoastProgress(prev => {
        if (prev >= 100) {
          handleAutoSlide();
          return 0;
        }
        return prev + progressStep;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [shuffledRoasts, isTransitioning]);

  const handleAutoSlide = () => {
    changeSlide('next');
  };

  const changeSlide = (direction) => {
    if (isTransitioning) return;
    
    setSlideDirection(direction);
    setIsTransitioning(true);
    setRoastProgress(0);

    // Wait for exit animation
    setTimeout(() => {
      if (direction === 'next') {
        setActiveRoastIndex(curr => (curr + 1) % shuffledRoasts.length);
      } else {
        setActiveRoastIndex(curr => (curr - 1 + shuffledRoasts.length) % shuffledRoasts.length);
      }
      
      // Allow entering animation to play
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50); 
    }, 300); // Match CSS transition duration
  };

  const handleManualRoastChange = (direction) => {
    changeSlide(direction);
  };

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
            <a 
              href="https://bags.fm/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-[#00b824] gap-1.5 px-3 py-1.5 font-bold rounded-lg p-4 pr-5 transition-all ease-out active:scale-[0.98]"
              style={{ 
                backgroundColor: 'rgba(0, 182, 36, 0.2)', 
                border: '1px solid rgba(0, 182, 36, 0.35)' 
              }}
            >
              <img src="https://bags.fm/assets/images/bags-icon.png" className="w-4 h-4" alt="" />
              $WITR
            </a>
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
              <span className="text-xs font-bold text-gray-600 uppercase tracking-widest font-space">Introducting Wittyr v2.0</span>
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

            {/* How It Works Section */}
            <div className="mt-32 max-w-5xl mx-auto px-4">
               <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-red-50 border border-red-100 shadow-sm mb-6">
                     <span className="text-xs font-bold text-red-600 uppercase tracking-widest font-space">The Disassembly Line</span>
                  </div>
                  <h2 className="font-space text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                    From Data to Destruction
                  </h2>
                  <p className="font-outfit text-lg text-gray-500 max-w-2xl mx-auto">
                    A three-step process designed to dismantle your self-esteem efficiently.
                  </p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {[
                    { 
                      step: "01", 
                      emoji: "🕵️‍♂️",
                      title: "Stalking Your Profile", 
                      desc: "We scrape every public comment, post, and embarrassing question you've ever asked on r/relationship_advice. We see it all.",
                      color: "text-blue-600",
                      bg: "bg-blue-50 border-blue-100"
                    },
                    { 
                      step: "02", 
                      emoji: "🧠",
                      title: "Psychoanalysis", 
                      desc: "Our AI judges your grammar, your politics, and your desperate need for karma. It builds a psychological profile of a person.",
                      color: "text-purple-600",
                      bg: "bg-purple-50 border-purple-100" 
                    },
                    { 
                      step: "03", 
                      emoji: "🔥",
                      title: "Emotional Damage", 
                      desc: "We generate a customized roast that targets your specific insecurities. It's not cyberbullying if it's true (legal told us to say this).",
                      color: "text-orange-600",
                      bg: "bg-orange-50 border-orange-100"
                    }
                  ].map((item, i) => (
                    <div key={i} className={`relative flex flex-col items-start text-left group bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}>
                      <div className={`absolute top-0 right-0 p-8 opacity-10 font-space font-bold text-6xl text-gray-900 select-none group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500`}>
                        {item.step}
                      </div>
                      
                      <div className={`w-14 h-14 ${item.bg} border ${item.color} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                        {item.emoji}
                      </div>

                      <h3 className="font-space font-bold text-xl text-gray-900 mb-3 relative z-10">{item.title}</h3>
                      <p className="text-gray-500 font-outfit text-base leading-relaxed relative z-10">{item.desc}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Sample Roast Section - Vercel Style */}
            <div className="mt-32 max-w-4xl mx-auto px-4">
              <div className="text-center mb-12">
                   <h2 className="font-space text-3xl font-bold text-gray-900 mb-2">The Hall of Shame</h2>
                   <p className="font-outfit text-gray-500">Witness the casualties of truth. You're next.</p>
              </div>

              {shuffledRoasts.length > 0 && (
                <div 
                  className="relative group min-h-[460px] sm:min-h-[420px]" 
                >
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
      
                    {/* Reaction Card */}
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

                    {/* Controls & Progress */}
                    <div className="mt-8 flex items-center justify-between px-1 sm:px-4">
                      <div className="flex items-center gap-4">
                          <button 
                            onClick={() => handleManualRoastChange('prev')}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
                            disabled={isTransitioning}
                          >
                            <ChevronLeft size={20} />
                          </button>
                          
                          <div className="h-1 w-32 sm:w-48 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gray-900 transition-all duration-100 ease-linear rounded-full"
                              style={{ width: `${roastProgress}%` }}
                            ></div>
                          </div>

                          <button 
                            onClick={() => handleManualRoastChange('next')}
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
              )}
            </div>

            {/* FAQ Section - Onavix Inspired Clean Card */}
            <div className="mt-32 mb-24 max-w-3xl mx-auto px-6">
                <div className="text-center mb-12">
                     <h2 className="font-space text-2xl font-bold text-gray-900 mb-2">The Damage Control Desk</h2>
                     <p className="font-outfit text-gray-500">Questions from those in denial.</p>
                </div>
                
                <div className="w-full border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm">
                    {[
                        { 
                          q: "How does this magic work?", 
                          a: "Our AI scrapes all your comments and posts. It analyzes your most active communities, and embarrassing comments to craft a personalized reality check." 
                        },
                        { 
                          q: "Is my data safe with you?", 
                          a: "100%, We don't want your data. Have you seen your post history? It's mostly cat memes and bad financial advice. We process it and flush it immediately." 
                        },
                        { 
                          q: "Is this tool really free?", 
                          a: "It costs literally $0 but your ego might never recover." 
                        },
                        { 
                          q: "Can I roast private accounts?", 
                          a: "Nope. We can't roast ghosts. If your account is private, you're safe from us. We need public posts to fuel the roast engine, so open the gates if you want the smoke." 
                        },
                        { 
                          q: "Why is it so mean?", 
                          a: "It's called tough love babe. The AI is trained to be satirical towards your Reddit habits. If it hits a little too close to home, maybe it's time to close the app and touch grass." 
                        },
                        { 
                          q: "Can I share the punishment?", 
                          a: "If you get cooked, you might as well get some clout for it. Share it on social media, group chats, or send it to your mom so she finally understands why you're single." 
                        }
                    ].map((item, i, arr) => (
                        <div 
                          key={i} 
                          onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                          className={`group transition-colors duration-200 cursor-pointer ${i !== arr.length - 1 ? 'border-b border-gray-100' : ''} ${openFaqIndex === i ? 'bg-gray-50/50' : 'bg-white'}`}
                        >
                            <div
                              className="w-full flex items-center justify-between px-6 py-4 text-left focus:outline-none"
                            >
                              <span className="font-space font-medium text-gray-900 text-lg md:text-xl">{item.q}</span>
                              <span className={`flex-shrink-0 ml-4 flex items-center justify-center w-8 h-8 rounded-full text-gray-400 transition-all duration-300 ${openFaqIndex === i ? 'rotate-45' : 'rotate-0'}`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </span>
                            </div>
                            
                            <div 
                              className={`grid transition-all duration-300 ease-in-out ${
                                openFaqIndex === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                              }`}
                            >
                              <div className="overflow-hidden">
                                <div className="px-6 pb-5 pt-0">
                                  <p className="text-gray-500 font-outfit leading-relaxed text-sm md:text-base text-left">
                                    {item.a}
                                  </p>
                                </div>
                              </div>
                            </div>
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
