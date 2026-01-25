import React from 'react';

export default function Background({ reduced = false }) {
  return (
    <>
      <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-[0.03]"></div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-gray-50/50 to-white"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none select-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-[100px] animate-pulse"></div>
        {/* <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-200/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div> */}
        
        {/* Left Side - Distributed vertically */}
        <div className="absolute top-[10%] left-[2%] md:left-[2%] text-5xl md:text-7xl opacity-20 animate-float-slow hover:opacity-40 transition-opacity duration-300">💀</div>
        {!reduced && <div className="absolute top-[21%] left-[2%] md:left-[8%] text-3xl md:text-5xl opacity-15 animate-float-fast delay-2000 hover:opacity-40 transition-opacity duration-300 hidden md:block">🤡</div>}
        <div className="absolute top-[40%] left-[-1%] md:left-[4%] text-4xl md:text-6xl opacity-10 animate-float-slow delay-1000 hover:opacity-40 transition-opacity duration-300">🔥</div>
        {!reduced && <div className="absolute top-[55%] left-[3%] md:left-[10%] text-3xl md:text-5xl opacity-15 animate-float-medium delay-1800 hover:opacity-40 transition-opacity duration-300 hidden md:block">🚩</div>}
        <div className="absolute top-[75%] left-[1%] md:left-[5%] text-4xl md:text-6xl opacity-15 animate-float-slow delay-700 hover:opacity-40 transition-opacity duration-300">✨</div>
        {!reduced && <div className="absolute top-[85%] left-[2%] md:left-[8%] text-3xl md:text-5xl opacity-20 animate-float-fast delay-3500 hover:opacity-40 transition-opacity duration-300 hidden md:block">😭</div>}
        <div className="absolute top-[4%] left-[8%] md:left-[14%] text-3xl md:text-6xl opacity-15 animate-float-fast delay-3000 hover:opacity-40 transition-opacity duration-300 hidden md:block">💅</div>
        <div className="absolute top-[31%] left-[5%] md:left-[13%] text-4xl md:text-6xl opacity-10 animate-float-slow delay-900 hover:opacity-40 transition-opacity duration-300 hidden md:block">🤓</div>

        {/* New Additions based on Red Circles */}
        {/* <div className="absolute top-[2%] left-[2%] md:left-[5%] text-4xl md:text-6xl opacity-15 animate-float-medium delay-500 hover:opacity-40 transition-opacity duration-300">👻</div> */}
        <div className="absolute top-[5%] left-[25%] md:left-[30%] text-3xl md:text-5xl opacity-10 animate-float-slow delay-1500 hover:opacity-40 transition-opacity duration-300 hidden md:block">🧠</div>
        {!reduced && <div className="absolute top-[20%] left-[15%] md:left-[19%] text-4xl md:text-5xl opacity-15 animate-float-fast delay-2500 hover:opacity-40 transition-opacity duration-300 hidden md:block">🍆</div>}
        <div className="absolute top-[35%] right-[-2%] md:right-[1%] text-3xl md:text-5xl opacity-15 animate-float-medium delay-1000 hover:opacity-40 transition-opacity duration-300">🤖</div>
        <div className="absolute top-[65%] left-[11%] md:left-[11%] text-4xl md:text-6xl opacity-10 animate-float-slow delay-3000 hover:opacity-40 transition-opacity duration-300 hidden md:block">🍑</div>
        
        <div className="absolute top-[5%] right-[25%] md:right-[22%] text-3xl md:text-5xl opacity-10 animate-float-medium delay-2000 hover:opacity-40 transition-opacity duration-300 hidden md:block">👽</div>
        {/* <div className="absolute top-[2%] right-[5%] md:right-[10%] text-4xl md:text-6xl opacity-15 animate-float-fast delay-1000 hover:opacity-40 transition-opacity duration-300">👽</div> */}

        <div className="absolute top-[7%] right-[-2%] md:right-[3%] text-6xl md:text-7xl opacity-10 animate-float-medium delay-1000 hover:opacity-40 transition-opacity duration-300">😭</div>
        {!reduced && <div className="absolute top-[27%] right-[2%] md:right-[10%] text-4xl md:text-6xl opacity-20 animate-float-slow delay-500 hover:opacity-40 transition-opacity duration-300 hidden md:block">🧢</div>}
        <div className="absolute top-[43%] right-[-1%] md:right-[5%] text-4xl md:text-7xl opacity-10 animate-float-medium delay-1500 hover:opacity-40 transition-opacity duration-300">🗿</div>
        {!reduced && <div className="absolute top-[60%] right-[4%] md:right-[12%] text-3xl md:text-5xl opacity-15 animate-float-medium delay-2200 hover:opacity-40 transition-opacity duration-300 hidden md:block">🤪</div>}
        <div className="absolute top-[75%] right-[1%] md:right-[6%] text-4xl md:text-6xl opacity-10 animate-float-medium delay-2500 hover:opacity-40 transition-opacity duration-300">🫠</div>
        {!reduced && <div className="absolute top-[90%] right-[3%] md:right-[8%] text-5xl md:text-7xl opacity-10 animate-float-slow delay-4000 hover:opacity-40 transition-opacity duration-300">🗑️</div>}
        <div className="absolute top-[15%] right-[8%] md:right-[15%] text-3xl md:text-6xl opacity-15 animate-float-medium delay-2000 hover:opacity-40 transition-opacity duration-300 hidden md:block">👀</div>
        {!reduced && <div className="absolute top-[33%] right-[5%] md:right-[20%] text-2xl md:text-5xl opacity-20 animate-float-fast delay-1200 hover:opacity-40 transition-opacity duration-300 hidden md:block">🤌</div>}

        {/* Bottom Section - New emojis for extended page */}
        <div className="absolute top-[95%] left-[3%] md:left-[6%] text-4xl md:text-6xl opacity-15 animate-float-slow delay-1500 hover:opacity-40 transition-opacity duration-300">💀</div>
        {!reduced && <div className="absolute top-[105%] left-[10%] md:left-[15%] text-3xl md:text-5xl opacity-10 animate-float-fast delay-2800 hover:opacity-40 transition-opacity duration-300 hidden md:block">🎭</div>}
        <div className="absolute top-[115%] right-[2%] md:right-[5%] text-4xl md:text-6xl opacity-15 animate-float-medium delay-3200 hover:opacity-40 transition-opacity duration-300">💔</div>
        {!reduced && <div className="absolute top-[100%] right-[12%] md:right-[18%] text-3xl md:text-5xl opacity-10 animate-float-slow delay-1800 hover:opacity-40 transition-opacity duration-300 hidden md:block">🧊</div>}
        <div className="absolute top-[110%] left-[1%] md:left-[4%] text-5xl md:text-7xl opacity-10 animate-float-medium delay-2200 hover:opacity-40 transition-opacity duration-300">🔥</div>
        {!reduced && <div className="absolute top-[120%] left-[8%] md:left-[12%] text-3xl md:text-5xl opacity-15 animate-float-fast delay-3600 hover:opacity-40 transition-opacity duration-300 hidden md:block">😵</div>}
        <div className="absolute top-[125%] right-[3%] md:right-[7%] text-4xl md:text-6xl opacity-10 animate-float-slow delay-2600 hover:opacity-40 transition-opacity duration-300">☠️</div>
        {!reduced && <div className="absolute top-[108%] left-[20%] md:left-[25%] text-3xl md:text-5xl opacity-15 animate-float-medium delay-1400 hover:opacity-40 transition-opacity duration-300 hidden md:block">🤡</div>}
        <div className="absolute top-[118%] right-[15%] md:right-[20%] text-4xl md:text-6xl opacity-10 animate-float-fast delay-3000 hover:opacity-40 transition-opacity duration-300 hidden md:block">🪦</div>
        {!reduced && <div className="absolute top-[130%] left-[5%] md:left-[8%] text-3xl md:text-5xl opacity-15 animate-float-slow delay-2000 hover:opacity-40 transition-opacity duration-300 hidden md:block">💅</div>}
        <div className="absolute top-[135%] right-[1%] md:right-[4%] text-4xl md:text-6xl opacity-10 animate-float-medium delay-3400 hover:opacity-40 transition-opacity duration-300">🗿</div>
      </div>
    </>
  );
}
