
import React, { useRef } from 'react';
import { ManhwaStory, Page, Panel } from '../types';
import PanelCard from './PanelCard';

interface ManhwaViewerProps {
  story: ManhwaStory;
  onRegeneratePanel: (pageId: string, panelId: string) => void;
  onUpdatePanelText: (pageId: string, panelId: string, text: string) => void;
}

const ManhwaViewer: React.FC<ManhwaViewerProps> = ({ story, onRegeneratePanel, onUpdatePanelText }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    // Simple mock download logic
    alert("In a full implementation, we would use html2canvas or a backend service to merge all pages into a long-scroll PNG/PDF.");
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Title Header */}
      <div className="w-full text-center py-12 mb-8 bg-gradient-to-b from-slate-900 to-transparent rounded-b-[4rem] border-b border-slate-800">
        <h1 className="text-4xl md:text-6xl manhwa-font tracking-tighter text-white mb-2">{story.title}</h1>
        <p className="text-slate-400 px-6 max-w-xl mx-auto">{story.plot}</p>
        
        <div className="mt-8 flex flex-wrap justify-center gap-3 px-6">
          {story.characters.map((char, i) => (
            <div key={i} className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-full text-xs text-slate-300">
              <span className="font-bold text-blue-400">{char.name}</span> ({char.role})
            </div>
          ))}
        </div>
      </div>

      {/* Webtoon Content */}
      <div ref={scrollContainerRef} className="w-full space-y-0 bg-white">
        {story.pages.map((page) => (
          <div key={page.id} className="w-full flex flex-col items-center">
            {page.panels.map((panel) => (
              <PanelCard 
                key={panel.id} 
                panel={panel} 
                pageId={page.id}
                onRegenerate={() => onRegeneratePanel(page.id, panel.id)}
                onUpdateText={(text) => onUpdatePanelText(page.id, panel.id, text)}
              />
            ))}
            {/* Page Break indicator (subtle) */}
            <div className="w-full h-1 bg-slate-100 relative group overflow-hidden">
               <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[2000ms] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Export */}
      <div className="w-full mt-12 mb-24 flex flex-col items-center gap-6">
        <div className="w-24 h-1 bg-slate-800 rounded-full"></div>
        <p className="manhwa-font text-2xl text-slate-500 tracking-widest">FIN</p>
        
        <div className="flex gap-4">
          <button 
            onClick={handleDownload}
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full font-semibold transition-all flex items-center gap-2"
          >
            <i className="fas fa-file-export"></i> Export ZIP
          </button>
          <button 
            onClick={handleDownload}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <i className="fas fa-file-pdf"></i> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManhwaViewer;
