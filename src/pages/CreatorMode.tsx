import React, { useState, useEffect } from 'react';
import { CardConfig, CardPage, BgType } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { defaultTemplates } from '../lib/templates';
import { encodeConfig } from '../lib/utils';
import { Settings, Image, MessageSquare, Clock, Shield, Share2, Eye, Plus, Trash2, Smartphone } from 'lucide-react';
import RecipientMode from './RecipientMode';
import { QRCodeSVG } from 'qrcode.react';
import AIGenerator from '../components/AIGenerator';

const emptyConfig: CardConfig = {
  id: uuidv4(),
  receiverName: "Friend",
  senderName: "Me",
  startTime: new Date().toISOString().slice(0, 16),
  endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  visitLimit: 5,
  tooEarlyMessage: "This card is waiting for the peak time... ⏳",
  tooLateMessage: "The magic has faded away! ✨",
  noVisitsMessage: "This card has vanished forever! 👻",
  visitWarningMessage: "⚠️ Warning: Only {visits} visits left before this card vanishes forever!",
  requirePassword: false,
  password: "",
  pages: [
    {
      id: "page-1",
      title: "A Special Surprise",
      description: "Click below to open your card.",
      photoUrl: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=600&auto=format&fit=crop",
      bgType: "cosmic",
      options: [
        { id: "opt-1", text: "Open ✨", targetPageId: "finish" }
      ]
    }
  ]
};

