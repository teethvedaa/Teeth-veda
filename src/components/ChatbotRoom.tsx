import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, User, LogOut, Sparkles, PlusCircle, AlertCircle, RefreshCw, BarChart2, ShieldAlert, Check, HelpCircle, FileText } from 'lucide-react';
import { ChatMessage, UserSubscription } from '../types';

interface ChatbotRoomProps {
  user: {
    displayName: string;
    email: string;
    photoURL?: string;
  };
  subscription: UserSubscription;
  language: string;
  onLogout: () => void;
  onUpdateSubscription: (updates: Partial<UserSubscription>) => void;
  onChangeLanguage: () => void;
}

const COMMON_QUESTIONS = {
  hindi: [
    { label: 'दांतों के गुटका/पान के काले-लाल दाग कैसे साफ करें?', text: 'मेरे दांतों पर गुटका और सुपारी खाने से गहरे काले और लाल धब्बे हो गए हैं। इन्हें साफ करने के लिए कृपया सर्वोत्तम आयुर्वेदिक घरेलू नुस्खा (मंजन और लेप) बताएं।' },
    { label: 'गुटका चबाने की तीव्र तलब (craving) रोकने का घरेलू इलाज?', text: 'मुझे सिगरेट और गुटका खाने की तीव्र तलब उठती है। आयुर्वेद में इसका क्या विकल्प है? मीठी सौंफ, मिश्री या अन्य उपचार कैसे काम करते हैं?' },
    { label: 'मुंह से उठने वाली भयानक सांसों की दुर्गंध को कैसे ठीक करें?', text: 'तंबाकू चबाने के कारण मसूड़ों से दुर्गंध आती है और मुंह सूखता है। सांसों को तरोताजा करने का कोई अचूक देसी नुस्खा बताएं।' },
    { label: 'मुंह कम खुलने (Submucous Fibrosis) की शुरुआती समस्या का हल?', text: 'गुटका खाने से मेरा मुंह पूरी तरह से नहीं खुल रहा है। आयुर्वेद में मसूड़ों के स्वास्थ्य और लचीलेपन को वापस पाने के लिए क्या उपचार बताए गए हैं?' }
  ],
  english: [
    { label: 'How to clean stubborn tobacco/nicotine stains from teeth?', text: 'I have dark red and yellow spots on my teeth due to smoking and tobacco. Please suggest a safe Ayurvedic herbal remedy to remove them at home.' },
    { label: 'Natural ways to block tobacco smoking cravings instantly?', text: 'What are some effective kitchen remedies like sweet fennel (saunf), cardamom or ginger to stop tobacco cravings when they strike?' },
    { label: 'How to fix severe bad breath caused by tobacco chewing?', text: 'My mouth feels dry and smells bad due to cigarette/tobacco. Give me some quick herbal rinse/gargle ideas.' },
    { label: 'Early stage solutions for limited mouth opening due to gutka?', text: 'My jaw feels tight and mouth opens less due to chewing gutka. Are there any oil pulling (Gandusha) or gum massage therapies?' }
  ],
  hinglish: [
    { label: 'Danto se gutka aur nicotine ke daag kaise hatayein?', text: 'Mere teeth par gutka aur khaini khane se dark spots ho gaye hain. Inko saaf karne ke liye safe Ayurvedic manjan aur gharelu upay batayein.' },
    { label: 'Tabacco khane ki craving rokne ke liye best Desi alternatives?', text: 'Mujhe gutka chabane ki jabardast craving hoti hai. Use khatam karne ke liye mithi saunf, mishri ya elaichi kis prakar se istamal karein?' },
    { label: 'Muh ki smell aur sukha-pan kaise thik karein?', text: 'Nicotine use se muh me badboo aati hai or saliva kam banta h. Saas ko fresh rakhne ke liye dadi-nani ke nuskhe batayein.' },
    { label: 'Muh kam khulne (lock jaw) ki problem ko kaise thik karein?', text: 'Khaas kar gutka khane walo ka jaw jam hone lagta h. Isko normal karne k liye soft massage therapy or oil pulling exercises kaise karein?' }
  ],
  bengali: [
    { label: 'দাঁতের গুটখা এবং তামাকের দাগ দূর করার সহজ উপায়?', text: 'গুটখা ও সুপারি খাওয়ার ফলে আমার দাঁতে কালচে ও লালচে দাগ পড়ে গেছে। এটি পরিষ্কার করার জন্য ঘরোয়া আয়ুর্বেদিক নির্দেশিকা দিন।' },
    { label: 'তামাকের আসক্তি ও ক্রেভিং কমানোর প্রাকৃতিক সমাধান?', text: 'যখনই গুটখা বা ধূমপান করার ইচ্ছা জাগে, তখন মিষ্টি মৌরি বা এলাচ কীভাবে সাহায্য করতে পারে? এটি বন্ধ করার আয়ুর্বেদিক উপায় বলুন।' },
    { label: 'মুখের মারাত্মক দুর্গন্ধ ও মसूড়া ফোলা কমানোর উপায়?', text: 'তামাক ব্যবহারের কারণে মুখ শুকিয়ে যায় ও দুর্গন্ধ বের হয়। শ্বাস সতেজ করার জন্য ত্রিফলা বা দারুচিনির কোনো রেসিপি বলুন।' }
  ],
  marathi: [
    { label: 'गुटखा आणि तंबाखूचे दातांवरील काळे डाग कसे काढावेत?', text: 'माझ्या दातांवर तंबाखूमुळे लालसर-काळे डाग पडले आहेत. हे डाग घरगुती आयुर्वेदिक मंजन वापरून कसे साफ करता येतील?' },
    { label: 'तंबाखू खाण्याची तीव्र इच्छा बंद करण्यासाठी घरगुती पर्याय?', text: 'गुटखा खाण्याची तलफ आल्यावर मीठी बडीशेप, वेलची किंवा कोरडे आले कोणत्या विशिष्ट पद्धतीने खायला हवे जेणेकरून व्यसन सुटेल?' },
    { label: 'तोंडाचा कोरडेपणा आणि दुर्गंधी घालवण्याचे वैदिक उपाय?', text: 'सतत खैनी खाण्यामुळे तोंडाला येणारी घाण वास कमी करण्यासाठी काय करावे? दालचिनी किंवा लवंग पाण्याचे गुळण्या करण्याचे प्रमाण सांगा.' }
  ]
};

