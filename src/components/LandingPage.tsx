import React, { useState } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldAlert, Award, Star, Heart, Ban, AlertTriangle, Languages } from 'lucide-react';
// @ts-ignore
import teethComparisonImg from '../assets/images/teeth_before_after_png_1781689710669.jpg';
import { ReviewItem } from '../types';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenLegal: (type: 'terms' | 'privacy') => void;
}

const REVIEWS: ReviewItem[] = [
  {
    id: '1',
    name: 'रमेश कुमार',
    age: 34,
    location: 'लखनऊ, उत्तर प्रदेश',
    habit: 'गुटका और खैनी (12 साल से)',
    duration: '15 दिनों के नुस्खे के बाद',
    reviewText: '12 साल की गुटके की आदत छूटने का श्रेय "टीथ वेदा" को जाता है। उन्होंने मुझे सिखाया कि जब भी गुटका खाने का मन करे तो मीठी सौंफ, मिश्री और छोटी इलाइची चबाएं। हल्दी और सेंधा नमक के पेस्ट से दांतों के जिद्दी लाल दाग भी साफ हो गए हैं!',
    rating: 5,
    beforeImg: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=200', // Dental illustrative
    afterImg: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=200',  // Healthy white
    status: 'गुटका छोड़ा और प्राकृतिक दांत चमकाए'
  },
  {
    id: '2',
    name: 'विक्रम राज सिंह',
    age: 28,
    location: 'पटना, बिहार',
    habit: 'स्मोकिंग और तंबाकू चबाना',
    duration: '21 दिनों के प्रयोग के बाद',
    reviewText: 'सिगरेट और तंबाकू के कारण मुंह से भयंकर दुर्गंध आती थी, दोस्त भी दूर बैठते थे। चैटबॉट के नुस्खे - जैसे दालचीनी का पानी, त्रिफला चूर्ण का कुल्ला और सूखी अदरक के टुकड़ों से तलब भी रुक गई और मुंह की बदबू बिल्कुल खत्म हो गई। बेहतरीन ऐप है!',
    rating: 5,
    beforeImg: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&q=80&w=200',
    afterImg: 'https://images.unsplash.com/photo-1522844990219-53586d595185?auto=format&fit=crop&q=80&w=200',
    status: 'धूम्रपान छूटा और सांसों की बदबू दूर की'
  }
];

