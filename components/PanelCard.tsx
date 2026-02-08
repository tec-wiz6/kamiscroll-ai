
import React, { useState } from 'react';
import { Panel } from '../types';
import Bubble from './Bubble';

interface PanelCardProps {
  panel: Panel;
  pageId: string;
  onRegenerate: () => void;
  onUpdateText: (text: string) => void;
}

const PanelCard: React.FC<PanelCardProps> = ({ panel, onRegenerate, onUpdateText }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div 
      className="relative w-full overflow-hidden group border-b border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background / Image */}
      <div className="relative aspect-[3/4] md:aspect-video w-full bg-slate-100 flex items-center justify-center overflow-hidden">
        {panel.status === 'ready' && panel.imageUrl ? (
          <img 
            src={panel.imageUrl} 
            alt={panel.visualPrompt} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : panel.status === 'generating' ? (
          <div className="flex flex-col items-center text-slate-400">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-medium animate-pulse">Artist is drawing...</p>
          </div>
        ) : panel.status === 'error' ? (
          <div className="flex flex-col items-center text-red-400 p-8 text-center">
            <i className="fas fa-exclamation-triangle text-3xl mb-3"></i>
            <p className="text-sm">Art failed to manifest. Try regenerating.</p>
            <button 
              onClick={onRegenerate}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md text-xs font-bold"
            >
              RETRY
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-slate-300">
            <i className="fas fa-clock text-3xl mb-3"></i>
            <p className="text-xs">Waiting for artist...</p>
          </div>
        )}

        {/* SFX Overlay */}
        {panel.status === 'ready' && panel.sfx && (
          <div className="absolute top-10 right-10 manhwa-font text-4xl md:text-6xl text-red-600 drop-shadow-[0_2px_2px_rgba(255,255,255,1)] -rotate-12 pointer-events-none select-none opacity-90">
            {panel.sfx}
          </div>
        )}

        {/* Dialogue Bubbles */}
        {panel.status === 'ready' && panel.dialogue && (
          <Bubble text={panel.dialogue} type="speech" />
        )}

        {/* Narration Overlay */}
        {panel.status === 'ready' && panel.narration && (
          <div className="absolute top-4 left-4 max-w-[80%] bg-white/90 border border-slate-200 px-3 py-1 text-[10px] md:text-xs text-slate-800 font-bold uppercase tracking-tight shadow-sm">
            {panel.narration}
          </div>
        )}
      </div>

      {/* Hover Controls */}
      <div className={`absolute top-4 right-4 flex gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
          title="Edit Text"
        >
          <i className="fas fa-pen text-sm"></i>
        </button>
        <button 
          onClick={onRegenerate}
          className="w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
          title="Regenerate Art"
        >
          <i className="fas fa-sync-alt text-sm"></i>
        </button>
      </div>

      {/* Edit Form Overlay */}
      {isEditing && (
        <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-6 z-20">
          <h3 className="text-lg font-bold mb-4">Edit Panel Dialogue</h3>
          <textarea 
            className="w-full max-w-md h-32 bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm mb-4 focus:ring-2 focus:ring-blue-500"
            value={panel.dialogue}
            onChange={(e) => onUpdateText(e.target.value)}
          />
          <div className="flex gap-3">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-md font-bold"
            >
              SAVE
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-md font-bold"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelCard;
