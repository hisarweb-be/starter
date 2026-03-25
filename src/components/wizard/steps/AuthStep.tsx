/** HisarWeb Design | Digital Partner - www.hisarweb.be */
import React, { useState } from 'react';

export default function AuthStep() {
  
  const [authSettings, setAuthSettings] = useState({
    enableRegistration: false,
    providers: {
      email: true, // Altijd verplicht voor admin
      google: false,
      github: false,
      magicLink: false
    },
    requireVerification: true
  });

  const toggleProvider = (provider: keyof typeof authSettings.providers) => {
    if (provider === 'email') return; // Email mag niet uit
    setAuthSettings(prev => ({
      ...prev,
      providers: {
        ...prev.providers,
        [provider]: !prev.providers[provider]
      }
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-6">
        <h3 className="text-xl font-medium text-white mb-2">Authenticatie & Gebruikers</h3>
        <p className="text-sm text-zinc-400">Hoe wilt u dat bezoekers en klanten inloggen op uw platform?</p>
      </div>

      {/* Registratie Instellingen */}
      <section className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium mb-1">Openbare Registratie</h4>
            <p className="text-sm text-zinc-500">Mogen bezoekers zelf een account aanmaken?</p>
          </div>
          <button 
            type="button"
            onClick={() => setAuthSettings(prev => ({ ...prev, enableRegistration: !prev.enableRegistration }))}
            className={`w-14 h-7 rounded-full transition-colors relative ${authSettings.enableRegistration ? 'bg-blue-600' : 'bg-zinc-700'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${authSettings.enableRegistration ? 'translate-x-8' : 'translate-x-1'}`} />
          </button>
        </div>
        
        {authSettings.enableRegistration && (
          <div className="mt-4 pt-4 border-t border-zinc-800/50 flex items-center justify-between animate-in slide-in-from-top-2">
            <div>
              <h4 className="text-sm text-zinc-300 font-medium">E-mail Verificatie Verplicht</h4>
              <p className="text-xs text-zinc-500">Nieuwe accounts moeten eerst een link in hun mail klikken.</p>
            </div>
            <button 
              type="button"
              onClick={() => setAuthSettings(prev => ({ ...prev, requireVerification: !prev.requireVerification }))}
              className={`w-10 h-5 rounded-full transition-colors relative ${authSettings.requireVerification ? 'bg-emerald-500' : 'bg-zinc-700'}`}
            >
              <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform ${authSettings.requireVerification ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        )}
      </section>

      {/* Login Providers */}
      <section>
        <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Login Methoden (OAuth)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* E-mail (Default) */}
          <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 flex items-center gap-4 opacity-70 cursor-not-allowed">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-xl">📧</div>
            <div>
              <h5 className="text-white font-medium text-sm">E-mail & Wachtwoord</h5>
              <p className="text-xs text-blue-400">Standaard geactiveerd</p>
            </div>
          </div>

          {/* Google */}
          <button 
            type="button"
            onClick={() => toggleProvider('google')}
            className={`p-4 rounded-xl border text-left flex items-center gap-4 transition-all ${
              authSettings.providers.google ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-2">
              <svg viewBox="0 0 24 24" className="w-full h-full"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            </div>
            <div>
              <h5 className={`font-medium text-sm ${authSettings.providers.google ? 'text-white' : 'text-zinc-300'}`}>Google Login</h5>
              <p className="text-xs text-zinc-500">OAuth 2.0</p>
            </div>
          </button>

          {/* GitHub */}
          <button 
            type="button"
            onClick={() => toggleProvider('github')}
            className={`p-4 rounded-xl border text-left flex items-center gap-4 transition-all ${
              authSettings.providers.github ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-[#24292e] flex items-center justify-center p-2 text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </div>
            <div>
              <h5 className={`font-medium text-sm ${authSettings.providers.github ? 'text-white' : 'text-zinc-300'}`}>GitHub Login</h5>
              <p className="text-xs text-zinc-500">Ideaal voor developers</p>
            </div>
          </button>

          {/* Magic Link */}
          <button 
            type="button"
            onClick={() => toggleProvider('magicLink')}
            className={`p-4 rounded-xl border text-left flex items-center gap-4 transition-all ${
              authSettings.providers.magicLink ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center p-2 text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            </div>
            <div>
              <h5 className={`font-medium text-sm ${authSettings.providers.magicLink ? 'text-white' : 'text-zinc-300'}`}>Magic Link</h5>
              <p className="text-xs text-zinc-500">Passwordless via e-mail</p>
            </div>
          </button>
        </div>
        
        {(authSettings.providers.google || authSettings.providers.github) && (
          <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-xs text-amber-200/80">
              <strong>Let op:</strong> U heeft Social Login geactiveerd. Na deze setup moet u in het Admin Paneel de API Keys (Client ID & Secret) voor Google/GitHub invullen om dit te laten werken.
            </p>
          </div>
        )}
      </section>

      {/* Hidden inputs to pass data to form action */}
      <input type="hidden" name="authConfig" value={JSON.stringify(authSettings)} />
    </div>
  );
}
