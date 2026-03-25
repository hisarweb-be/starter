/** HisarWeb Design | Digital Partner - www.hisarweb.be */
import React, { useState, useEffect } from 'react';

export default function UpdateManager() {
  const [currentVersion] = useState('1.0.0'); // In productie komt dit uit package.json
  const [latestVersion, setLatestVersion] = useState('Laden...');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'checking' | 'available' | 'up-to-date'>('checking');
  const [releaseNotes, setReleaseNotes] = useState('');

  useEffect(() => {
    // Simuleer een fetch voor de demo, later koppelen we dit aan echte GitHub repo
    setTimeout(() => {
      setLatestVersion('1.1.2'); // Simuleert dat er een nieuwe versie is
      setUpdateStatus('available');
      setReleaseNotes(
        "- Nieuwe Elementor-stijl E-commerce blokken toegevoegd.\n" +
        "- Bugfix: Dark mode flashing op mobiel.\n" +
        "- Nieuwe taal toegevoegd (Frans)."
      );
    }, 1500);
  }, []);

  const handleUpdate = () => {
    setIsUpdating(true);
    
    // Simuleer het update proces
    setTimeout(() => {
      setIsUpdating(false);
      setUpdateStatus('up-to-date');
      setLatestVersion('1.1.2');
      alert("Succesvol geüpdatet naar " + latestVersion); // Voor test
    }, 4000);
  };

  return (
    <div className="w-full bg-zinc-950 p-8 text-zinc-100 min-h-[400px]">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Systeem Updates
          </h2>
          <p className="text-zinc-400 mt-2">Beheer uw HisarWeb Starter instantie.</p>
        </div>
        
        {/* Hardcoded HisarWeb Branding Logo */}
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex items-center gap-3 shadow-lg">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-inner">
            HW
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs text-zinc-500 font-medium">Powered by</p>
            <p className="text-sm font-bold text-white tracking-wide">HisarWeb Starter</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Huidige Status Kaart */}
        <div className="col-span-1 bg-zinc-900 rounded-3xl border border-zinc-800 p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-medium text-zinc-400 mb-6">Huidige Installatie</h3>
            
            <div className="flex justify-between items-center mb-4 py-3 border-b border-zinc-800/60">
              <span className="text-zinc-500 text-sm">Versie</span>
              <span className="font-mono bg-zinc-950 px-3 py-1 rounded text-zinc-300">v{currentVersion}</span>
            </div>
            
            <div className="flex justify-between items-center mb-4 py-3 border-b border-zinc-800/60">
              <span className="text-zinc-500 text-sm">Kanaal</span>
              <span className="text-blue-400 text-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Stable
              </span>
            </div>
            
            <div className="flex justify-between items-center mb-8 py-3 border-b border-zinc-800/60">
              <span className="text-zinc-500 text-sm">Laatste Check</span>
              <span className="text-zinc-400 text-sm">Zojuist</span>
            </div>
          </div>
          
          <button 
            disabled={updateStatus === 'checking' || isUpdating}
            className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {updateStatus === 'checking' ? 'Zoeken...' : 'Check voor updates'}
          </button>
        </div>

        {/* Update Actie Kaart */}
        <div className="col-span-2 relative">
          
          {updateStatus === 'checking' && (
            <div className="absolute inset-0 bg-zinc-900 rounded-3xl border border-zinc-800 flex flex-col items-center justify-center p-8 animate-pulse">
              <div className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-blue-500 animate-spin mb-4" />
              <p className="text-zinc-400">Verbinden met HisarWeb servers...</p>
            </div>
          )}

          {updateStatus === 'up-to-date' && (
            <div className="absolute inset-0 bg-zinc-900 rounded-3xl border border-emerald-900/50 flex flex-col items-center justify-center p-8">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-500">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">U bent helemaal up-to-date</h3>
              <p className="text-zinc-400">Uw HisarWeb Starter draait de laatste versie (v{latestVersion}).</p>
            </div>
          )}

          {updateStatus === 'available' && (
            <div className="bg-blue-950/20 rounded-3xl border border-blue-900/50 p-8 flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
              
              <div className="flex items-start justify-between relative z-10 mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Nieuwe Update Beschikbaar
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">Versie {latestVersion}</h3>
                  <p className="text-blue-200/70">Een nieuwe release is beschikbaar op de HisarWeb servers.</p>
                </div>
              </div>

              <div className="flex-1 bg-zinc-950/50 rounded-2xl border border-blue-900/30 p-6 mb-8 relative z-10">
                <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Release Notes (Changelog)</h4>
                <pre className="text-zinc-400 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                  {releaseNotes}
                </pre>
              </div>

              <button 
                onClick={handleUpdate}
                disabled={isUpdating}
                className="relative z-10 w-full md:w-auto self-end px-8 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
              >
                {isUpdating ? (
                  <>
                    <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Pakket Downloaden...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Nu Updaten (One-Click)
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
