import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Star, AlertCircle } from 'lucide-react';

interface SubscriptionPortalProps {
  onSubscribe: (planId: 'basic' | 'standard' | 'premium') => void;
  isLoading: boolean;
}

const PLANS = [
  {
    id: 'basic' as const,
    name: 'बेसिक सपोर्ट (Basic Support)',
    price: 49,
    days: 7,
    maxQuestions: 10,
    maxPhotos: 1,
    desc: 'शुरुआती लोगों के लिए उपयुक्त जो अपनी पुरानी आदतों से मुक्ति चाहते हैं।',
    features: [
      '10 प्रश्न प्रतिदिन (Ask 10 queries/day)',
      '1 दांतों की फोटो का पूरा विश्लेषण',
      'दांत चमकाने के आयुर्वेदिक मंजन नुस्खे',
      'तंबाकू क्रेविंग कंट्रोल एआई टिप्स',
      '7 दिन की वैधता (7 days validation)'
    ]
  },
  {
    id: 'standard' as const,
    name: 'स्टैंडर्ड सुरक्षा (Standard Plan)',
    price: 99,
    days: 12,
    maxQuestions: 20,
    maxPhotos: 4,
    desc: 'दीर्घकालिक गुटका/धूम्रपान करने वालों के लिए सर्वोत्तम परिणाम वाली योजना।',
    popular: true,
    features: [
      '20 प्रश्न प्रतिदिन (Ask 20 queries/day)',
      '4 बार दांतों की स्थिति का फोटो विश्लेषण',
      'गहरे आयुर्वेदिक दंत ब्लीचिंग हर्बल सूत्र',
      'मुंह की दुर्गंध/बदबू से मुक्ति के देशी जल उपचार',
      '12 दिन की पूर्ण वैधता (12 days validation)'
    ]
  },
  {
    id: 'premium' as const,
    name: 'प्रीमियम डीप केयर (Premium Care)',
    price: 199,
    days: 28,
    maxQuestions: 30,
    maxPhotos: 10,
    desc: 'पूरे परिवार के लिए सर्वांगीण आयुर्वेदिक मौखिक स्वास्थ्य और लत मुक्ति रक्षा।',
    features: [
      '30 प्रश्न प्रतिदिन (Ask 30 queries/day)',
      '10 दांतों के फोटो का उच्च स्तरीय विश्लेषण',
      'तंबाकू के जिद्दी काले धब्बे मिटाने के गुप्त सूत्र',
      'मसूड़ों के ढीलेपन और दर्द के विशेष वैदिक सेक',
      '28 दिन की पूर्ण वैधता (28 days validation)'
    ]
  }
];

export default function SubscriptionPortal({ onSubscribe, isLoading }: SubscriptionPortalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<'basic' | 'standard' | 'premium'>('standard');

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 md:px-8 flex items-center justify-center font-sans">
      <div className="max-w-5xl w-full space-y-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-teal-700 font-bold text-sm tracking-wider uppercase font-mono bg-teal-50 py-1 px-3.5 rounded-full inline-block border border-teal-100">
            Secure Ayurveda Check-In
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            सशुल्क एक्टिवेशन पोर्टल (Paid Activation)
          </h2>
          <p className="text-slate-500 text-sm md:text-base">
            Teeth Veda चैटबॉट का उपयोग शुरू करने के लिए अपना पसंदीदा सुरक्षित प्लान एक्टिवेट करें।
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`cursor-pointer rounded-3xl p-6 relative transition-all flex flex-col justify-between space-y-6 ${
                selectedPlanId === plan.id
                  ? plan.popular
                    ? 'bg-teal-900 text-white shadow-xl shadow-teal-950/20 ring-4 ring-teal-500'
                    : 'bg-white text-slate-800 shadow-xl shadow-slate-200 border-2 border-teal-600'
                  : 'bg-white text-slate-700 hover:shadow-md border border-slate-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-teal-900 text-[10px] uppercase font-bold py-1 px-3 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-teal-900 text-teal-900" /> लोकप्रिय चुनाव
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold tracking-wider ${
                    selectedPlanId === plan.id && plan.popular ? 'text-teal-300' : 'text-slate-400'
                  }`}>
                    {plan.id.toUpperCase()} PLAN
                  </span>
                  {selectedPlanId === plan.id && (
                    <span className="text-xs bg-teal-100 text-teal-800 py-0.5 px-2 rounded-md font-semibold font-sans">
                      चयनित (Selected)
                    </span>
                  )}
                </div>

                <div>
                  <h3 className={`text-lg md:text-xl font-bold ${
                    selectedPlanId === plan.id && plan.popular ? 'text-white' : 'text-slate-950'
                  }`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs mt-1 ${
                    selectedPlanId === plan.id && plan.popular ? 'text-teal-100/70' : 'text-slate-500'
                  }`}>
                    {plan.desc}
                  </p>
                </div>

                <div className="pt-2">
                  <p className="flex items-baseline font-mono">
                    <span className={`text-3xl md:text-4xl font-extrabold ${
                      selectedPlanId === plan.id && plan.popular ? 'text-white' : 'text-slate-950'
                    }`}>
                      ₹{plan.price}
                    </span>
                    <span className={`text-xs ml-1 ${
                      selectedPlanId === plan.id && plan.popular ? 'text-teal-200' : 'text-slate-400'
                    }`}>
                      / {plan.days} दिन वैधता
                    </span>
                  </p>
                </div>

                <ul className="space-y-3 pt-4 border-t border-slate-100 text-xs md:text-sm">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        selectedPlanId === plan.id && plan.popular ? 'text-[#fbbf24]' : 'text-teal-600'
                      }`} />
                      <span className={
                        selectedPlanId === plan.id && plan.popular ? 'text-teal-100' : 'text-slate-600'
                      }>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100/50">
                <button
                  id={`select-plan-inner-btn-${plan.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubscribe(plan.id);
                  }}
                  disabled={isLoading}
                  className={`w-full py-3 rounded-full font-bold text-sm transition-all focus:outline-none flex items-center justify-center gap-2 ${
                    selectedPlanId === plan.id
                      ? 'bg-teal-600 hover:bg-teal-550 text-white shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-705 text-slate-700'
                  }`}
                >
                  {isLoading ? 'कृप्या प्रतीक्षा करें...' : `₹${plan.price} में चालू करें`}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Security & Support info */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 max-w-2xl mx-auto space-y-4 shadow-sm">
          <div className="flex items-center gap-3 text-teal-950">
            <span className="p-2 bg-teal-100 text-teal-800 rounded-xl border border-teal-200/50">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <p className="font-semibold text-sm text-slate-900">सुरक्षित भुगतान और तत्काल सक्रियता</p>
              <p className="text-slate-500 text-xs">Payments processed securely via Razorpay gateway.</p>
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-2xl flex items-start gap-2 text-xs text-slate-500">
            <AlertCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
            <p>
              <strong>भुगतान के बाद क्या होता है?</strong> जैसे ही भुगतान सफल होगा, आपको तुरंत दांत चमकाने वाले एआई चैट रूम में ट्रांसफर कर दिया जाएगा। वहां कस्टमाइज्ड भाषा के साथ आप अपनी दांतों की फोटो डाल कर एआई मंजन नुस्खा ले पाएंगे।
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
