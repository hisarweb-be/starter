"use client";
/** HisarWeb Design | Digital Partner - www.hisarweb.be */
import React, { useState } from 'react';

// Define the steps (1 through 8)
const steps = [
  { id: 'welcome', label: 'Welkom', description: 'Admin account setup' },
  { id: 'database', label: 'Database', description: 'Verbinding maken' },
  { id: 'sector', label: 'Sector', description: 'Type bedrijf' },
  { id: 'styling', label: 'Styling', description: 'Kleuren & Thema' },
  { id: 'modules', label: 'Modules', description: 'Functies & Add-ons' },
  { id: 'auth', label: 'Authenticatie', description: 'Login methoden' },
  { id: 'language', label: 'Taal', description: 'Standaard taal' },
  { id: 'confirm', label: 'Genereren', description: 'Overzicht & Installatie' }
];

export default function WizardLayout() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden">
      {/* Step Indicator (Timeline) */}
      <nav aria-label="Progress" className="mb-10 w-full relative z-10">
        <ol role="list" className="flex items-center">
          {steps.map((step, index) => (
            <li key={step.id} className={`relative flex items-center justify-center flex-1 transition-all duration-300 ${index <= currentStep ? 'opacity-100' : 'opacity-40'}`}>
              <div className="flex flex-col items-center">
                <span className={`w-3 h-3 rounded-full mb-2 ${index < currentStep ? 'bg-blue-600' : index === currentStep ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]' : 'bg-zinc-700'}`} />
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 hidden sm:block">{step.label}</span>
              </div>
              {/* Connector Line */}
              {index !== steps.length - 1 && (
                <div className={`absolute top-[5px] left-[50%] right-[-50%] h-[2px] transition-all duration-500 ${index < currentStep ? 'bg-blue-600/50' : 'bg-zinc-800'}`} />
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Dynamic Content Area for the Form Steps */}
      <div className="flex-1 w-full bg-zinc-900/80 rounded-2xl border border-zinc-800 p-8 shadow-xl shadow-black/40 ring-1 ring-white/5 backdrop-blur-md relative overflow-hidden transition-all duration-500">
        <h2 className="text-2xl font-semibold mb-2 text-white">{steps[currentStep].label}</h2>
        <p className="text-zinc-400 text-sm mb-8">{steps[currentStep].description}</p>
        
        {/* Placeholder for the actual form component injected per step */}
        <div className="min-h-[250px] flex items-center justify-center text-zinc-500 italic">
          [ Formulier voor stap {currentStep + 1} laadt via RenderBlocks... ]
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between items-center w-full z-10">
        <button 
          onClick={prevStep} 
          disabled={currentStep === 0}
          className="px-6 py-3 rounded-xl font-medium text-sm text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Vorige
        </button>
        
        <button 
          onClick={nextStep}
          className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25 transition-all active:scale-95 flex items-center gap-2"
        >
          {currentStep === steps.length - 1 ? 'Website Genereren 🚀' : 'Volgende Stap'}
        </button>
      </div>
    </div>
  );
}
