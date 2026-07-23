import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function AIGenerator({ 
  onGenerate, 
  receiverName, 
  senderName 
}: { 
  onGenerate: (text: string) => void,
  receiverName: string,
  senderName: string
}) {
  const [loading, setLoading] = useState(false);
  const [eventType, setEventType] = useState("Birthday");
  const [tone, setTone] = useState("joyful and heartfelt");

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, receiverName, senderName, tone })
      });
      const data = await res.json();
      if (data.message) {
        onGenerate(data.message);
      } else if (data.error) {
        alert("AI Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to AI server.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-indigo-900/30 border border-indigo-500/30 p-4 rounded-xl mt-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="text-indigo-400" size={18} />
        <h4 className="text-sm font-semibold text-indigo-300">AI Message Generator</h4>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input 
          type="text" 
          value={eventType} 
          onChange={e => setEventType(e.target.value)} 
          placeholder="Event (e.g. Birthday, Graduation)"
          className="bg-slate-900 p-2 text-sm rounded-lg border border-slate-700 outline-none focus:border-indigo-500 text-slate-200"
        />
        <select 
          value={tone}
          onChange={e => setTone(e.target.value)}
          className="bg-slate-900 p-2 text-sm rounded-lg border border-slate-700 outline-none focus:border-indigo-500 text-slate-200"
        >
          <option value="joyful and heartfelt">Joyful</option>
          <option value="funny and sarcastic">Funny</option>
          <option value="romantic and sweet">Romantic</option>
          <option value="professional and warm">Professional</option>
        </select>
      </div>
      <button 
        onClick={handleGenerate} 
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-2 rounded-lg text-sm font-medium transition"
      >
        {loading ? 'Generating...' : 'Generate with AI ✨'}
      </button>
    </div>
  );
}
