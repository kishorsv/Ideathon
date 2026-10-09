import React from 'react';
import { Shield, Phone, MapPin, Mail, Globe, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-[#05080D] border-t border-slate-800/80 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#168BCE] to-[#46C5F5] p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#071321] rounded-[10px] flex items-center justify-center">
                  <Shield className="w-4 h-4 text-[#46C5F5]" />
                </div>
              </div>
              <span className="font-bold text-lg text-white font-sans">
                Mysuru EM <span className="text-[#46C5F5]">AI Studio</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Next-generation assistive AI emergency management platform balancing clinical readiness, 
              live ICU capacity, and 108 ambulance telematics across Mysuru district.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#168BCE]" />
                <span>District EOC, Mysuru Urban Development Complex, Mysuru, KA</span>
              </p>
            </div>
          </div>

          {/* Quick Helplines */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Mysuru Helplines
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-300">National Emergency</span>
                <span className="font-mono text-cyan-400 font-bold">112</span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-300">Arogya Kavacha</span>
                <span className="font-mono text-emerald-400 font-bold">108</span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-300">Disaster Helpline</span>
                <span className="font-mono text-amber-400 font-bold">1077</span>
              </li>
              <li className="flex items-center justify-between py-1">
                <span className="text-slate-300">Women Helpline</span>
                <span className="font-mono text-rose-400 font-bold">1091</span>
              </li>
            </ul>
          </div>

          {/* Connected Hospitals */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Connected ERs
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>K.R. Hospital (Govt MMC&RI)</li>
              <li>JSS Hospital & Medical College</li>
              <li>Apollo BGS Hospitals Kuvempunagar</li>
              <li>Manipal Hospital Mysuru (Hebbal)</li>
              <li>Cauvery Heart & Multi-Speciality</li>
              <li>Mission Hospital Mysuru</li>
            </ul>
          </div>

          {/* System & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Platform & Legal
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#features" className="hover:text-white transition-colors">Platform Capabilities</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">Operational Protocols</a></li>
              <li><span className="hover:text-white cursor-pointer">Privacy & HIPAA/DISHA Standard</span></li>
              <li><span className="hover:text-white cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-white cursor-pointer">Audit Logs & Governance</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Mysuru EM AI Studio. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Powered by Assistive AI for Mysuru District Emergency Response</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
