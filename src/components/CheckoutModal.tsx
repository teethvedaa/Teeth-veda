import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Check, HelpCircle, Shield, AlertCircle, RefreshCw } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: 'basic' | 'standard' | 'premium';
  price: number;
  planName: string;
  onPaymentSuccess: (paymentId: string) => void;
  userEmail?: string;
}

export default function CheckoutModal({ isOpen, onClose, planId, price, planName, onPaymentSuccess, userEmail }: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'wallet'>('upi');
  const [upiId, setUpiId] = useState('user@paytm');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [isLiveRazorpay, setIsLiveRazorpay] = useState(false);
  const [razorpayKeyId, setRazorpayKeyId] = useState<string | null>(null);

  // Check backend configuration on mount
  useEffect(() => {
    if (!isOpen) return;

    const checkConfig = async () => {
      try {
        const res = await fetch('/api/razorpay/config');
        if (res.ok) {
          const data = await res.json();
          setIsLiveRazorpay(data.isLive);
          setRazorpayKeyId(data.keyId);

          if (data.isLive) {
            // Pre-load Razorpay checkout script
            loadRazorpayScript();
          }
        }
      } catch (err) {
        console.warn('Could not retrieve payment config, using sandbox simulation fallback:', err);
      }
    };

    checkConfig();
  }, [isOpen]);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePaySimulate = () => {
    setIsPaying(true);
    setErrorStatus(null);
    setTimeout(() => {
      setIsPaying(false);
      const mockPayId = 'pay_' + Math.random().toString(36).substring(2, 11).toUpperCase();
      onPaymentSuccess(mockPayId);
    }, 1800);
  };

  const handleRealRazorpayPay = async () => {
    setIsPaying(true);
    setErrorStatus(null);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay payment gateway script failed to load. Please verify internet connection.');
      }

      // 1. Send request to create payment order on our backend
      const ordRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });

      const orderData = await ordRes.json();
      if (!ordRes.ok || !orderData.success) {
        throw new Error(orderData.error || orderData.details || 'Failed to create purchase order.');
      }

      // 2. Load and launch authentic inline Razorpay portal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Teeth Veda Dental Care",
        description: `${planName} Plus Premium Activation`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          setIsPaying(true);
          try {
            // 3. Verify Razorpay payload signature via server-side cryptography
            const verRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verData = await verRes.json();
            if (verRes.ok && verData.verified) {
              onPaymentSuccess(response.razorpay_payment_id);
            } else {
              setErrorStatus(verData.message || 'Signature security validation failed.');
            }
          } catch (verErr: any) {
            console.error('Signature verification call failed:', verErr);
            setErrorStatus('Network timing out during signature verification. Please notify admin or check email.');
          } finally {
            setIsPaying(false);
          }
        },
        prefill: {
          email: userEmail || 'support@teethveda.com',
          contact: '9876543210'
        },
        theme: {
          color: '#0d9488'
        },
        modal: {
          ondismiss: function () {
            setIsPaying(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error('Real Razorpay initialization failed:', err);
      setErrorStatus(err.message || 'Failed to connect to gateway payment server.');
      setIsPaying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#eceff1] flex flex-col"
        id="razorpay-simulation-frame"
      >
        {/* Razorpay Brand Header */}
        <div className="bg-[#1a2530] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 bg-blue-600 text-white rounded-lg font-black italic flex items-center justify-center text-sm font-sans tracking-tight">R</span>
            <div>
              <p className="text-xs uppercase text-slate-400 font-bold tracking-widest leading-none font-mono">Razorpay secure</p>
              <h3 className="text-base font-bold text-white mt-1">Teeth Veda</h3>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block font-mono">Amount</span>
            <span className="text-lg font-extrabold text-blue-400 font-mono">₹{price}.00</span>
          </div>
        </div>

        {/* Plan Overview Banner */}
        <div className="bg-teal-50 px-5 py-3 border-b border-teal-100/50 flex items-center justify-between text-xs text-teal-950 font-medium">
          <span>Active Plan: {planName}</span>
          <span className="bg-teal-600 text-white font-bold py-0.5 px-2 rounded-full transform scale-90">Instant</span>
        </div>

        <div className="p-5 flex-1 space-y-4">
          {isLiveRazorpay ? (
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100/60 text-emerald-950 text-xs leading-relaxed space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>लाइव गेटवे एक्टिवेटेड (Active Live Payment Mode)</span>
              </div>
              <p>यह एक सुरक्षित और असली पेमेंट गेटवे है। आप नीचे दिए गए बटन पर क्लिक करके सीधे UPI, कार्ड या नेट बैंकिंग से भुगतान पूरा कर सकते हैं।</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-405 font-semibold uppercase tracking-wider font-mono">Choose Payment Method (Simulator):</p>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'upi' ? 'border-blue-600 bg-blue-50/20 text-blue-700' : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="text-[11px] font-bold">BHIM UPI / GPay</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/20 text-blue-700' : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-[11px] font-bold">Credit/Debit</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'wallet' ? 'border-blue-600 bg-blue-50/20 text-blue-700' : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Check className="w-5 h-5" />
                  <span className="text-[11px] font-bold">Net Banking</span>
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                {paymentMethod === 'upi' && (
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 font-mono">UPI ID (e.g., Paytm/PhonePe)</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500 font-mono text-slate-800"
                    />
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 font-mono">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500 font-mono text-slate-800"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 font-mono">Expiry Date</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500 font-mono text-slate-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 font-mono">CVV</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="***"
                          maxLength={3}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500 font-mono text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'wallet' && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 font-mono">Select Bank</label>
                    <select className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:border-blue-500 text-slate-800">
                      <option>State Bank of India (SBI)</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>Punjab National Bank (PNB)</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="bg-amber-50 rounded-2xl p-3 flex items-start gap-2.5 border border-amber-100 text-[11px] text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>सैंडबॉक्स डेमो मोड (Sandbox Mode):</strong> इसके लिए किसी वास्तविक Razorpay API Key या असली पैसों की बिल्कुल ज़रूरत नहीं है। आप नीचे सीधे 'Pay Now' पर क्लिक करके बिना की (Key) के तुरंत सशुल्क एक्टिवेशन का परीक्षण कर सकते हैं।
                  <span className="block mt-1 text-slate-500 font-medium">(No real Razorpay API Key or actual payment credentials are required. Click &apos;Pay Now&apos; to instantly simulate and experience the subscription response.)</span>
                </p>
              </div>
            </>
          )}

          {errorStatus && (
            <div className="bg-red-50 text-red-800 text-[11px] p-3 rounded-2xl border border-red-100 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p><strong>भुगतान त्रुटि (Payment Error):</strong> {errorStatus}</p>
            </div>
          )}
        </div>

        {/* Action button bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            disabled={isPaying}
            className="px-4 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold tracking-wide"
          >
            Cancel
          </button>

          <button
            id="razorpay-simulate-pay-btn"
            onClick={isLiveRazorpay ? handleRealRazorpayPay : handlePaySimulate}
            disabled={isPaying}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-sm transition-all shadow-md shadow-blue-200 active:scale-95 disabled:bg-blue-400 flex items-center justify-center gap-2"
          >
            {isPaying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Processing (Securing)...
              </>
            ) : (
              `Pay Now ₹${price}.00`
            )}
          </button>
        </div>

        {/* Razorpay Trust footer */}
        <div className="py-2.5 bg-[#f5f8fa] border-t border-slate-100 text-center flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <Shield className="w-3.5 h-3.5 text-slate-400" />
          <span>PCI-DSS Compliant • 128-bit SSL Encrypted Secure Network</span>
        </div>
      </div>
    </div>
  );
}
