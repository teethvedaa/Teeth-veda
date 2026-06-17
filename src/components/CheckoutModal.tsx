import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Check, HelpCircle, Shield, AlertCircle, RefreshCw } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: 'basic' | 'standard' | 'premium';
  price: number;
  planName: string;
  onPaymentSuccess: (paymentId: string) => void;
}

export default function CheckoutModal({ isOpen, onClose, planId, price, planName, onPaymentSuccess }: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'wallet'>('upi');
  const [upiId, setUpiId] = useState('user@paytm');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  if (!isOpen) return null;

  const handlePaySimulate = () => {
    setIsPaying(true);
    setErrorStatus(null);
    setTimeout(() => {
      setIsPaying(false);
      const mockPayId = 'pay_' + Math.random().toString(36).substring(2, 11).toUpperCase();
      onPaymentSuccess(mockPayId);
    }, 1800);
  };

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
              <strong>Sandbox Demo Mode:</strong> For previewing and user testing, click Pay below to create a successful subscription instantly. No actual money is charged.
            </p>
          </div>
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
            onClick={handlePaySimulate}
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
