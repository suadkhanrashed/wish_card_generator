import React, { useState, useEffect } from 'react';
import { CardConfig, CardPage } from '../types';
import { decodeConfig, cn } from '../lib/utils';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, EyeOff } from 'lucide-react';

const backgrounds = {
  cosmic: 'bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black',
  neon: 'bg-gradient-to-br from-fuchsia-900 via-purple-900 to-blue-900',
  blossom: 'bg-gradient-to-br from-pink-200 via-red-100 to-rose-200',
  sunset: 'bg-gradient-to-br from-orange-500 via-red-500 to-purple-600',
  midnight: 'bg-slate-950',
  aurora: 'bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900',
  glass: 'bg-gradient-to-br from-slate-100 to-slate-300'
};

export default function RecipientMode({ encodedData, isPreview = false }: { encodedData: string, isPreview?: boolean }) {
  const [config, setConfig] = useState<CardConfig | null>(null);
  const [error, setError] = useState("");
  
  // States: 'loading' | 'too-early' | 'too-late' | 'exhausted' | 'password' | 'ready' | 'journey' | 'finished'
  const [appState, setAppState] = useState<'loading' | 'too-early' | 'too-late' | 'exhausted' | 'password' | 'ready' | 'journey' | 'finished'>('loading');
  const [visitsRemaining, setVisitsRemaining] = useState<number>(0);
  const [currentPageId, setCurrentPageId] = useState<string>("");
  const [passInput, setPassInput] = useState("");
  const [pandaOffset, setPandaOffset] = useState(0);

  useEffect(() => {
    const data = decodeConfig(encodedData);
    if (!data) {
      setError("Invalid or corrupted link.");
      setAppState('loading');
      return;
    }
    setConfig(data);
    setCurrentPageId(data.pages[0]?.id || "");

    const now = new Date();
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    if (now < start && !isPreview) {
      setAppState('too-early');
      return;
    }
    if (now > end && !isPreview) {
      setAppState('too-late');
      return;
    }

    const lsKey = `card_visits_${data.id}`;
    let visits = parseInt(localStorage.getItem(lsKey) || "0");
    
    if (visits >= data.visitLimit && !isPreview) {
      setAppState('exhausted');
      return;
    }

    if (!isPreview) {
      localStorage.setItem(lsKey, (visits + 1).toString());
      setVisitsRemaining(data.visitLimit - (visits + 1));
    } else {
      setVisitsRemaining(data.visitLimit);
    }

    if (data.requirePassword && !isPreview) {
      setAppState('password');
    } else {
      setAppState('ready');
    }

  }, [encodedData, isPreview]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passInput === config?.password) {
      setAppState('ready');
    } else {
      alert("Incorrect password!");
      setPassInput("");
    }
  };

  const startJourney = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#ec4899', '#3b82f6']
    });
    setAppState('journey');
  };

  const navigateTo = (targetId: string) => {
    if (targetId === 'finish') {
      confetti({
        particleCount: 300,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#fbbf24', '#f87171', '#34d399', '#60a5fa']
      });
      setAppState('finished');
    } else {
      setCurrentPageId(targetId);
    }
  };

  if (error) return <div className="h-screen w-full flex items-center justify-center bg-slate-900 text-white p-4 text-center">{error}</div>;
  if (!config) return <div className="h-screen w-full bg-slate-900"></div>;

  const getMessageScreen = (msg: string, emoji: string = "") => (
    <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl text-white">
        <div className="text-6xl mb-6">{emoji}</div>
        <h2 className="text-2xl font-semibold leading-relaxed font-sans">{msg}</h2>
      </motion.div>
    </div>
  );

  if (appState === 'too-early') return getMessageScreen(config.tooEarlyMessage, "⏳");
  if (appState === 'too-late') return getMessageScreen(config.tooLateMessage, "🥀");
  if (appState === 'exhausted') return getMessageScreen(config.noVisitsMessage, "👻");

  if (appState === 'password') {
    return (
      <div className="h-screen w-full bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
        <motion.div 
          animate={{ x: pandaOffset }}
          transition={{ type: "spring", stiffness: 100 }}
          onClick={() => setPandaOffset(prev => prev === 0 ? 200 : prev === 200 ? -200 : 0)}
          className="absolute z-0 opacity-80 cursor-pointer"
          style={{ top: '10%', right: '20%' }}
        >
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center relative shadow-xl">
             <div className="w-24 h-24 bg-black rounded-full relative">
                <div className="w-6 h-6 bg-white rounded-full absolute top-4 left-3"></div>
                <div className="w-6 h-6 bg-white rounded-full absolute top-4 right-3"></div>
             </div>
             <div className="w-10 h-10 bg-black rounded-full absolute -top-2 -left-2"></div>
             <div className="w-10 h-10 bg-black rounded-full absolute -top-2 -right-2"></div>
          </div>
          <p className="text-white text-center mt-2 font-medium opacity-50">Click me!</p>
        </motion.div>

        <motion.form 
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
          onSubmit={handlePasswordSubmit}
          className="z-10 max-w-sm w-full bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-2xl text-center"
        >
          <Lock className="w-12 h-12 text-white/50 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Locked</h2>
          <p className="text-slate-300 mb-8 text-sm">Enter the secret key to unlock.</p>
          <input 
            type="password" 
            value={passInput}
            onChange={e => setPassInput(e.target.value)}
            placeholder="Secret Key"
            className="w-full bg-black/30 border border-white/10 text-white p-4 rounded-xl mb-4 outline-none focus:border-indigo-500 transition text-center"
          />
          <button type="submit" className="w-full bg-white text-slate-900 font-bold py-4 rounded-xl hover:bg-slate-200 transition">
            Unlock
          </button>
        </motion.form>
      </div>
    );
  }

  const currentPage = config.pages.find(p => p.id === currentPageId);
  const firstPageBg = backgrounds[config?.pages[0]?.bgType || 'cosmic'] || backgrounds.cosmic;
  const lastPageBg = backgrounds[config?.pages[config.pages.length - 1]?.bgType || 'neon'] || backgrounds.neon;
  const currentBg = appState === 'ready' ? firstPageBg : appState === 'finished' ? lastPageBg : backgrounds[currentPage?.bgType || 'cosmic'] || backgrounds.cosmic;
  const isLightText = currentPage?.bgType !== 'blossom' && currentPage?.bgType !== 'glass';

  return (
    <div className={cn("h-screen w-full relative overflow-hidden flex flex-col font-sans transition-colors duration-1000", currentBg)}>
      {/* Warning Badge */}
      <AnimatePresence>
        {visitsRemaining < 3 && visitsRemaining > 0 && (
          <motion.div 
            initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 backdrop-blur text-white px-6 py-2 rounded-full shadow-lg text-sm font-medium whitespace-nowrap border border-red-400"
          >
            {config.visitWarningMessage.replace('{visits}', visitsRemaining.toString())}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {appState === 'ready' && (
          <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-lg w-full bg-white/10 backdrop-blur-2xl border border-white/20 p-10 rounded-[2rem] shadow-2xl text-center">
              <h1 className="text-4xl font-bold text-white mb-4">For {config.receiverName}</h1>
              <p className="text-lg text-white/80 mb-10">A special surprise from {config.senderName}</p>
              <button onClick={startJourney} className="px-8 py-4 bg-white/20 hover:bg-white/30 border border-white/30 text-white rounded-2xl font-bold text-lg backdrop-blur-md transition shadow-lg w-full flex items-center justify-center gap-2">
                Open Card ✨
              </button>
            </div>
          </motion.div>
        )}

        {appState === 'journey' && currentPage && (
          <motion.div key={currentPage.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto w-full max-w-4xl mx-auto py-12">
            
            {currentPage.photoUrl && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="w-full max-w-md aspect-square rounded-[2rem] overflow-hidden shadow-2xl mb-8 border border-white/20 relative">
                <img src={currentPage.photoUrl} alt="Memory" className="w-full h-full object-cover" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2rem]"></div>
              </motion.div>
            )}
            
            <div className={cn("max-w-2xl text-center w-full p-8 rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl mb-8 relative z-10", isLightText ? "bg-black/30 text-white" : "bg-white/40 text-slate-900")}>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">{currentPage.title.replace(/{{receiverName}}/gi, config.receiverName).replace(/{{senderName}}/gi, config.senderName)}</h2>
              <p className="text-lg md:text-xl leading-relaxed opacity-90 whitespace-pre-wrap">{currentPage.description.replace(/{{receiverName}}/gi, config.receiverName).replace(/{{senderName}}/gi, config.senderName)}</p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              {currentPage.options.map(opt => (
                <button 
                  key={opt.id}
                  onClick={() => navigateTo(opt.targetPageId)}
                  className={cn("px-8 py-4 rounded-2xl font-bold backdrop-blur-md border shadow-lg transition-all active:scale-95 text-lg", isLightText ? "bg-white/10 border-white/30 text-white hover:bg-white/20" : "bg-black/10 border-black/20 text-slate-900 hover:bg-black/20")}
                >
                  {opt.text}
                </button>
              ))}
            </div>

          </motion.div>
        )}

        {appState === 'finished' && (
          <motion.div key="finished" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex items-center justify-center p-6 relative z-10">
            <div className="max-w-lg w-full bg-white/10 backdrop-blur-2xl border border-white/20 p-10 rounded-[2rem] shadow-2xl text-center text-white">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-4xl font-bold mb-4">The End</h2>
              <p className="text-lg text-white/80">Hope you enjoyed the surprise!</p>
              
              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-sm text-white/70 mb-4">Leave a message for {config.senderName}?</p>
                <a 
                  href={`mailto:?subject=Thank you for the card!&body=Hi ${config.senderName},%0A%0AThank you so much for the amazing surprise card!%0A%0A[Your message here]`}
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition inline-block font-medium shadow-lg border border-white/10"
                >
                  Send Feedback
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
