import React, { useState } from "react";

export default function FAQ() {
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const faqItems = [
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
    ];

    return (
        <div className="mt-32 mb-24 max-w-3xl mx-auto px-6">
            <div className="text-center mb-12">
                    <h2 className="font-space text-2xl font-bold text-gray-900 mb-2">The Damage Control Desk</h2>
                    <p className="font-outfit text-gray-500">Questions from those in denial.</p>
            </div>
            
            <div className="w-full border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm">
                {faqItems.map((item, i, arr) => (
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
    );
}
