import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';
import { UserProfile, UserSubscription } from './types';
import { motion } from 'motion/react';

// Importing custom designed parts
import LandingPage from './components/LandingPage';
import LanguageSelection from './components/LanguageSelection';
import SubscriptionPortal from './components/SubscriptionPortal';
import CheckoutModal from './components/CheckoutModal';
import ChatbotRoom from './components/ChatbotRoom';
import LegalModal from './components/LegalDocs';
import { ShieldCheck, LogIn, Sparkles, HelpCircle, User, AlertCircle, RefreshCw } from 'lucide-react';

const PLAN_PRESETS = {
  basic: {
    planId: 'basic' as const,
    planName: 'बेसिक सपोर्ट (Basic Support)',
    price: 49,
    maxQuestionsPerDay: 10,
    maxPhotosTotal: 1,
    validityDays: 7
  },
  standard: {
    planId: 'standard' as const,
    planName: 'स्टैंडर्ड सुरक्षा (Standard Plan)',
    price: 99,
    maxQuestionsPerDay: 20,
    maxPhotosTotal: 4,
    validityDays: 12
  },
  premium: {
    planId: 'premium' as const,
    planName: 'प्रीमियम डीप केयर (Premium Care)',
    price: 199,
    maxQuestionsPerDay: 30,
    maxPhotosTotal: 10,
    validityDays: 28
  }
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<'landing' | 'language' | 'subscription' | 'chatbot'>('landing');
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(undefined);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auth / Legal Modal Toggle
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | null>(null);
  const [demoEmail, setDemoEmail] = useState('');
  const [demoName, setDemoName] = useState('');

  // Payment checkout states
  const [pendingPlanId, setPendingPlanId] = useState<'basic' | 'standard' | 'premium' | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Synchronize Google Auth state from Firebase client
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsAuthLoading(true);
      if (firebaseUser) {
        setCurrentUser(firebaseUser);
        await syncUserProfile(firebaseUser);
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setCurrentView('landing');
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync user profile state and limits inside Firestore database
  const syncUserProfile = async (firebaseUser: any) => {
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        setUserProfile(data);
        
        // Restore properties
        if (data.language) {
          setSelectedLanguage(data.language);
        }

        // Evaluate view gating based on configuration state
        if (!data.language) {
          setCurrentView('language');
        } else if (!data.subscription || !data.subscription.isActive || isPlanExpired(data.subscription)) {
          setCurrentView('subscription');
        } else {
          setCurrentView('chatbot');
        }
      } else {
        // Create brand new profile
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'Anonymous User',
          photoURL: firebaseUser.photoURL || undefined,
          createdAt: new Date().toISOString()
        };

        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
        setCurrentView('language');
      }
    } catch (err: any) {
      console.error('Error syncing profiles:', err);
      // Fallback local memory state to maintain user operations seamlessly
      const mockProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || 'guest@example.com',
        displayName: firebaseUser.displayName || 'Demo Guest',
        photoURL: firebaseUser.photoURL || undefined,
        createdAt: new Date().toISOString()
      };
      setUserProfile(mockProfile);
      setCurrentView('language');
    }
  };

  const isPlanExpired = (sub: UserSubscription): boolean => {
    const end = new Date(sub.endDate).getTime();
    return Date.now() > end;
  };

  // Google Sign-In trigger with standard fallback simulation for iframe sandbox constraints
  const handleSignInGoogle = async () => {
    setErrorMessage(null);
    setIsActionLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setIsLoginModalOpen(false);
    } catch (err: any) {
      const isPopupClosed = err?.code === 'auth/popup-closed-by-user' || err?.message?.includes('popup-closed-by-user');
      
      if (isPopupClosed) {
        console.warn('Google Sign-In popup closed by user before completion.');
        setErrorMessage(
          'लॉगिन अधूरा रह गया क्योंकि पॉपअप बंद कर दिया गया था। कृपया फिर से कोशिश करें या सीधा डेमो फॉर्म उपयोग करें। (Login was not completed as the window was closed. Please try again or use the instant Demo form below.)'
        );
      } else {
        console.error('Google Auth Failed:', err);
        // Fallback instruction triggers in cases of Iframe origin blockings
        setErrorMessage(
          'Google popup blocked by iframe sandbox restriction. Please use the immediate simulated Demo logging form below to test!'
        );
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  // Simulate Instant Demo Account Login
  const handleDemoLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoEmail.trim()) {
      setErrorMessage('Please enter an email.');
      return;
    }
    
    setIsActionLoading(true);
    setErrorMessage(null);

    const displayName = demoName.trim() || 'प्यारा यूज़र (Guest)';
    const cleanEmail = demoEmail.trim();
    const mockUid = 'demo_' + Math.random().toString(36).substring(2, 11);

    const mockFirebaseUser = {
      uid: mockUid,
      email: cleanEmail,
      displayName: displayName,
      photoURL: undefined
    };

    setCurrentUser(mockFirebaseUser);
    setIsLoginModalOpen(false);
    
    // Force sync profile creation manually
    await syncUserProfile(mockFirebaseUser);
    setIsActionLoading(false);
  };

  const handleLogout = async () => {
    setIsActionLoading(true);
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
    // Deep state clear logic
    setCurrentUser(null);
    setUserProfile(null);
    setSelectedLanguage(undefined);
    setCurrentView('landing');
    setIsActionLoading(false);
  };

  // Language assignment trigger
  const handleSelectLanguage = (lang: string) => {
    setSelectedLanguage(lang);
  };

  const handleProceedLanguage = async () => {
    if (!currentUser || !selectedLanguage || !userProfile) return;

    setIsActionLoading(true);
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        language: selectedLanguage
      });

      setUserProfile((prev: any) => ({
        ...prev,
        language: selectedLanguage
      }));

      // Direct to paywall verification screen
      if (!userProfile.subscription || !userProfile.subscription.isActive || isPlanExpired(userProfile.subscription)) {
        setCurrentView('subscription');
      } else {
        setCurrentView('chatbot');
      }
    } catch (err) {
      console.error(err);
      // Local fallback
      setCurrentView('subscription');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Open Checkout triggers
  const handleInitiateSubscribe = (planId: 'basic' | 'standard' | 'premium') => {
    setPendingPlanId(planId);
    setIsCheckoutOpen(true);
  };

  // Subscription approval handler following successful simulated checkout completion
  const handlePaymentSuccess = async (paymentId: string) => {
    if (!currentUser || !pendingPlanId || !userProfile) return;

    setIsCheckoutOpen(false);
    setIsActionLoading(true);

    const planData = PLAN_PRESETS[pendingPlanId];
    const todayStr = new Date().toISOString();
    const endStr = new Date(Date.now() + planData.validityDays * 24 * 60 * 60 * 1000).toISOString();

    const newSub: UserSubscription = {
      planId: pendingPlanId,
      planName: planData.planName,
      price: planData.price,
      maxQuestionsPerDay: planData.maxQuestionsPerDay,
      maxPhotosTotal: planData.maxPhotosTotal,
      questionsAskedToday: 0,
      photosUploadedToday: 0,
      startDate: todayStr,
      endDate: endStr,
      isActive: true
    };

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        subscription: newSub
      });

      setUserProfile((prev: any) => ({
        ...prev,
        subscription: newSub
      }));

      setCurrentView('chatbot');
    } catch (err) {
      console.error(err);
      // Local state fallback update
      setUserProfile((prev: any) => ({
        ...prev,
        subscription: newSub
      }));
      setCurrentView('chatbot');
    } finally {
      setIsActionLoading(false);
      setPendingPlanId(null);
    }
  };

  // Incremental Quota tracking update
  const handleUpdateSubscriptionQuotas = async (updates: Partial<UserSubscription>) => {
    if (!currentUser || !userProfile || !userProfile.subscription) return;

    const modifiedSub = {
      ...userProfile.subscription,
      ...updates
    };

    setUserProfile((prev: any) => ({
      ...prev,
      subscription: modifiedSub
    }));

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        subscription: modifiedSub
      });
    } catch (err) {
      console.error('Error writing quotas to DB:', err);
    }
  };

  const handleOpenLegal = (type: 'terms' | 'privacy') => {
    setLegalModalType(type);
  };

  const handleCtaGetStarted = () => {
    if (currentUser) {
      if (!userProfile?.language) {
        setCurrentView('language');
      } else if (!userProfile?.subscription?.isActive || isPlanExpired(userProfile.subscription)) {
        setCurrentView('subscription');
      } else {
        setCurrentView('chatbot');
      }
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div className="font-sans text-slate-800 min-h-screen flex flex-col">
      
      {/* Dynamic View Dispatcher */}
      {currentView === 'landing' && (
        <LandingPage 
          onGetStarted={handleCtaGetStarted} 
          onOpenLegal={handleOpenLegal} 
        />
      )}

      {currentView === 'language' && (
        <LanguageSelection
          selectedLanguage={selectedLanguage}
          onSelectLanguage={handleSelectLanguage}
          onProceed={handleProceedLanguage}
        />
      )}

      {currentView === 'subscription' && (
        <SubscriptionPortal
          onSubscribe={handleInitiateSubscribe}
          isLoading={isActionLoading}
        />
      )}

      {currentView === 'chatbot' && userProfile && userProfile.subscription && (
        <ChatbotRoom
          user={{
            displayName: currentUser.displayName || 'यूज़र',
            email: currentUser.email || 'user@example.com',
            photoURL: currentUser.photoURL
          }}
          subscription={userProfile.subscription}
          language={selectedLanguage || 'english'}
          onLogout={handleLogout}
          onUpdateSubscription={handleUpdateSubscriptionQuotas}
          onChangeLanguage={() => setCurrentView('language')}
        />
      )}

      {/* Login Popup Modal supporting direct standard flow and dynamic simulation fallbacks */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-teal-100 flex flex-col space-y-6 text-center"
            id="teethveda-login-modal"
          >
            
            {/* Header styling */}
            <div className="space-y-2">
              <span className="p-3 bg-teal-50 inline-flex items-center justify-center rounded-2xl text-teal-800 shadow-sm border border-teal-100/30">
                <ShieldCheck className="w-8 h-8" />
              </span>
              <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 font-sans">
                टीथ वेदा में प्रवेश करें
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Securely join Teeth Veda using Google authentication. Feel free to use the Sandbox demo form if popups are disabled.
              </p>
            </div>

            {/* Error notifications */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-900 text-xs text-left flex gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Primary Google Login Button */}
            <motion.button
              id="google-login-btn-popup"
              onClick={handleSignInGoogle}
              disabled={isActionLoading}
              animate={{
                scale: [1, 1.02, 1],
                boxShadow: [
                  "0 4px 6px -1px rgba(13, 148, 136, 0.2), 0 2px 4px -2px rgba(13, 148, 136, 0.2)",
                  "0 10px 15px -3px rgba(13, 148, 136, 0.35), 0 4px 6px -4px rgba(13, 148, 136, 0.35)",
                  "0 4px 6px -1px rgba(13, 148, 136, 0.2), 0 2px 4px -2px rgba(13, 148, 136, 0.2)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`w-full py-3 px-4 text-white font-bold rounded-full text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                isActionLoading
                  ? 'bg-teal-500/85 animate-pulse cursor-not-allowed shadow-none'
                  : 'bg-teal-600 hover:bg-teal-700 active:scale-95 disabled:bg-teal-300'
              }`}
            >
              {isActionLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  कृपया रुकें...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Google से लॉगिन करें (Main Button)
                </>
              )}
            </motion.button>

            {/* Simulated Fallback Portal Line */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-[10px] text-slate-400 font-bold font-mono">Or Sandbox Demo Form</span></div>
            </div>

            {/* Simulation form input panels */}
            <form onSubmit={handleDemoLogin} className="space-y-3 text-left">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider font-mono">Demo Nickname / Name</label>
                <input
                  type="text"
                  placeholder="e.g., Sushan Chauhan"
                  value={demoName}
                  onChange={(e) => setDemoName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-600 focus:bg-white text-slate-800 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider font-mono">Demo Email Address</label>
                <input
                  type="email"
                  placeholder="e.g., sushan@gmail.com"
                  required
                  value={demoEmail}
                  onChange={(e) => setDemoEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-600 focus:bg-white text-slate-800 font-semibold"
                />
              </div>

              <button
                id="demo-form-submit-btn"
                type="submit"
                disabled={isActionLoading}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-950 text-white hover:shadow-md text-xs font-bold rounded-xl transition-all"
              >
                Sandbox Login instantly
              </button>
            </form>

            <button
              id="cancel-modal-btn"
              onClick={() => setIsLoginModalOpen(false)}
              className="text-xs text-slate-500 hover:text-teal-700 font-semibold"
            >
              Cancel & Close
            </button>

          </div>
        </div>
      )}

       {/* Payment checkout simulation */}
      {isCheckoutOpen && pendingPlanId && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          planId={pendingPlanId}
          price={PLAN_PRESETS[pendingPlanId].price}
          planName={PLAN_PRESETS[pendingPlanId].planName}
          userEmail={currentUser?.email || undefined}
          onClose={() => {
            setIsCheckoutOpen(false);
            setPendingPlanId(null);
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Terms & Privacy Policies modal */}
      {legalModalType && (
        <LegalModal
          isOpen={!!legalModalType}
          type={legalModalType}
          onClose={() => setLegalModalType(null)}
        />
      )}

    </div>
  );
}