const DEFAULT_WELCOME_MSG = {
  hindi: 'नमस्ते! मैं "टीथ वेदा" आयुर्वेदिक एआई एक्सपर्ट कोच हूँ। मैं गुटका, खैनी, जर्दा या धूम्रपान की आदतों को छुड़वाने की यात्रा में आपका साथी हूँ। आप अपने पीले दांतों, मसूड़ों की परेशानी या तंबाकू छोड़ने (जैसे सौंफ-मिश्री थेरेपी) के विषय में कोई भी प्रश्न पूछें। यदि आप चाहें, तो ऊपर बने कैमरा आइकन द्वारा अपने दांतों की तस्वीर अपलोड करें ताकि मैं विश्लेषण कर सकूँ!',
  english: 'Namaste! I am your "Teeth Veda" Ayurvedic AI expert coach. I am here to help you quit gutka, khaini, smoking, and help restore your natural white smile. Ask me anything about removing stains, fixing bad breath, or controlling cravings (e.g., using fennel-sugar candy therapy). You can also click the camera button to upload a photo of your teeth for a botanical stain analysis!',
  hinglish: 'Namaste! Main "Teeth Veda" Ayurvedic AI Expert Coach hoon. Main gutka, khaini, tambaku, aur smoking chhudane me aapki madad karunga, aur pile teeth ko naturally chamkayenge. Aap danto k spots, badboo (bad breath) ya craving rokne (jaise mithi saunf tharapy) ke baare me koi bhi sawal puch sakte hain. Aap teeth ki photo click karke bhi analysis ke liye bhej sakte hain!',
  bengali: 'নমস্কার! আমি "টিথ বেদ" আয়ুর্বেদিক এআই বিশেষজ্ঞ। গুটখা, খৈনি বা ধূমপান ছাড়ার যাত্রায় আমি আপনার সহায়ক। আপনার দাঁতের দাগ, মুখের দুর্গন্ধ বা তামাকের ক্রেভিং নিয়ন্ত্রণের জন্য প্রশ্ন করতে পারেন। আপনি দাঁতের ফটো আপলোড করেও বিশ্লেষণ করাতে পারেন!',
  marathi: 'नमस्कार! मी "टीथ वेद" आयुर्वेदिक एआई सोबती आहे. गुटखा, खैनी किंवा धूम्रपान सोडण्याच्या प्रवासात मी मदत करेन. पिवळे पडलेले दात, तोंडातील दुर्गंधी किंवा व्यसनमुक्तीचे उपाय (बडीशेप थेरेपी) यावर काहीही विचारा. दातांचे फोटो अपलोड करून विश्लेषण देखील करू शकता!'
};

