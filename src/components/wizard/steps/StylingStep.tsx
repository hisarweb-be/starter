/** HisarWeb Design | Digital Partner - www.hisarweb.be */
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

// Mock data voor accentkleuren
const PRESET_COLORS = [
  { name: 'Blue', value: '#2563EB', bgClass: 'bg-blue-600', ringClass: 'ring-blue-500' },
  { name: 'Indigo', value: '#4F46E5', bgClass: 'bg-indigo-600', ringClass: 'ring-indigo-500' },
  { name: 'Violet', value: '#7C3AED', bgClass: 'bg-violet-600', ringClass: 'ring-violet-500' },
  { name: 'Rose', value: '#E11D48', bgClass: 'bg-rose-600', ringClass: 'ring-rose-500' },
  { name: 'Amber', value: '#D97706', bgClass: 'bg-amber-600', ringClass: 'ring-amber-500' },
  { name: 'Emerald', value: '#059669', bgClass: 'bg-emerald-600', ringClass: 'ring-emerald-500' },
  { name: 'Zinc', value: '#52525B', bgClass: 'bg-zinc-600', ringClass: 'ring-zinc-500' },
];

export default function StylingStep() {
  const t = useTranslations('wizard.styling');
  
  // Lokale state voor real-time preview (normaal gekoppeld aan een global state/context)
  const [activeColor, setActiveColor] = useState(PRESET_COLORS[0]);
  const [activeMode, setActiveMode] = useState<'dark' | 'light'>('dark');
  const [activeCorners, setActiveCorners] = useState<'rounded' | 'sharp'>('rounded');

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Sectie 1: Accentkleur (Hoofdkleur) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">{t('accentColor')}</h3>
          <span className="text-xs font-mono text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded-md">
            {activeColor.value}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {PRESET_COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => setActiveColor(color)}
              className={`w-12 h-12 rounded-full relative group transition-all duration-300 ${color.bgClass} ${
                activeColor.name === color.name 
                  ? `ring-4 ring-offset-4 ring-offset-zinc-900 ${color.ringClass} scale-110 shadow-lg shadow-${color.name.toLowerCase()}-500/50` 
                  : 'hover:scale-105 opacity-80 hover:opacity-100'
              }`}
              aria-label={`Select ${color.name} color`}
            >
              {activeColor.name === color.name && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
          
          {/* Custom Color Picker Button (Voor Premium Gebruikers) */}
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-zinc-700 hover:border-zinc-500 flex items-center justify-center cursor-pointer transition-colors group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-500 via-green-500 to-blue-500 opacity-20 group-hover:opacity-40 transition-opacity" />
            <svg className="w-5 h-5 text-zinc-400 group-hover:text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
        <p className="text-sm text-zinc-500 mt-3">Dit wordt de hoofdkleur voor knoppen, links en accenten op uw website.</p>
      </section>

      <hr className="border-zinc-800/50" />

      {/* Sectie 2: Dark Mode vs Light Mode */}
      <section>
        <h3 className="text-lg font-medium text-white mb-4">{t('mode')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setActiveMode('dark')}
            className={`flex flex-col items-center p-4 rounded-2xl border transition-all ${
              activeMode === 'dark' 
                ? `border-${activeColor.name.toLowerCase()}-500 bg-zinc-800/50 shadow-inner` 
                : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
            }`}
          >
            <div className="w-16 h-12 rounded-md bg-zinc-950 border border-zinc-800 mb-3 relative overflow-hidden flex items-center justify-center">
              <div className="w-8 h-1 bg-zinc-800 rounded-full mb-2 absolute top-3 left-3" />
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 absolute right-3 top-2" />
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-zinc-200">{t('modeDark')}</span>
          </button>
          
          <button 
            onClick={() => setActiveMode('light')}
            className={`flex flex-col items-center p-4 rounded-2xl border transition-all ${
              activeMode === 'light' 
                ? `border-${activeColor.name.toLowerCase()}-500 bg-white/5` 
                : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
            }`}
          >
            <div className="w-16 h-12 rounded-md bg-white border border-zinc-200 mb-3 relative overflow-hidden flex items-center justify-center">
              <div className="w-8 h-1 bg-zinc-200 rounded-full mb-2 absolute top-3 left-3" />
              <div className="w-6 h-6 rounded-full bg-amber-500/20 absolute right-3 top-2" />
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-zinc-400">{t('modeLight')}</span>
          </button>
        </div>
      </section>

      <hr className="border-zinc-800/50" />

      {/* Sectie 3: Afronding van hoeken (Corners) */}
      <section>
        <h3 className="text-lg font-medium text-white mb-4">{t('corners')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setActiveCorners('rounded')}
            className={`flex flex-col items-center p-4 rounded-2xl border transition-all ${
              activeCorners === 'rounded' 
                ? `border-${activeColor.name.toLowerCase()}-500 bg-zinc-800/50` 
                : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
            }`}
          >
            <div className="w-12 h-12 rounded-[20px] bg-zinc-800 border-2 border-zinc-700 mb-3" />
            <span className="text-sm font-medium text-zinc-200">{t('cornersRounded')}</span>
          </button>
          
          <button 
            onClick={() => setActiveCorners('sharp')}
            className={`flex flex-col items-center p-4 rounded-2xl border transition-all ${
              activeCorners === 'sharp' 
                ? `border-${activeColor.name.toLowerCase()}-500 bg-zinc-800/50` 
                : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
            }`}
          >
            <div className="w-12 h-12 rounded-sm bg-zinc-800 border-2 border-zinc-700 mb-3" />
            <span className="text-sm font-medium text-zinc-400">{t('cornersSharp')}</span>
          </button>
        </div>
      </section>

      {/* "Live Preview" koppeling (verborgen input velden voor form verzending) */}
      <input type="hidden" name="accentColor" value={activeColor.value} />
      <input type="hidden" name="themeMode" value={activeMode} />
      <input type="hidden" name="corners" value={activeCorners} />
      
    </div>
  );
}
