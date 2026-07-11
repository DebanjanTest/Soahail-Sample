import { Trophy, Compass } from 'lucide-react';

const FOOTBALL_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop', desc: 'World Cup Match Action' },
  { url: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=600&auto=format&fit=crop', desc: 'Stadium Lights Atmosphere' },
  { url: 'https://images.unsplash.com/photo-1577223625856-745811f261c1?q=80&w=600&auto=format&fit=crop', desc: 'Striker Goal Shot' },
  { url: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=600&auto=format&fit=crop', desc: 'World Cup Fans' },
  { url: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=600&auto=format&fit=crop', desc: 'Green Soccer Field' },
  { url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=600&auto=format&fit=crop', desc: 'Midfielder Dribbling' },
  { url: 'https://images.unsplash.com/photo-1431324155629-1a6edd1d141e?q=80&w=600&auto=format&fit=crop', desc: 'Wembley Match Day' },
  { url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop', desc: 'Championship Tackles' },
  { url: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=600&auto=format&fit=crop', desc: 'Goal Celebration' },
  { url: 'https://images.unsplash.com/photo-1624887009213-053e198b15d2?q=80&w=600&auto=format&fit=crop', desc: 'Goalpost Net' },
  { url: 'https://images.unsplash.com/photo-1552667680-d5440977ec48?q=80&w=600&auto=format&fit=crop', desc: 'Pro Match Referee' },
  { url: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=600&auto=format&fit=crop', desc: 'Golden Hour Training' }
];

export default function ExpoSection() {
  // Duplicate images list to enable seamless vertical looping
  const tickerImages = [...FOOTBALL_IMAGES, ...FOOTBALL_IMAGES];

  return (
    <section 
      id="section-expo" 
      className="snap-section pt-20 pb-8 flex flex-col justify-center items-center w-full overflow-hidden h-screen relative select-none"
    >
      {/* Decorative Expo Grid mesh lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-0"></div>

      {/* Decorative text badge on the sides (inspired by Webflow layout) */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-left hidden xl:flex items-center gap-3 text-white/20 font-heading text-xs tracking-widest uppercase">
        <Trophy size={14} className="text-desi-lime-500/30" /> World Cup 2026 Showroom
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 rotate-90 origin-right hidden xl:flex items-center gap-3 text-white/20 font-heading text-xs tracking-widest uppercase">
        Rollover to unfold 3D Screen <Compass size={14} className="text-bhangra-pink-500/30" />
      </div>

      {/* Main 3D accordion container */}
      <div className="max-w-4xl w-full flex flex-col items-center z-10 px-4 md:px-0">
        
        {/* Section Heading */}
        <div className="text-center mb-6 space-y-2">
          <span className="px-2.5 py-1 rounded bg-desi-lime-500/10 text-desi-lime-500 border border-desi-lime-500/20 font-mono text-3xs uppercase tracking-widest">
            🔴 Track 02 • Rollover Expo
          </span>
          <h2 className="font-heading text-xl md:text-3xl font-black uppercase text-white tracking-tight leading-none">
            World Cup 2026 Gallery
          </h2>
          <p className="text-2xs font-mono text-kulfi-white-400 uppercase tracking-widest">
            Rollover/Hover to unfold the 3D projection screen
          </p>
        </div>

        {/* 3D Fold Viewport screen */}
        <div className="screen-3d w-full flex items-center justify-center h-[50vh] md:h-[55vh]">
          <div className="wrapper-3d group cursor-pointer relative">
            
            {/* 1. Fold Top */}
            <div className="fold fold-top">
              <div className="fold-align" style={{ transform: 'translateY(16.66vh)' }}>
                <div className="ticker-track">
                  {tickerImages.map((img, i) => (
                    <div key={`top-${i}`} className="ticker-card">
                      <img 
                        src={img.url} 
                        alt={img.desc}
                        className="w-full h-full object-cover filter brightness-[0.8] grayscale hover:grayscale-0 hover:brightness-100 transition-all duration-300"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Fold Center (flat middle fold) */}
            <div className="fold fold-center">
              <div className="fold-align">
                <div className="ticker-track">
                  {tickerImages.map((img, i) => (
                    <div key={`center-${i}`} className="ticker-card">
                      <img 
                        src={img.url} 
                        alt={img.desc}
                        className="w-full h-full object-cover filter brightness-[0.8] grayscale hover:grayscale-0 hover:brightness-100 transition-all duration-300"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Fold Bottom */}
            <div className="fold fold-bottom">
              <div className="fold-align" style={{ transform: 'translateY(-16.66vh)' }}>
                <div className="ticker-track">
                  {tickerImages.map((img, i) => (
                    <div key={`bottom-${i}`} className="ticker-card">
                      <img 
                        src={img.url} 
                        alt={img.desc}
                        className="w-full h-full object-cover filter brightness-[0.8] grayscale hover:grayscale-0 hover:brightness-100 transition-all duration-300"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center laser line overlay */}
            <div className="absolute inset-y-0 left-0 right-0 border-y border-desi-lime-500/10 pointer-events-none z-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