export default function CreatorMode() {
  const [config, setConfig] = useState<CardConfig>(emptyConfig);
  const [previewMode, setPreviewMode] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [activeTab, setActiveTab] = useState<'settings' | 'pages'>('settings');

  const loadTemplate = (key: keyof typeof defaultTemplates) => {
    const template = defaultTemplates[key];
    setConfig({
      ...template,
      id: uuidv4(),
      startTime: new Date().toISOString().slice(0, 16),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    });
  };

  const handleGenerateLink = () => {
    const encoded = encodeConfig(config);
    const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
    setGeneratedLink(url);
  };

  const addPage = () => {
    const newPage: CardPage = {
      id: uuidv4(),
      title: "New Page",
      description: "Description here.",
      photoUrl: "",
      bgType: "cosmic",
      options: []
    };
    setConfig(c => ({ ...c, pages: [...c.pages, newPage] }));
  };

  const updatePage = (id: string, updates: Partial<CardPage>) => {
    setConfig(c => ({
      ...c,
      pages: c.pages.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  };

  const deletePage = (id: string) => {
    setConfig(c => ({
      ...c,
      pages: c.pages.filter(p => p.id !== id)
    }));
  };

  if (previewMode) {
    return (
      <div className="relative w-full h-screen">
        <div className="absolute top-4 left-4 z-50 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl flex gap-4 text-white">
          <button onClick={() => setPreviewMode(false)} className="px-4 py-2 bg-black/50 rounded-lg hover:bg-black/70 transition">
            Exit Preview
          </button>
        </div>
        <RecipientMode encodedData={encodeConfig(config)} isPreview={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              ✨ Surprise Card Generator
            </h1>
            <p className="text-slate-400">Create magical, self-destructing greeting cards.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setPreviewMode(true)} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-lg shadow-indigo-900/20 font-medium">
              <Eye size={18} /> Preview
            </button>
            <button onClick={handleGenerateLink} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition shadow-lg shadow-pink-900/20 font-medium">
              <Share2 size={18} /> Generate Link
            </button>
          </div>
        </header>

        {generatedLink && (
          <div className="mb-8 p-6 bg-slate-800 rounded-2xl border border-green-500/30 flex flex-col items-center gap-6 shadow-xl">
            <h3 className="text-xl font-bold text-green-400">🎉 Your Card is Ready!</h3>
            
            <div className="flex w-full gap-4 items-center">
              <input type="text" readOnly value={generatedLink} className="flex-1 bg-slate-900 p-4 rounded-xl text-slate-300 font-mono text-sm border border-slate-700 outline-none" />
              <button onClick={() => navigator.clipboard.writeText(generatedLink)} className="px-6 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl transition font-medium">
                Copy
              </button>
            </div>

            <a href={generatedLink} target="_blank" rel="noreferrer" className="bg-white p-4 rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition-transform block">
              <QRCodeSVG value={generatedLink} size={200} />
            </a>

            <div className="flex gap-4">
              <a href={`https://wa.me/?text=${encodeURIComponent('I made a surprise for you! ' + generatedLink)}`} target="_blank" rel="noreferrer" className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl transition text-white font-medium">WhatsApp</a>
              <a href={`mailto:?subject=A surprise for you!&body=${encodeURIComponent('Open it here: ' + generatedLink)}`} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition text-white font-medium">Email</a>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          <aside className="space-y-4">
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-white">Templates</h2>
              <div className="space-y-2">
                <button onClick={() => loadTemplate('birthday')} className="w-full text-left px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition">🎂 Birthday</button>
                <button onClick={() => loadTemplate('anniversary')} className="w-full text-left px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition">❤️ Anniversary</button>
                <button onClick={() => loadTemplate('congratulations')} className="w-full text-left px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition">🎉 Congratulations</button>
              </div>
            </div>

            <div className="bg-slate-800 p-2 rounded-2xl border border-slate-700 flex flex-col">
              <button onClick={() => setActiveTab('settings')} className={`px-4 py-3 rounded-xl transition text-left ${activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700'}`}>
                General Settings
              </button>
              <button onClick={() => setActiveTab('pages')} className={`px-4 py-3 rounded-xl transition text-left ${activeTab === 'pages' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700'}`}>
                Page Builder
              </button>
            </div>
          </aside>

          <main className="bg-slate-800 rounded-2xl border border-slate-700 p-6 md:p-8 shadow-xl">
            {activeTab === 'settings' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <section>
                  <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2"><Settings size={20}/> Basic Info</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Receiver Name</label>
                      <input type="text" value={config.receiverName} onChange={e => setConfig({...config, receiverName: e.target.value})} className="w-full bg-slate-900 p-3 rounded-xl border border-slate-700 outline-none focus:border-indigo-500 transition" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Sender Name</label>
                      <input type="text" value={config.senderName} onChange={e => setConfig({...config, senderName: e.target.value})} className="w-full bg-slate-900 p-3 rounded-xl border border-slate-700 outline-none focus:border-indigo-500 transition" />
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2"><Clock size={20}/> Time Window & Limits</h3>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Start Time (Local)</label>
                      <input type="datetime-local" value={config.startTime} onChange={e => setConfig({...config, startTime: e.target.value})} className="w-full bg-slate-900 p-3 rounded-xl border border-slate-700 outline-none focus:border-indigo-500 transition [color-scheme:dark]" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">End Time (Local)</label>
                      <input type="datetime-local" value={config.endTime} onChange={e => setConfig({...config, endTime: e.target.value})} className="w-full bg-slate-900 p-3 rounded-xl border border-slate-700 outline-none focus:border-indigo-500 transition [color-scheme:dark]" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Max Visits (1-11)</label>
                      <input type="number" min="1" max="11" value={config.visitLimit} onChange={e => setConfig({...config, visitLimit: parseInt(e.target.value)})} className="w-full bg-slate-900 p-3 rounded-xl border border-slate-700 outline-none focus:border-indigo-500 transition" />
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2"><Shield size={20}/> Security</h3>
                  <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-700">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={config.requirePassword} onChange={e => setConfig({...config, requirePassword: e.target.checked})} className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500" />
                      <span>Require Password to Open</span>
                    </label>
                    {config.requirePassword && (
                      <input type="text" placeholder="Enter secret password..." value={config.password} onChange={e => setConfig({...config, password: e.target.value})} className="flex-1 bg-slate-800 p-2 rounded-lg border border-slate-600 outline-none focus:border-indigo-500 transition" />
                    )}
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2"><MessageSquare size={20}/> System Messages</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Too Early Message</label>
                      <input type="text" value={config.tooEarlyMessage} onChange={e => setConfig({...config, tooEarlyMessage: e.target.value})} className="w-full bg-slate-900 p-3 rounded-xl border border-slate-700 outline-none focus:border-indigo-500 transition" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Too Late Message</label>
                      <input type="text" value={config.tooLateMessage} onChange={e => setConfig({...config, tooLateMessage: e.target.value})} className="w-full bg-slate-900 p-3 rounded-xl border border-slate-700 outline-none focus:border-indigo-500 transition" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">No Visits Left Message</label>
                      <input type="text" value={config.noVisitsMessage} onChange={e => setConfig({...config, noVisitsMessage: e.target.value})} className="w-full bg-slate-900 p-3 rounded-xl border border-slate-700 outline-none focus:border-indigo-500 transition" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Visit Warning Format (Use {'{visits}'} for number)</label>
                      <input type="text" value={config.visitWarningMessage} onChange={e => setConfig({...config, visitWarningMessage: e.target.value})} className="w-full bg-slate-900 p-3 rounded-xl border border-slate-700 outline-none focus:border-indigo-500 transition" />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'pages' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-white">Journey Pages</h3>
                  <button onClick={addPage} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm">
                    <Plus size={16} /> Add Page
                  </button>
                </div>

                <div className="space-y-6">
                  {config.pages.map((page, index) => (
                    <div key={page.id} className="bg-slate-900 rounded-2xl border border-slate-700 p-6 shadow-inner relative overflow-hidden group">
                       <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition">
                         {config.pages.length > 1 && (
                           <button onClick={() => deletePage(page.id)} className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition">
                             <Trash2 size={16} />
                           </button>
                         )}
                       </div>
                       
                       <div className="mb-4">
                         <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-medium text-slate-400 border border-slate-700">Page {index + 1}</span>
                       </div>

                       <div className="grid gap-4">
                          <div>
                            <label className="block text-sm text-slate-400 mb-1">Title <span className="text-xs text-slate-500">(Use {'{{receiverName}}'} or {'{{senderName}}'})</span></label>
                            <input type="text" value={page.title} onChange={e => updatePage(page.id, { title: e.target.value })} className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 outline-none focus:border-indigo-500 transition text-white" />
                          </div>
                          <div>
                            <label className="block text-sm text-slate-400 mb-1">Description <span className="text-xs text-slate-500">(Use {'{{receiverName}}'} or {'{{senderName}}'})</span></label>
                            <textarea value={page.description} onChange={e => updatePage(page.id, { description: e.target.value })} className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 outline-none focus:border-indigo-500 transition text-white min-h-[100px]" />
                            <AIGenerator 
                              receiverName={config.receiverName} 
                              senderName={config.senderName} 
                              onGenerate={(text) => updatePage(page.id, { description: text })} 
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-slate-400 mb-1">Photo URL (Google Drive / Direct Link)</label>
                              <div className="flex gap-2">
                                <Image className="text-slate-500 mt-3" size={20} />
                                <input type="text" value={page.photoUrl} onChange={e => updatePage(page.id, { photoUrl: e.target.value })} placeholder="https://..." className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 outline-none focus:border-indigo-500 transition text-white" />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm text-slate-400 mb-1">Background Theme</label>
                              <select value={page.bgType} onChange={e => updatePage(page.id, { bgType: e.target.value as BgType })} className="w-full bg-slate-800 p-3 rounded-xl border border-slate-700 outline-none focus:border-indigo-500 transition text-white appearance-none">
                                <option value="cosmic">Cosmic Space</option>
                                <option value="neon">Neon Cyberpunk</option>
                                <option value="blossom">Cherry Blossom</option>
                                <option value="sunset">Sunset Vibes</option>
                                <option value="midnight">Midnight Dark</option>
                                <option value="aurora">Aurora Borealis</option>
                                <option value="glass">Pure Glass</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-slate-800">
                            <label className="block text-sm font-semibold text-slate-300 mb-3">Navigation Buttons</label>
                            <div className="space-y-3">
                              {page.options.map((opt, oIdx) => (
                                <div key={opt.id} className="flex gap-3 items-center">
                                  <input type="text" value={opt.text} onChange={e => {
                                    const newOpts = [...page.options];
                                    newOpts[oIdx].text = e.target.value;
                                    updatePage(page.id, { options: newOpts });
                                  }} className="flex-1 bg-slate-800 p-2 rounded-lg border border-slate-700 outline-none focus:border-indigo-500 text-sm" placeholder="Button Text" />
                                  
                                  <select value={opt.targetPageId} onChange={e => {
                                    const newOpts = [...page.options];
                                    newOpts[oIdx].targetPageId = e.target.value;
                                    updatePage(page.id, { options: newOpts });
                                  }} className="w-[150px] bg-slate-800 p-2 rounded-lg border border-slate-700 outline-none focus:border-indigo-500 text-sm text-white">
                                    <option value="finish">🎉 Finish</option>
                                    {config.pages.map((p, pIdx) => (
                                      <option key={p.id} value={p.id}>Page {pIdx + 1}</option>
                                    ))}
                                  </select>
                                  
                                  <button onClick={() => {
                                    const newOpts = page.options.filter(o => o.id !== opt.id);
                                    updatePage(page.id, { options: newOpts });
                                  }} className="p-2 text-slate-500 hover:text-red-400 transition">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              ))}
                              
                              <button onClick={() => {
                                updatePage(page.id, { options: [...page.options, { id: uuidv4(), text: "Next", targetPageId: "finish" }] });
                              }} className="text-sm text-indigo-400 hover:text-indigo-300 py-2 transition font-medium">
                                + Add Button
                              </button>
                            </div>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
