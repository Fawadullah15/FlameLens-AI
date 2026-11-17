import React, { useState } from 'react';
import { X, Lock, Key, Shield, User, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [signedInAs, setSignedInAs] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGuestAccess = () => {
    setSignedInAs('Guest Researcher (NASA CIR Level-1)');
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSignedInAs(email);
      setTimeout(() => {
        onClose();
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#07111F]/95 border border-[rgba(120,165,255,0.25)] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(35,112,255,0.3)] p-6 overflow-hidden">
        {/* Background cosmic glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#1769FF]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(120,165,255,0.15)] mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-[#1769FF]/20 border border-[#2F82FF]/40 flex items-center justify-center">
              <img src="/nasa-logo.svg" alt="NASA" className="w-5 h-5 object-contain" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Researcher Sign In</h3>
              <p className="text-[11px] font-mono text-[#78869C]">NASA Launchpad & FlameLens SSO</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#78869C] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {signedInAs ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#2F82FF] mx-auto animate-bounce" />
            <h4 className="text-base font-medium text-white">Authenticated Successfully</h4>
            <p className="text-xs text-[#94A3B8]">Connected as: {signedInAs}</p>
          </div>
        ) : (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                NASA Institutional Email or Investigator ID
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="investigator@nasa.gov"
                  className="w-full bg-[#0E1A2E] border border-[rgba(120,165,255,0.22)] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#2F82FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                Gemini API Key or Token (Optional)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-[#0E1A2E] border border-[rgba(120,165,255,0.22)] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#2F82FF]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#1769FF] hover:bg-[#2F82FF] text-white text-sm font-medium transition-all shadow-[0_0_20px_rgba(47,130,255,0.5)] flex items-center justify-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>Authenticate Session</span>
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[rgba(120,165,255,0.15)]" />
              </div>
              <span className="relative px-3 bg-[#07111F] text-[11px] font-mono text-[#64748B] uppercase">
                Or Continue As
              </span>
            </div>

            <button
              type="button"
              onClick={handleGuestAccess}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-medium transition-all flex items-center justify-center space-x-2"
            >
              <User className="w-4 h-4 text-[#69B7FF]" />
              <span>Guest Investigator Access</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 text-[#64748B]" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
