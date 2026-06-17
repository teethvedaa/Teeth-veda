import React from 'react';
import { Languages, CheckCircle2 } from 'lucide-react';

interface LanguageSelectionProps {
  onSelectLanguage: (language: string) => void;
  selectedLanguage?: string;
  onProceed: () => void;
}

const LANGUAGES = [
  { id: 'hindi', name: 'हिंदी (Hindi)', desc: 'आयुर्वेदिक देसी नुस्खे पूरी तरह से हिंदी भाषा में समझें।' },
  { id: 'english', name: 'English', desc: 'Read home remedies and craving control in simple English.' },
  { id: 'hinglish', name: 'Hinglish', desc: 'Mix of Hindi & English text (जैसे: danto ka peelapan kaise dur kare).' },
  { id: 'bengali', name: 'বাংলা (Bengali)', desc: 'বাংলা ভাষায় ঘরোয়া চিকিৎসা এবং তামাক ছাড়ার নির্দেশিকা।' },
  { id: 'marathi', name: 'मराठी (Marathi)', desc: 'मराठीत सोपे घरगुती उपाय आणि तंबाखू मुक्ती मार्गदर्शन।' },
];

export default function LanguageSelection({ onSelectLanguage, selectedLanguage, onProceed }: LanguageSelectionProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="bg-white max-w-xl w-full rounded-3xl shadow-xl border border-slate-200 p-6 md:p-8 space-y-6 text-center">
        
        {/* Decorative icon */}
        <div className="mx-auto w-16 h-16 bg-teal-100 text-teal-800 rounded-2xl flex items-center justify-center shadow-md">
          <Languages className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">अपनी पसंदीदा भाषा चुनें</h2>
          <p className="text-slate-500 text-sm md:text-base">
            Choose your preferred language for conversing with Teeth Veda chat assistant.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 pt-2">
          {LANGUAGES.map((lang) => (
            <button
              id={`lang-select-${lang.id}`}
              key={lang.id}
              onClick={() => onSelectLanguage(lang.id)}
              className={`p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                selectedLanguage === lang.id
                  ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div>
                <p className={`font-semibold text-sm md:text-base ${selectedLanguage === lang.id ? 'text-teal-900' : 'text-slate-950'}`}>
                  {lang.name}
                </p>
                <p className="text-xs text-slate-500 mt-1">{lang.desc}</p>
              </div>
              {selectedLanguage === lang.id && (
                <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>

        <button
          id="proceed-language-btn"
          disabled={!selectedLanguage}
          onClick={onProceed}
          className={`w-full py-4 rounded-full font-bold text-base md:text-lg transition-all ${
            selectedLanguage
              ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          {selectedLanguage ? 'आगे बढ़ें (Proceed to Activation)' : 'कृपया भाषा चुनें (Select a language)'}
        </button>

        <p className="text-[11px] text-slate-400">
          आप इस भाषा को बाद में कभी भी चैट की सेटिंग्स में बदल सकते हैं।
        </p>
      </div>
    </div>
  );
}
