"use client";

import React, { useState, useEffect } from "react";
import UsernameForm from "@/components/UsernameForm";
import Footer from "@/components/Footer";
import Background from "@/components/Background";
import { Toaster, toast } from "sonner";
import config from '../config.json';
import RoastCarousel from "@/components/RoastCarousel";
import FAQ from "@/components/FAQ";
import LoadingOverlay from "@/components/LoadingOverlay";

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

  useEffect(() => {
    const handleRoastComplete = () => {
      setShouldRedirect(true);
    };

    const handleRoastError = () => {
      setHasApiError(true);

      setShowLoadingPage(false);
      setIsSliding(false);
    };

    const handleResetHomepage = () => {
      setIsSliding(false);
      setShowLoadingPage(false);
      setShouldRedirect(false);
      setHasApiError(false);
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

  const handleFormSubmit = () => {
    setIsSliding(true);
    setTimeout(() => {
      setShowLoadingPage(true);
    }, 800);
  };

  useEffect(() => {
    if (hasApiError) {
      setTimeout(() => {
        setShowLoadingPage(false);
        setIsSliding(false);
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
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              {/* <ThemeToggle /> */}
            </div>
            {/* <a 
              href="https://bags.fm/jhGYMNKRjZQ9jvH3sqMXuJLkh7YqhTm46VY61KVBAGS" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-[#00b824] gap-1.5 px-3 py-1.5 font-bold rounded-lg p-4 pr-5 transition-all ease-out active:scale-[0.98]"
              style={{ 
                backgroundColor: 'rgba(0, 182, 36, 0.2)', 
                border: '1px solid rgba(0, 182, 36, 0.35)' 
              }}
            >
              <img src="https://bags.fm/assets/images/bags-icon.png" className="w-4 h-4" alt="" />
              $WITTY
            </a> */}
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

              <RoastCarousel roasts={SAMPLE_ROASTS} />
            </div>

            {/* FAQ Section - Onavix Inspired Clean Card */}
            <FAQ />


          </div>
        </div>

        <Footer />
      </div>

      <LoadingOverlay 
        show={showLoadingPage} 
        hasApiError={hasApiError} 
        shouldRedirect={shouldRedirect}
      />
    </div>
  );
}

export default function Page() {
  return (
    <PageContent />
  );
}
