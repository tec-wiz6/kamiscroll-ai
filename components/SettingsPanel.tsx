
import React from 'react';
import { Genre, Tone, TwistIntensity, AppState } from '../types';

interface SettingsPanelProps {
  config: AppState;
  setConfig: React.Dispatch<React.SetStateAction<AppState>>;
  onGenerate: () => void;
  isLoading: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ config, setConfig, onGenerate, isLoading }) => {
  const handleChange = (key: keyof AppState, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <section>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Core Idea</label>
        <textarea 
          placeholder="e.g. A broke high-schooler makes a pact with a fox demon in Tokyo..."
          className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
          value={config.prompt}
          onChange={(e) => handleChange('prompt', e.target.value)}
        />
        <p className="text-[10px] text-slate-500 mt-1 italic">Keep it short, the AI will expand the plot.</p>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <section>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Genre</label>
          <select 
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={config.genre}
            onChange={(e) => handleChange('genre', e.target.value)}
          >
            {Object.values(Genre).map(g => (
              <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
            ))}
          </select>
        </section>

        <section>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tone</label>
          <select 
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={config.tone}
            onChange={(e) => handleChange('tone', e.target.value)}
          >
            {Object.values(Tone).map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </section>
      </div>

      <section>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Twist Intensity</label>
        <select 
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={config.twistIntensity}
          onChange={(e) => handleChange('twistIntensity', e.target.value)}
        >
          {Object.values(TwistIntensity).map(t => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <section>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pages</label>
          <input 
            type="number" 
            min="1" max="10"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={config.pageCount}
            onChange={(e) => handleChange('pageCount', parseInt(e.target.value))}
          />
        </section>

        <section>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Panels/Page</label>
          <input 
            type="number" 
            min="2" max="6"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={config.panelsPerPage}
            onChange={(e) => handleChange('panelsPerPage', parseInt(e.target.value))}
          />
        </section>
      </div>

      <button 
        disabled={isLoading || !config.prompt}
        onClick={onGenerate}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-white shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <><i className="fas fa-circle-notch animate-spin"></i> GENERATING...</>
        ) : (
          <><i className="fas fa-magic"></i> SUMMON MANHWA</>
        )}
      </button>

      <div className="pt-6 border-t border-slate-800">
        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Tips</p>
        <ul className="text-[11px] text-slate-400 space-y-1">
          <li><i className="fas fa-check text-blue-500 mr-2"></i> Use clear character names.</li>
          <li><i className="fas fa-check text-blue-500 mr-2"></i> Specify a city if needed.</li>
          <li><i className="fas fa-check text-blue-500 mr-2"></i> High page counts take longer to render.</li>
        </ul>
      </div>
    </div>
  );
};

export default SettingsPanel;