export default function ChatbotRoom({ 
  user, 
  subscription, 
  language, 
  onLogout, 
  onUpdateSubscription,
  onChangeLanguage
}: ChatbotRoomProps) {
  
  const selectedLanguage = (language || 'english').toLowerCase() as keyof typeof COMMON_QUESTIONS;
  const welcomeText = DEFAULT_WELCOME_MSG[selectedLanguage] || DEFAULT_WELCOME_MSG.english;
  const questionsList = COMMON_QUESTIONS[selectedLanguage] || COMMON_QUESTIONS.english;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      content: welcomeText,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isFileDragging, setIsFileDragging] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Drag-and-Drop file
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsFileDragging(true);
  };

  const handleDragLeave = () => {
    setIsFileDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed!');
      return;
    }
    setImageName(file.name);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsFileDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const selectPreQuery = (text: string) => {
    setInputText(text);
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeSelectedImage = () => {
    setSelectedImageBase64(null);
    setImageName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const trimmedInput = inputText.trim();
    if (!trimmedInput && !selectedImageBase64) return;

    setErrorText(null);

    // Verify Subscription Quota Limits
    if (subscription.questionsAskedToday >= subscription.maxQuestionsPerDay) {
      setErrorText(`आपकी आज की प्रश्न पूछने की सीमा समाप्त हो गई है (${subscription.maxQuestionsPerDay}/${subscription.maxQuestionsPerDay} Queries reached). कृप्या कल प्रयास करें अथवा प्लान अपग्रेड करें।`);
      return;
    }

    if (selectedImageBase64 && subscription.photosUploadedToday >= subscription.maxPhotosTotal) {
      setErrorText(`आपकी इस प्लान की फोटो अपलोड सीमा समाप्त हो गई है (${subscription.photosUploadedToday}/${subscription.maxPhotosTotal} Photos Used).`);
      return;
    }

    const newUserMessage: ChatMessage = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: trimmedInput || 'I uploaded a dental snapshot for analysis.',
      timestamp: new Date().toISOString(),
      imageUrl: selectedImageBase64 || undefined
    };

    // Append user message
    setMessages((prev) => [...prev, newUserMessage]);
    setInputText('');
    
    // Increment local quota counts
    const updatedQuestions = subscription.questionsAskedToday + 1;
    const updatedPhotos = selectedImageBase64 
      ? subscription.photosUploadedToday + 1 
      : subscription.photosUploadedToday;

    onUpdateSubscription({
      questionsAskedToday: updatedQuestions,
      photosUploadedToday: updatedPhotos
    });

    // Reset selected image after sending
    const imageToSend = selectedImageBase64;
    removeSelectedImage();

    setIsSending(true);

    try {
      // API call to local Express backend /api/chat which has access to the server-side GEMINI_API_KEY securely.
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newUserMessage.content,
          image: imageToSend, // base64 string
          language: selectedLanguage,
          history: messages.slice(-5).map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error('एआई रिस्पांस जनरेट करने में त्रुटि हुई।');
      }

      const data = await response.json();
      
      const newAiMessage: ChatMessage = {
        id: 'ai-' + Date.now(),
        role: 'model',
        content: data.reply || 'मैं समझ गया। कृपया अपना प्रश्न दोबारा पूछें।',
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, newAiMessage]);
    } catch (err: any) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: 'error-' + Date.now(),
        role: 'model',
        content: 'क्षमस्व (Sorry), सर्वर से कनेक्ट करने में कुछ समस्या आ रही है। कृपया सुनिश्चित करें कि आपने सुसंगत .env फ़ाइल में GEMINI_API_KEY को सही ढंग से अपडेट किया है। आप ऑफलाइन मोड में हैं। पर आपके लिए एक देसी नुस्खा: तंबाकू की तलब रोकने के लिए तुरंत "मीठी सौंफ" चबाएं!',
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-800 min-h-screen flex flex-col lg:flex-row font-sans">
      
      {/* Sidebar: Subscriptions Quota & Ayurvedic Instructions */}
      <aside className="w-full lg:w-80 bg-teal-950 text-teal-100 flex-shrink-0 flex flex-col p-6 space-y-6 border-b lg:border-b-0 lg:border-r border-teal-900 shadow-xl">
        
        {/* App Title */}
        <div className="flex items-center gap-3">
          <span className="p-2 bg-teal-600 text-white rounded-xl shadow-md flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">Teeth Veda</h1>
            <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block font-mono">Expert Natural Coach</span>
          </div>
        </div>

        {/* User profile brief card */}
        <div className="bg-teal-900/30 p-4 rounded-2xl border border-teal-800/40 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-900 border border-teal-800 overflow-hidden flex items-center justify-center text-white font-bold uppercase font-mono">
              {user.photoURL ? (
                <img referrerPolicy="no-referrer" src={user.photoURL} alt="User Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-teal-300" />
              )}
            </div>
            <div className="truncate flex-1">
              <p className="font-semibold text-xs text-white truncate leading-tight">{user.displayName || 'शरणार्थी'}</p>
              <p className="text-[10px] text-teal-300 truncate mt-0.5">{user.email}</p>
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <button
              id="change-language-sidebar-btn"
              onClick={onChangeLanguage}
              className="flex-1 py-1 px-2.5 bg-teal-800 hover:bg-teal-700 rounded-lg text-[10px] sm:text-xs font-semibold text-teal-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              भाषा बदलें ({selectedLanguage.toUpperCase()})
            </button>
            <button
              id="logout-sidebar-btn"
              onClick={onLogout}
              className="py-1 px-2.5 border border-teal-800 hover:border-red-400 hover:text-red-300 rounded-lg text-[10px] sm:text-xs font-bold text-teal-305 text-teal-300 flex items-center justify-center transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quota Dashboard Card */}
        <div className="bg-teal-900/40 p-4 rounded-2xl border border-teal-800/60 space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-xs font-bold text-teal-400">
            <span>सक्रिय प्लान (Active Plan)</span>
            <span className="bg-teal-600 text-white rounded-full px-2 py-0.5 text-[9px] uppercase font-mono tracking-wider shadow-sm">
              {subscription.planName}
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {/* Questions Left Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-teal-200">
                <span>दैनिक प्रश्न इस्तेमाल (Queries left)</span>
                <span className="font-mono">{subscription.maxQuestionsPerDay - subscription.questionsAskedToday} / {subscription.maxQuestionsPerDay}</span>
              </div>
              <div className="w-full bg-teal-950 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.max(0, Math.min(100, ((subscription.maxQuestionsPerDay - subscription.questionsAskedToday) / subscription.maxQuestionsPerDay) * 100))}%` }}
                />
              </div>
            </div>

            {/* Photos Left Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-teal-200">
                <span>कुल फोटो अपलोड (Photos left)</span>
                <span className="font-mono">{subscription.maxPhotosTotal - subscription.photosUploadedToday} / {subscription.maxPhotosTotal}</span>
              </div>
              <div className="w-full bg-teal-950 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.max(0, Math.min(100, ((subscription.maxPhotosTotal - subscription.photosUploadedToday) / subscription.maxPhotosTotal) * 100))}%` }}
                />
              </div>
            </div>

            {/* Plan Validity End Date */}
            <div className="text-[10px] text-teal-300 flex items-center justify-between pt-1 border-t border-teal-800/40">
              <span>वैधता समाप्त (Ends in):</span>
              <span className="font-bold font-mono">
                {new Date(subscription.endDate).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Herbal Tip Box */}
        <div className="bg-[#0b2827] bg-teal-950/60 p-4 rounded-2xl border-l-4 border-amber-400 border border-teal-800/30 flex gap-2.5 text-xs text-teal-200">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-white text-[11px] uppercase tracking-wide">वैदिक नुस्खा (Daily Wisdom)</p>
            <p className="leading-relaxed text-teal-100">
              तंबाकू और सिगरेट चबाने की तीव्र इच्छा होने पर मुंह में बारीक सौंफ और मिश्री के दाने रखकर धीरे-धीरे चबाएं। हल्दी के साथ चुटकी भर सेंधा नमक और सरसों तेल मिलाकर दांतों की रोज सुबह मसाज करें, जिद्दी धब्बे पिघलने लगेंगे।
            </p>
          </div>
        </div>

        {/* Small Medical Alert Legal Link */}
        <p className="text-[10px] text-slate-400 text-center leading-normal">
          टीथ वेदा एआई के घरेलू नुस्खे सामान्य स्वास्थ्य के लिए हैं। गंभीर रोगों में चिकित्सक की सलाह अपरिहार्य है।
        </p>
      </aside>

      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col bg-[#fcfdfc] h-[calc(100vh-250px)] lg:h-screen">
        
        {/* Chat Status Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-slate-800">Teeth Veda Chat Assistant</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>भाषा:</span>
            <span className="bg-teal-50 border border-teal-100 text-teal-800 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase">
              {selectedLanguage}
            </span>
          </div>
        </header>

        {/* Messages List Area */}
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative ${
            isFileDragging ? 'bg-teal-50/10 border-2 border-dashed border-teal-500' : ''
          }`}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 max-w-3xl ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Chat Bubble Avatar */}
              <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold leading-none ${
                msg.role === 'user' 
                  ? 'bg-teal-600 text-white shadow-sm' 
                  : 'bg-teal-100 text-teal-800'
              }`}>
                {msg.role === 'user' ? 'U' : 'V'}
              </div>

              {/* Chat Bubble Content */}
              <div className="space-y-1.5 flex-1 min-w-0 max-w-[85%] md:max-w-[70%]">
                <div className={`rounded-[24px] px-5 py-3.5 shadow-sm space-y-2 leading-relaxed text-sm ${
                  msg.role === 'user'
                    ? 'bg-teal-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none font-medium'
                }`}>
                  
                  {/* Embedded message image path */}
                  {msg.imageUrl && (
                    <div className="rounded-xl overflow-hidden mb-2 max-w-[200px] border border-slate-100 bg-slate-50">
                      <img referrerPolicy="no-referrer" src={msg.imageUrl} alt="Uploaded Dental Snapshot" className="w-full h-auto object-cover" />
                    </div>
                  )}

                  <p className="whitespace-pre-line text-xs md:text-[13.5px] leading-relaxed">
                    {msg.content}
                  </p>
                </div>
                
                {/* Time identifier */}
                <p className={`text-[9px] text-slate-400 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* AI generating loader */}
          {isSending && (
            <div className="flex items-start gap-3.5 max-w-3xl mr-auto">
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold flex-shrink-0">
                V
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-2 text-slate-500 font-medium text-xs rounded-tl-none shadow-sm">
                <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
                <span>टीथ वेदा समाधान खोज रहा है... (Finding herbal insights)</span>
              </div>
            </div>
          )}

          {/* Empty spacer ref */}
          <div ref={messagesEndRef} />
        </div>

        {/* Warning Toast message if limit hit or error */}
        {errorText && (
          <div className="mx-4 my-2 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-900 text-xs flex items-start gap-2 max-w-3xl lg:mx-auto lg:w-full">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <p className="font-semibold leading-normal">{errorText}</p>
          </div>
        )}

        {/* Preset suggestions list */}
        {messages.length < 3 && !isSending && (
          <section className="px-4 py-2 border-t border-slate-200 flex-shrink-0 bg-slate-50/20 max-w-4xl lg:mx-auto lg:w-full">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-teal-600" /> तुरंत पूछें (Single Click Queries):
            </h4>
            <div className="flex flex-wrap gap-2">
              {questionsList.map((item, index) => (
                <button
                  id={`preset-query-${index}`}
                  key={index}
                  onClick={() => selectPreQuery(item.text)}
                  className="px-3 py-2 bg-white hover:bg-teal-50 hover:border-teal-250 border border-slate-200 text-[11px] md:text-xs text-slate-700 hover:text-teal-950 font-semibold rounded-full text-left transition-all shadow-sm flex items-center gap-2 max-w-full truncate"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Input Text Form & Upload triggers */}
        <footer className="p-4 bg-white border-t border-slate-200 flex-shrink-0 mt-auto">
          <div className="max-w-4xl mx-auto">
            
            {/* Show currently selected file preview */}
            {selectedImageBase64 && (
              <div className="mb-2.5 p-2 bg-teal-50 rounded-full border border-teal-100 inline-flex items-center gap-2.5 text-xs text-teal-900 font-semibold shadow-sm animate-pulse">
                <span className="p-1 bg-teal-100 rounded-lg"><Upload className="w-3.5 h-3.5 text-teal-800" /></span>
                <span className="truncate max-w-[200px] font-mono text-[11px]">{imageName || 'teeth_photo.jpg'}</span>
                <button 
                  id="remove-attached-image-btn"
                  onClick={removeSelectedImage} 
                  className="text-red-600 hover:text-red-900 font-extrabold text-sm hover:scale-110 p-0.5 rounded-full hover:bg-rose-100 flex items-center justify-center leading-none"
                  title="Remove Image"
                >
                  ✕
                </button>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
              
              {/* Photo Upload Hidden Input Trigger */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="teeth-photo-file-picker"
              />
              
              <button
                id="chat-upload-thumbnail-btn"
                type="button"
                onClick={triggerUploadClick}
                disabled={isSending}
                className={`p-3 bg-slate-50 border border-slate-250 rounded-xl hover:bg-teal-50 hover:border-teal-400 hover:text-teal-700 text-slate-500 transition-all flex items-center justify-center flex-shrink-0 active:scale-95 ${
                  selectedImageBase64 ? 'bg-teal-50 text-teal-800 border-teal-300' : ''
                }`}
                title="दांतों की फोटो अपलोड करें (Upload Teeth Snapshot)"
              >
                <Upload className="w-5 h-5" />
              </button>

              {/* Text Input Row */}
              <input
                id="chat-user-message-input"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="यहाँ गुटका-तंबाकू की लत या दांत चमकाने के घरेलू नुस्खे पूछें..."
                disabled={isSending}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-teal-600 focus:bg-white text-slate-800 font-medium"
              />

              <button
                id="chat-submit-btn"
                type="submit"
                disabled={isSending || (!inputText.trim() && !selectedImageBase64)}
                className="p-3 bg-teal-600 rounded-full hover:bg-teal-700 text-white disabled:bg-slate-250 disabled:text-slate-400 transition-all flex items-center justify-center flex-shrink-0 active:scale-95 shadow-md shadow-teal-100"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            <span className="text-[10px] text-slate-400 text-center block mt-2 leading-relaxed">
              Drag & Drop your teeth image directly into the chat area. Strictly Ayurvedic and Herbal guidelines only.
            </span>
          </div>
        </footer>

      </main>

    </div>
  );
}
