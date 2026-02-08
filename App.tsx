
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Genre, Tone, TwistIntensity, AppState, ManhwaStory, Page, Panel 
} from './types';
import { generateManhwaStructure, generatePanelImage } from './geminiService';
import SettingsPanel from './components/SettingsPanel';
import ManhwaViewer from './components/ManhwaViewer';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    prompt: '',
    genre: Genre.SCHOOL,
    tone: Tone.SERIOUS,
    pageCount: 3,
    panelsPerPage: 3,
    twistIntensity: TwistIntensity.LIGHT
  });

  const [story, setStory] = useState<ManhwaStory | null>(null);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'view'>('settings');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!appState.prompt) return;
    
    setError(null);
    setIsGeneratingStory(true);
    setActiveTab('view');

    try {
      const newStory = await generateManhwaStructure(appState);
      setStory(newStory);
      
      // Start generating images for the first few panels immediately
      // We process them sequentially or in small batches to avoid hitting rate limits
      generateImagesInQueue(newStory);
    } catch (err) {
      console.error(err);
      setError("Failed to generate story structure. Please try again.");
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const generateImagesInQueue = async (currentStory: ManhwaStory) => {
    const updatedStory = { ...currentStory };
    
    for (let pIdx = 0; pIdx < updatedStory.pages.length; pIdx++) {
      for (let panIdx = 0; panIdx < updatedStory.pages[pIdx].panels.length; panIdx++) {
        const panel = updatedStory.pages[pIdx].panels[panIdx];
        
        // Skip if already ready
        if (panel.status === 'ready') continue;

        // Update status to generating
        setStory(prev => {
          if (!prev) return prev;
          const newStory = { ...prev };
          newStory.pages[pIdx].panels[panIdx].status = 'generating';
          return newStory;
        });

        try {
          const url = await generatePanelImage(panel, updatedStory.characters);
          setStory(prev => {
            if (!prev) return prev;
            const newStory = { ...prev };
            newStory.pages[pIdx].panels[panIdx].status = 'ready';
            newStory.pages[pIdx].panels[panIdx].imageUrl = url;
            return newStory;
          });
        } catch (err) {
          console.error(err);
          setStory(prev => {
            if (!prev) return prev;
            const newStory = { ...prev };
            newStory.pages[pIdx].panels[panIdx].status = 'error';
            return newStory;
          });
        }
      }
    }
  };

  const regeneratePanel = async (pageId: string, panelId: string) => {
    if (!story) return;

    const pageIdx = story.pages.findIndex(p => p.id === pageId);
    if (pageIdx === -1) return;
    const panelIdx = story.pages[pageIdx].panels.findIndex(p => p.id === panelId);
    if (panelIdx === -1) return;

    setStory(prev => {
      if (!prev) return prev;
      const newStory = { ...prev };
      newStory.pages[pageIdx].panels[panelIdx].status = 'generating';
      return newStory;
    });

    try {
      const url = await generatePanelImage(story.pages[pageIdx].panels[panelIdx], story.characters);
      setStory(prev => {
        if (!prev) return prev;
        const newStory = { ...prev };
        newStory.pages[pageIdx].panels[panelIdx].status = 'ready';
        newStory.pages[pageIdx].panels[panelIdx].imageUrl = url;
        return newStory;
      });
    } catch (err) {
      setError("Panel regeneration failed.");
    }
  };

  const updatePanelText = (pageId: string, panelId: string, text: string) => {
    setStory(prev => {
      if (!prev) return prev;
      const newStory = { ...prev };
      const page = newStory.pages.find(p => p.id === pageId);
      if (page) {
        const panel = page.panels.find(p => p.id === panelId);
        if (panel) panel.dialogue = text;
      }
      return newStory;
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar for Settings */}
      <aside className={`w-full md:w-80 p-6 bg-slate-900 border-r border-slate-800 overflow-y-auto transition-transform ${activeTab === 'view' ? 'hidden md:block' : 'block'}`}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-xl font-bold italic shadow-lg shadow-blue-500/20">KS</div>
          <h1 className="text-2xl font-bold tracking-tight manhwa-font">KamiScroll <span className="text-blue-500">AI</span></h1>
        </div>

        <SettingsPanel 
          config={appState} 
          setConfig={setAppState} 
          onGenerate={handleGenerate}
          isLoading={isGeneratingStory}
        />

        {error && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-800 text-red-200 rounded-md text-sm">
            <i className="fas fa-exclamation-circle mr-2"></i> {error}
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen relative">
        {/* Navigation for mobile */}
        <div className="md:hidden flex bg-slate-900 border-b border-slate-800">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'settings' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400'}`}
          >
            Settings
          </button>
          <button 
            onClick={() => setActiveTab('view')}
            className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'view' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400'}`}
          >
            View Manhwa
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950 flex flex-col items-center">
          {!story && !isGeneratingStory && (
            <div className="h-full flex flex-col items-center justify-center max-w-md text-center">
              <div className="w-24 h-24 mb-6 bg-slate-900 rounded-full flex items-center justify-center text-4xl text-slate-700">
                <i className="fas fa-book-open"></i>
              </div>
              <h2 className="text-2xl font-bold mb-4">Your canvas is empty</h2>
              <p className="text-slate-400">
                Enter your brilliant manhwa idea in the sidebar and click generate to start your journey into the world of KamiScroll.
              </p>
            </div>
          )}

          {isGeneratingStory && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-4 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin-reverse" style={{ animationDuration: '1.5s' }}></div>
              </div>
              <h2 className="text-2xl font-bold mb-2 manhwa-font tracking-widest text-blue-400">MANIFESTING PLOT...</h2>
              <p className="text-slate-400 italic">"Summoning characters and twisting the fate of your story..."</p>
            </div>
          )}

          {story && (
            <ManhwaViewer 
              story={story} 
              onRegeneratePanel={regeneratePanel} 
              onUpdatePanelText={updatePanelText}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
