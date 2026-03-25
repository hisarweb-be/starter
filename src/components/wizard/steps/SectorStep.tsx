/** HisarWeb Design | Digital Partner - www.hisarweb.be */
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

// Sectoren met hun bijbehorende standaard "Hero" layouts en aanbevolen modules
const SECTORS = [
  {
    id: 'corporate',
    icon: '🏢',
    name: 'Zakelijk & Consultancy',
    desc: 'Strak, professioneel, met focus op diensten en expertise.',
    recommendedLayout: 'split-hero', // Tekst links, foto rechts
    recommendedModules: ['services', 'blog', 'contact']
  },
  {
    id: 'restaurant',
    icon: '🍽️',
    name: 'Restaurant & Horeca',
    desc: 'Visueel gedreven, met focus op sfeer, menu en reserveringen.',
    recommendedLayout: 'centered-hero', // Grote achtergrondfoto met tekst in het midden
    recommendedModules: ['portfolio', 'contact', 'faq']
  },
  {
    id: 'portfolio',
    icon: '🎨',
    name: 'Creatief Portfolio',
    desc: 'Minimalistisch design dat uw werk centraal stelt.',
    recommendedLayout: 'masonry-hero', // Grid van afbeeldingen bovenaan
    recommendedModules: ['portfolio', 'about', 'contact']
  },
  {
    id: 'shop',
    icon: '🛍️',
    name: 'E-Commerce Light',
    desc: 'Productcatalogus en verkoop funnel (zonder zware backend).',
    recommendedLayout: 'video-hero', // Dynamische productvideo
    recommendedModules: ['services', 'pricing', 'contact']
  },
  {
    id: 'startup',
    icon: '🚀',
    name: 'SaaS / Tech Startup',
    desc: 'Modern, snelle conversie, focus op features en pricing.',
    recommendedLayout: 'split-hero',
    recommendedModules: ['services', 'pricing', 'faq', 'blog']
  },
  {
    id: 'blank',
    icon: '✨',
    name: 'Start vanaf Nul',
    desc: 'Een lege canvas voor maximale creatieve vrijheid.',
    recommendedLayout: 'blank',
    recommendedModules: []
  }
];

export default function SectorStep() {
  const t = useTranslations('wizard.sector');
  const [activeSector, setActiveSector] = useState<string>('corporate');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-6">
        <h3 className="text-xl font-medium text-white mb-2">{t('title')}</h3>
        <p className="text-sm text-zinc-400">{t('description')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SECTORS.map((sector) => (
          <button
            key={sector.id}
            onClick={() => setActiveSector(sector.id)}
            className={`flex flex-col text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
              activeSector === sector.id
                ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.15)] scale-[1.02]'
                : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/60 hover:border-zinc-700'
            }`}
          >
            {/* Achtergrond gloed bij selectie */}
            {activeSector === sector.id && (
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
            )}
            
            <div className="flex items-center gap-4 mb-3 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner ${
                activeSector === sector.id ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-800 text-zinc-400'
              }`}>
                {sector.icon}
              </div>
              <h4 className={`font-semibold text-lg ${activeSector === sector.id ? 'text-white' : 'text-zinc-200'}`}>
                {sector.name}
              </h4>
            </div>
            
            <p className="text-sm text-zinc-400 leading-relaxed relative z-10">
              {sector.desc}
            </p>
            
            {/* Actief vinkje */}
            {activeSector === sector.id && (
              <div className="absolute top-4 right-4 text-blue-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Informatie over de automatische configuratie */}
      <div className="p-4 rounded-xl bg-blue-900/10 border border-blue-900/30 flex items-start gap-4">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h5 className="text-sm font-medium text-blue-300 mb-1">Automatische Configuratie</h5>
          <p className="text-xs text-blue-200/70 leading-relaxed">
            Wanneer u &ldquo;{SECTORS.find(s => s.id === activeSector)?.name}&rdquo; selecteert,
            stellen wij automatisch de modules <strong>{SECTORS.find(s => s.id === activeSector)?.recommendedModules.join(', ')}</strong> voor in 
            stap 5 en genereren we premium dummy content passend bij uw branche.
          </p>
        </div>
      </div>

      <input type="hidden" name="sector" value={activeSector} />
      <input type="hidden" name="layout" value={SECTORS.find(s => s.id === activeSector)?.recommendedLayout} />
    </div>
  );
}
