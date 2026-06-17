import React from 'react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

export default function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-teal-100 flex flex-col"
        id="legal-modal-container"
      >
        <div className="sticky top-0 bg-teal-50 px-6 py-4 border-b border-teal-100 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-teal-900 font-sans">
            {type === 'terms' ? 'शर्तें और कानूनी अस्वीकरण (Terms and Disclaimer)' : 'गोपनीयता नीति (Privacy Policy)'}
          </h3>
          <button 
            id="close-legal-modal-btn"
            onClick={onClose}
            className="text-teal-700 hover:text-teal-900 font-bold p-1 rounded-full hover:bg-teal-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 text-slate-700 space-y-6 text-sm leading-relaxed overflow-y-auto">
          {type === 'terms' ? (
            <>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
                <p className="font-semibold text-amber-900 text-base">महत्वपूर्ण अस्वीकरण (Medical Disclaimer):</p>
                <p className="mt-1 text-amber-800 font-medium">
                  टीथ वेदा (Teeth Veda) एक एआई-संचालित चैटबॉट है जो धूम्रपान, गुटका, खैनी और तंबाकू जैसी आदतों को छोड़ने, दांतों के पीलेपन को हटाने और सांसों की दुर्गंध को ठीक करने के लिए पारंपरिक आयुर्वेदिक और घरेलू नुस्खे (Desi Nuskhe) प्रदान करता है।
                </p>
                <p className="mt-2 text-amber-800">
                  यह कोई दंत चिकित्सक (Dentist) या डॉक्टर उपकरण नहीं है। यहाँ प्रदान की गई जानकारी केवल सूचनात्मक उद्देश्यों के लिए है। किसी भी गंभीर दंत समस्या या मसूड़ों की बीमारी के लिए तुरंत पेशेवर डेंटिस्ट से संपर्क करें।
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 text-base mb-1">1. सेवाओं का उपयोग (Usage of Services)</h4>
                <p>
                  Teeth Veda चैटबॉट का उपयोग करके, आप सहमत हैं कि आप अपने जोखिम पर इसका उपयोग कर रहे हैं। चैटबॉट द्वारा सुझाए गए घरेलू नुस्खे सामान्य स्वास्थ्य के लिए हैं, ये किसी चिकित्सकीय निदान (treatment) का हिस्सा नहीं हैं।
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 text-base mb-1">2. भुगतान और रिफंड नीति (Subscription & Refund Policy)</h4>
                <p>
                  चैटबॉट की बातचीत का स्तर सशुल्क (paid subscription) है। हम 49 रुपये, 99 रुपये और 199 रुपये के प्लान पेश करते हैं। सभी भुगतान अंतिम हैं और कोई रिफंड प्रदान नहीं किया जा सकता क्योंकि यह एक डिजिटल एआई उत्पाद है।
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 text-base mb-1">3. उपयोग की सीमाएं (Daily Quota Limits)</h4>
                <p>
                  विविध योजनों के अनुसार प्रतिदिन प्रश्नों की सीमा तय है:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>₹49 प्लान: प्रतिदिन 10 प्रश्न, 1 फोटो अपलोड, 7 दिन की वैधता।</li>
                    <li>₹99 प्लान: प्रतिदिन 20 प्रश्न, 4 फोटो अपलोड, 12 दिन की वैधता।</li>
                    <li>₹199 प्लान: प्रतिदिन 30 प्रश्न, 10 फोटो अपलोड, 28 दिन की वैधता।</li>
                  </ul>
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 text-base mb-1">4. कानूनी दायित्व (Legal Liabilities)</h4>
                <p>
                  दांतों या मसूड़ों की संवेदनशील स्थितियों या एलर्जी के मामलों में घरेलू उपचारों के कारण होने वाले किसी भी प्रतिकूल प्रभाव के लिए Teeth Veda कानूनी रूप से जिम्मेदार नहीं होगा। किसी भी घरेलू नुस्खे को लागू करने से पहले डॉक्टर से परामर्श अवश्य लें।
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 className="font-semibold text-slate-900 text-base mb-1">1. एकत्रित डेटा (Data Collected)</h4>
                <p>
                  जब आप Google लॉगिन का उपयोग करते हैं, तो हम आपका नाम और ईमेल पता एकत्र करते हैं। इसके अलावा, चैटबॉट के माध्यम से भेजे गए टेक्स्ट मैसेज और आपके द्वारा अपलोड की गई दांतों की तस्वीरें सुरक्षित रूप से हमारे स्टोर (Firebase Firestore) में सेव की जाती हैं ताकि एआई उसका विश्लेषण कर सके।
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 text-base mb-1">2. डेटा सुरक्षा और गोपनीयता (Data Security)</h4>
                <p>
                  आपकी तस्वीरें और चैट विवरण पूरी तरह से सुरक्षित हैं। हम आपका डेटा किसी भी तीसरे पक्ष (Third party) को नहीं बेचते हैं। आपके लॉगिन और भुगतान की जानकारी पूरी तरह से सुरक्षित क्लाउड और गेटवे (Razorpay) द्वारा प्रबंधित की जाती है।
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 text-base mb-1">3. फोटो अपलोड (Photo Uploads)</h4>
                <p>
                  दांतों की पीलापन डिग्री का विश्लेषण करने के लिए ही आपकी फोटो का उपयोग हमारे चैटबॉट इंफ्रास्ट्रक्चर में किया जाता है। हम आपकी फोटो को किसी सार्वजनिक डोमेन पर अपलोड नहीं करते हैं।
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 text-base mb-1">4. उपयोगकर्ता नियंत्रण (User Control)</h4>
                <p>
                  आप कभी भी अपने चैट डेटा या अकाउंट को डिलीट करने का अनुरोध कर सकते हैं। अधिक जानकारी के लिए हमसे chauhansushan84@gmail.com पर संपर्क करें।
                </p>
              </div>
            </>
          )}
        </div>

        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-100 p-4 flex justify-end">
          <button 
            id="close-modal-bottom-btn"
            onClick={onClose}
            className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-xl transition-all shadow-sm"
          >
            मैंने पढ़ लिया और स्वीकार करता हूं (Dismiss)
          </button>
        </div>
      </div>
    </div>
  );
}