export default function LandingPage({ onGetStarted, onOpenLegal }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<'teeth' | 'habit' | 'smell'>('teeth');

  return (
    <div className="bg-[#F8FAFC] text-slate-900 font-sans min-h-screen flex flex-col">
      {/* Disclaimer bar */}
      <div className="bg-amber-50 border-b border-slate-200 py-2.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs md:text-sm text-slate-800 font-medium leading-relaxed">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-700" />
          <span>
            <strong>आयुर्वेदिक सुरक्षा और कानूनी घोषणा:</strong> टीथ वेदा घर पर दांत चमकाने और गुटका-तंबाकू छुड़वाने का मार्गदर्शक है। यह कोई डेंटिस्ट की चिकित्सा सलाह नहीं है।
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm border-b border-slate-200 z-40 px-4 py-3 md:py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="bg-teal-600 text-white rounded-2xl p-2 shadow-teal-100 shadow-md flex items-center justify-center">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
            </span>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-teal-900 font-sans leading-none tracking-tight">
                Teeth Veda
              </h1>
              <span className="text-[10px] md:text-xs text-teal-600 font-medium uppercase tracking-wider font-mono">
                Ayurvedic Smile Renewal
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-teal-700 transition-colors">यह कैसे काम करता है?</a>
            <a href="#benefits" className="hover:text-teal-700 transition-colors">उपचार विधि</a>
            <a href="#reviews" className="hover:text-teal-700 transition-colors">सफलता की कहानियां</a>
            <a href="#pricing" className="hover:text-teal-700 transition-colors">चैटबॉट प्लान्स</a>
          </nav>

          <button 
            id="header-cta-btn"
            onClick={onGetStarted}
            className="flex items-center gap-2 px-5 py-2 md:py-2.5 bg-teal-600 hover:bg-teal-700 hover:scale-105 active:scale-95 text-white text-xs md:text-sm font-semibold rounded-full transition-all shadow-md shadow-teal-100"
          >
            शुरू करें <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-8 md:py-16 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center font-sans">
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-800 text-xs font-semibold rounded-full w-fit border border-teal-100">
            <Award className="w-3.5 h-3.5 text-teal-600" />
            <span>Ayurvedic Home Remedies Gateway</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
            गुटका, तंबाकू और सिगरेट के दागों को कहें अलविदा, पाएँ <span className="text-teal-600">श्वेत दिव्य मुस्कान!</span>
          </h2>

          <p className="text-slate-600 text-sm md:text-lg leading-relaxed">
            दांतों का पीलापन, काले स्पॉट्स और मुंह की दुर्गंध जीवन का आत्मविश्वास छीन लेती है। <strong>Teeth Veda</strong> एआई चैटबॉट आपको प्रदान करता है घर बैठे दांत चमकाने के गुप्त प्राचीन आयुर्वेदिक नदियाँ, देसी नुस्खे और तंबाकू-गुटका छोड़ने के अचूक घरेलू उपाय (जैसे स्वादिष्ट मीठी सौंफ क्रेविंग शमन!)।
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              id="hero-cta-get-started"
              onClick={onGetStarted}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-teal-600 hover:bg-teal-700 hover:shadow-lg text-white font-bold text-base md:text-lg rounded-full transition-all hover:-translate-y-0.5 shadow-md shadow-teal-200"
            >
              चैटबॉट से अभी बात करें (Get Started) <ArrowRight className="w-5 h-5 animate-pulse" />
            </button>
            <a
              href="#how-it-works"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm md:text-base rounded-full transition-all border border-slate-200"
            >
              यह कैसे काम करता है सीखें
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-slate-900">100%</p>
              <p className="text-xs md:text-sm text-slate-500">सुरक्षित देसी नुस्खे</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-slate-900">14k+</p>
              <p className="text-xs md:text-sm text-slate-500">संतुष्ट उपयोगकर्ता</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-slate-900">₹49</p>
              <p className="text-xs md:text-sm text-slate-500">से किफायती शुरुआत</p>
            </div>
          </div>
        </div>

        {/* Hero Image Container */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-[450px] p-2 bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-200">
            <div className="absolute top-4 left-4 bg-teal-600 text-white text-[10px] uppercase font-bold py-1 px-3 rounded-full shadow-md z-15 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> असली असर
            </div>
            
            <img 
              referrerPolicy="no-referrer"
              src={teethComparisonImg} 
              alt="Before and After Teeth Ayurvedic Whitening"
              className="rounded-2xl w-full h-auto object-cover border border-slate-100"
            />
            
            {/* Embedded interactive preview block */}
            <div className="p-4 bg-teal-900 text-white rounded-xl mt-3 flex items-center justify-between shadow-inner">
              <div>
                <p className="text-xs text-teal-200 tracking-wider uppercase font-semibold font-mono">Teeth Analysis Technology</p>
                <p className="text-[13px] text-white font-semibold flex items-center gap-1">दांतों की फोटो अपलोड करें और पीलापन डिग्री जानें</p>
              </div>
              <span className="px-3 py-1 bg-teal-600 text-white text-[11px] font-bold rounded-lg whitespace-nowrap">
                AI समर्थित
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white py-16 px-4 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-teal-600 font-bold text-sm tracking-wider uppercase font-mono">Process (काम करने का तरीका)</span>
            <h3 className="text-3xl font-extrabold text-slate-900">यह कैसे काम करता है?</h3>
            <p className="text-slate-600 text-sm md:text-base">
              मुस्कान बदलाव के लिए आपको केवल 4 सरल चरणों का पालन करने की आवश्यकता है:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative">
              <span className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-sm border border-teal-100">1</span>
              <div className="pt-2 text-teal-600 font-bold mb-2">Google लॉगिन से जुड़ें</div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                सुरक्षित और आसान गूगल लॉगिन के द्वारा सिर्फ 1 सेकंड में अपनी प्रोफाइल सेटअप करें।
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative">
              <span className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-sm border border-teal-100">2</span>
              <div className="pt-2 text-teal-600 font-bold mb-2">भाषा और प्लान चुनें</div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                अपनी पसंदीदा भाषा (Hindi, English, Hinglish, Marathi, Bengali) चुनकर अपना पसंदीदा किफायती प्लान चालू करें।
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative">
              <span className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-sm border border-teal-100">3</span>
              <div className="pt-2 text-teal-600 font-bold mb-2">फोटो अपलोड करें (Optional)</div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                अपने पीले दांतों की तस्वीर डालें। हमारा एआई विश्लेषण करेगा कि दाग गुटके के हैं या निकोटीन सिगरेट के।
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative">
              <span className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-sm border border-teal-100">4</span>
              <div className="pt-2 text-teal-600 font-bold mb-2">देसी नुस्खे और चैट गाइड</div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                एआई आपको सौंफ-इलायची तृप्ति चबाने और हल्दी-फिटकरी जैसे शक्तिशाली प्राकृतिक दंत पाउडर बनाने की विधि देगा।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ayurvedic Education Hub */}
      <section id="benefits" className="py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/2 space-y-6">
            <span className="text-teal-600 font-bold text-sm uppercase tracking-wider font-mono">Expert Botanical Remedies</span>
            <h3 className="text-3xl font-sans font-bold text-slate-900 leading-tight">
              तंबाकू-गुटका छोड़ने और दांत चमकाने की आयुर्वेदिक विधाएं
            </h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              पारंपरिक भारतीय दंत विज्ञान निकोटीन और तंबाकू के दुष्प्रभावों को प्राकृतिक और सुरक्षित तरीकों से ठीक करने में विश्वास रखता है। नीचे हमारे मुख्य समाधान स्तंभ दिए गए हैं:
            </p>

            {/* Quick interactive tabs */}
            <div className="flex gap-2 p-1.5 bg-slate-100 rounded-xl w-full max-w-md">
              <button
                onClick={() => setActiveTab('teeth')}
                className={`flex-1 py-2 text-xs md:text-sm font-medium rounded-lg transition-all ${activeTab === 'teeth' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:text-teal-700'}`}
              >
                1. दांत चमकाना (Whitening)
              </button>
              <button
                onClick={() => setActiveTab('habit')}
                className={`flex-1 py-2 text-xs md:text-sm font-medium rounded-lg transition-all ${activeTab === 'habit' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:text-teal-700'}`}
              >
                2. लत छुड़वाना (Addiction)
              </button>
              <button
                onClick={() => setActiveTab('smell')}
                className={`flex-1 py-2 text-xs md:text-sm font-medium rounded-lg transition-all ${activeTab === 'smell' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:text-teal-700'}`}
              >
                3. बदबू हटाना (Odour)
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md shadow-slate-100 border border-slate-200 min-h-[160px] transition-all">
              {activeTab === 'teeth' && (
                <div className="space-y-3">
                  <div className="font-semibold text-slate-900 flex items-center gap-2 text-teal-700">
                    <Sparkles className="w-4 h-4" /> हल्दी और सेंधा नमक दंत लेप
                  </div>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                    हल्दी में प्राकृतिक एंटी-बैक्टीरियल गुण होते हैं और सेंधा नमक एक कोमल एक्सफोलिएटर का काम करता है। सरसों के तेल की कुछ बूंदों के साथ इसका लेप दांतों के लाल-काले तंबाकू के धब्बों को धीरे-धीरे घिसकर साफ करने में मदद करता है।
                  </p>
                </div>
              )}
              {activeTab === 'habit' && (
                <div className="space-y-3">
                  <div className="font-semibold text-slate-900 flex items-center gap-2 text-teal-700">
                    <Ban className="w-4 h-4" /> मीठी सौंफ, मिश्री और अजवाइन थेरेपी
                  </div>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                    जब भी गुटका या सिगरेट पीने की तलब उठे, मुँह में गुटका दबाने के बजाय मीठी सौंफ, अजवाइन और मिश्री का मिश्रण चबाएं। यह मस्तिष्क को "oral fixation" (मुँह में कुछ रखने की तलब) की झूठी संतुष्टि देता है और निकोटीन क्रेविंग शांत करता है।
                  </p>
                </div>
              )}
              {activeTab === 'smell' && (
                <div className="space-y-3">
                  <div className="font-semibold text-slate-900 flex items-center gap-2 text-teal-700">
                    <Heart className="w-4 h-4" /> दालचीनी का पानी और हरी इलाइची चबाना
                  </div>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                    हरी इलाइची हानिकारक जीवाणुओं को नष्ट करती है। तंबाकू सेवन से सड़े हुए मसूड़ों की गंध को दूर करने के लिए दालचीनी की छाल को पानी में उबालकर कुल्ला करने से सांसें तुरंत ताजा हो जाती हैं।
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="p-2.5 bg-teal-50 text-teal-800 rounded-xl inline-flex border border-teal-100"><CheckCircle2 className="w-5 h-5" /></span>
              <h4 className="font-semibold text-slate-900">निजी और सुरक्षित (Private Profile)</h4>
              <p className="text-slate-500 text-xs md:text-sm leading-normal">
                आपकी समस्याएं और दांतों की तस्वीरें पूरी तरह से निजी और गुप्त रखी जाती हैं।
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="p-2.5 bg-teal-50 text-teal-800 rounded-xl inline-flex border border-teal-100"><Heart className="w-5 h-5" /></span>
              <h4 className="font-semibold text-slate-900">गुटका मुक्ति की राह (De-Addiction Tracker)</h4>
              <p className="text-slate-500 text-xs md:text-sm leading-normal">
                दिन में तंबाकू क्रेविंग को दबाने के लिए आयुर्वेदिक विकल्प और भोजन चिकित्सा गाइड।
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="p-2.5 bg-teal-50 text-teal-800 rounded-xl inline-flex border border-teal-100"><Sparkles className="w-5 h-5" /></span>
              <h4 className="font-semibold text-slate-900">दांतों का चमकदार होना (Instant Brightening)</h4>
              <p className="text-slate-500 text-xs md:text-sm leading-normal">
                पुराने पीलेपन और लाल दागों के लिए पारंपरिक जड़ी-बूटी युक्त मंजन बनाने की विधियां।
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="p-2.5 bg-teal-50 text-teal-800 rounded-xl inline-flex border border-teal-100"><AlertTriangle className="w-5 h-5" /></span>
              <h4 className="font-semibold text-slate-900">कैंसर से सुरक्षा (Prevention Alert)</h4>
              <p className="text-slate-500 text-xs md:text-sm leading-normal">
                तंबाकू के हानिकारक रसायनों से कैंसर होने का खतरा रहता है। समय रहते आदतों को बदलने का एआई मार्गदर्शन।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="bg-teal-950 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-teal-400 font-bold text-sm uppercase tracking-wider font-mono">Testimonials (शुभकामनाएं)</span>
            <h3 className="text-3xl md:text-4xl font-bold">सफलता की कहानियां</h3>
            <p className="text-emerald-200 text-sm md:text-base">
              जानिए कैसे साधारण देसी नुस्खों ने हमारे उपयोगकर्ताओं के जीवन और मुस्कान को बदला!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {REVIEWS.map((review) => (
              <div key={review.id} className="bg-teal-900 p-6 rounded-3xl border border-teal-800 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg text-teal-200">{review.name}</h4>
                      <p className="text-xs text-teal-300 font-medium font-sans">उम्र: {review.age} वर्ष | {review.location}</p>
                    </div>
                    <span className="px-3 py-1 bg-teal-600 text-white text-[11px] font-bold rounded-full">
                      {review.status}
                    </span>
                  </div>

                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-slate-200 text-sm italic leading-relaxed">
                    "{review.reviewText}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-teal-800">
                  <div>
                    <span className="text-[11px] text-teal-300 uppercase block font-medium">अवधि</span>
                    <span className="text-xs font-bold text-teal-100">{review.duration}</span>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-center">
                      <span className="text-[9px] text-teal-400 block font-mono">BEFORE</span>
                      <span className="text-xs font-bold text-amber-300">पीलापन/दाग</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[9px] text-teal-400 block font-mono">AFTER</span>
                      <span className="text-xs font-bold text-teal-400">श्वेत/मुस्कान</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick legal disclaimer note before pricing */}
      <div className="max-w-4xl mx-auto px-4 pt-12 text-center">
        <div className="bg-rose-50/50 border border-slate-200 p-4 rounded-2xl flex items-start gap-3 justify-center text-left max-w-2xl mx-auto shadow-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700">
            <strong className="block font-semibold mb-1 text-slate-900">विशेष सुरक्षा एवं वैधानिक चेतावनी (Medical Notice):</strong>
            आयुर्वेदिक मार्गदर्शन का उद्देश्य लत छोड़ने की क्रिया में संबल प्रदान करना है। यदि आपको मसूड़ों से भयंकर खून बहना, मुंह खोलने में अत्यधिक परेशानी (Submucous Fibrosis) या कोई संदिग्ध घाव दिखाई दे, तो तुरंत पास के दंत चिकित्सक (Dentist) या कैंसर रोग विशेषज्ञ से संपर्क करें।
          </div>
        </div>
      </div>

      {/* Pricing / CTA Section */}
      <section id="pricing" className="py-16 px-4 max-w-7xl mx-auto w-full text-center space-y-8 font-sans">
        <div className="max-w-xl mx-auto space-y-3">
          <span className="text-teal-600 font-bold text-sm tracking-wider uppercase font-mono">Affordable Access Plans</span>
          <h3 className="text-3xl font-extrabold text-slate-900">शुरू करने के लिए एक प्लान चुनें</h3>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            तंबाकू की लत पर जीत हासिल करने और घर बैठे आयुर्वेदिक दंत चिकित्सा समाधान पाने के लिए बेहद किफायती सशुल्क योजना में प्रवेश करें।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-6">
          {/* Plan 1 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border hover:border-teal-500 border-slate-200 flex flex-col justify-between space-y-6 relative transition-all hover:scale-[1.02]">
            <div className="space-y-4">
              <span className="text-xs tracking-wider uppercase font-extrabold text-slate-400 font-mono">Basic Support</span>
              <h4 className="text-3xl font-mono font-extrabold text-[#011]">₹49</h4>
              <p className="text-teal-800 font-bold text-xs bg-teal-50 py-1 px-3 rounded-full inline-block border border-teal-100/50">7 दिन की वैधता (7 Days)</p>
              
              <ul className="text-left text-xs md:text-sm text-slate-600 space-y-3 pt-4 border-t border-slate-100">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> 10 प्रश्न प्रतिदिन पूछें (Daily Quota)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> 1 फोटो अपलोड विश्लेषण</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> आयुर्वेदिक दंत पीलापन रिमूवल</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> गुटका-तंबाकू क्रेविंग शमन गाइड</li>
              </ul>
            </div>
            
            <button
              id="plan-basic-btn"
              onClick={onGetStarted}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full text-sm transition-colors shadow-sm"
            >
              लॉगिन करें और खरीदें <ArrowRight className="w-4 h-4 inline ml-1" />
            </button>
          </div>

          {/* Plan 2 */}
          <div className="bg-[#0f3433] bg-teal-900 p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6 relative transition-all hover:scale-[1.03] text-white">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-teal-900 text-[10px] uppercase font-black px-3 py-1 rounded-full shadow-md">
              Most Popular
            </div>
            <div className="space-y-4">
              <span className="text-xs tracking-wider uppercase font-extrabold text-teal-400 font-mono">Standard Plan</span>
              <h4 className="text-3xl font-black text-white font-mono">₹99</h4>
              <p className="text-teal-100 font-bold text-xs bg-teal-950/60 py-1 px-3 rounded-full inline-block border border-teal-800">12 दिन की वैधता (12 Days)</p>
              
              <ul className="text-left text-xs md:text-sm text-teal-100 space-y-3 pt-4 border-t border-teal-800/50">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#fbbf24]" /> 20 प्रश्न प्रतिदिन पूछें (Daily Quota)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#fbbf24]" /> 4 फोटो अपलोड और विस्तृत सलाह</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#fbbf24]" /> गहरी आयुर्वेदिक दंत ब्लीचिंग सूत्र</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#fbbf24]" /> दांत रगड़ने के लिए कस्टमाइज्ड मंजन</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#fbbf24]" /> मुंह की भयानक बदबू नियंत्रण क्रिया</li>
              </ul>
            </div>
            
            <button
              id="plan-standard-btn"
              onClick={onGetStarted}
              className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-500 text-white font-extrabold rounded-full transition-colors shadow-sm"
            >
              लॉगिन करें और खरीदें <ArrowRight className="w-4 h-4 inline ml-1" />
            </button>
          </div>

          {"   "}
          {/* Plan 3 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border hover:border-teal-500 border-slate-200 flex flex-col justify-between space-y-6 relative transition-all hover:scale-[1.02]">
            <div className="space-y-4">
              <span className="text-xs tracking-wider uppercase font-extrabold text-slate-400 font-mono">Premium Deep Care</span>
              <h4 className="text-3xl font-mono font-extrabold text-[#011]">₹199</h4>
              <p className="text-teal-800 font-bold text-xs bg-teal-50 py-1 px-3 rounded-full inline-block border border-teal-100/50">28 दिन की वैधता (28 Days)</p>
              
              <ul className="text-left text-xs md:text-sm text-slate-600 space-y-3 pt-4 border-t border-slate-100">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> 30 प्रश्न प्रतिदिन पूछें (Daily Quota)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> 10 फोटो अपलोड विश्लेषण</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> दांतों के पुराने गुटके के काले दागों का समाधान</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> लाइफटाइम मौखिक स्वास्थ्य संरक्षण टिप्स</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> 24/7 एआई आयुर्वेदिक असिस्टेंट</li>
              </ul>
            </div>
            
            <button
              id="plan-premium-btn"
              onClick={onGetStarted}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full text-sm transition-colors shadow-sm"
            >
              लॉगिन करें और खरीदें <ArrowRight className="w-4 h-4 inline ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <span className="bg-teal-600 text-white p-1.5 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="font-bold text-white text-base font-sans">Teeth Veda</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <button id="footer-terms-btn" onClick={() => onOpenLegal('terms')} className="hover:text-teal-400 transition-colors">शर्तें और कानूनी अस्वीकरण</button>
            <button id="footer-privacy-btn" onClick={() => onOpenLegal('privacy')} className="hover:text-teal-400 transition-colors">गोपनीयता नीति (Privacy Policy)</button>
          </div>

          <p>© 2026 Teeth Veda. सर्वाधिकार सुरक्षित। (For professional/informational support only).</p>
        </div>
      </footer>
    </div>
  );
}
