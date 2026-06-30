import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export default function App() {
  const [openFaq, setOpenFaq] = useState(null);

  // 📝 Newsletter Connections
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // 🔐 Auth Modal Popups & Session States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authStatus, setAuthStatus] = useState('');
  const [authError, setAuthError] = useState(false);

  // 🖥️ Enterprise-Grade State: Global Authentication Check
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  // 📡 Real-Time Sockets Logging State
  const [liveEvents, setLiveEvents] = useState([
    { text: "Security network logging pipeline initializing...", meta: "system-core", time: "Just now", type: "info" }
  ]);

  // 🧮 Interactive Encryption Engine States
  const [rawText, setRawText] = useState('');
  const [encryptedOutput, setEncryptedOutput] = useState('');
  const [generatedApiKey, setGeneratedApiKey] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  // 🔄 Check if user is already logged in (Session Persistence)
  useEffect(() => {
    const token = localStorage.getItem('archi_token');
    const savedUser = localStorage.getItem('archi_user');
    if (token && savedUser) {
      setIsLoggedIn(true);
      setCurrentUser(savedUser);
    }
  }, []);

  // 🔌 Sockets Listener Hook
  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('new-security-log', (newLog) => {
      setLiveEvents((prevLogs) => {
        return [newLog, ...prevLogs].slice(0, 5); // Max 5 logs in dashboard
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 📬 Newsletter Submit
  const handleSubscribe = async (e) => {
    e.preventDefault();
    setStatusMessage('');
    setIsError(false);

    if (!email) {
      setIsError(true);
      setStatusMessage('Please enter a valid email address.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/v1/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatusMessage('Subscribed successfully into MongoDB! 🚀');
        setEmail('');
      } else {
        setIsError(true);
        setStatusMessage(data.error || 'Something went wrong.');
      }
    } catch (error) {
      setIsError(true);
      setStatusMessage('Cannot connect to backend server. Is it running?');
    }
  };

  // 🔐 Signup aur Login Handler
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthStatus('');
    setAuthError(false);

    const endpoint = authMode === 'login' ? 'login' : 'signup';

    try {
      const response = await fetch(`http://localhost:5000/api/v1/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthStatus(data.message);
        if (authMode === 'login' && data.token) {
          localStorage.setItem('archi_token', data.token);
          localStorage.setItem('archi_user', authEmail);
          
          setTimeout(() => {
            setIsLoggedIn(true);
            setCurrentUser(authEmail);
            setIsAuthOpen(false);
            setAuthStatus('');
          }, 1500);
        } else {
          setTimeout(() => {
            setAuthMode('login');
            setAuthStatus('');
          }, 1500);
        }
        setAuthEmail('');
        setAuthPassword('');
      } else {
        setAuthError(true);
        setAuthStatus(data.error || 'Authentication failed.');
      }
    } catch (error) {
      setAuthError(true);
      setAuthStatus('Server connection failed.');
    }
  };

  // 🚪 Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('archi_token');
    localStorage.removeItem('archi_user');
    setIsLoggedIn(false);
    setCurrentUser('');
  };

  // ⚡ Live Cryptographic Action Simulator
  const executeLocalEncryption = (text) => {
    setRawText(text);
    if (!text) {
      setEncryptedOutput('');
      return;
    }
    // Pure Base64 simulation simulating standard cipher streams
    const b64 = btoa(text);
    setEncryptedOutput(`archi_aes256_${b64.reverse ? b64.reverse() : b64.split('').reverse().join('')}__validated`);
  };

  // 🔑 SaaS API Key Generator
  const generateSaaSKey = () => {
    const randomHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setGeneratedApiKey(`sk_live_archi_${randomHex}`);
  };

  // 🎯 Manual Network Attack Simulation Trigger
  const triggerAttackSimulation = () => {
    setIsSimulating(true);
    const mockLogs = [
      { text: "Manual simulation trace injected by administrator.", meta: "sandbox-env", time: "Just now", type: "info" },
      { text: "Cross-Site Scripting (XSS) vector intercepted.", meta: "waf-block", time: "Just now", type: "danger" },
      { text: "Gateway node rotated cipher protocols safely.", meta: "vault-core", time: "Just now", type: "success" }
    ];
    
    mockLogs.forEach((log, index) => {
      setTimeout(() => {
        setLiveEvents((prev) => [log, ...prev].slice(0, 5));
        if (index === mockLogs.length - 1) setIsSimulating(false);
      }, (index + 1) * 800);
    });
  };

  const features = [
    { title: "Adaptive Encryption Engine", desc: "Dynamically selects the optimal cipher suite for each workload — AES-256-GCM, ChaCha20-Poly1305, or RSA-OAEP.", icon: "🔒" },
    { title: "Automated Key Rotation", desc: "Cryptographic keys rotate on a configurable schedule with zero downtime. All rotation events are cryptographically audited.", icon: "🔑" },
    { title: "Compliance Automation", desc: "Maintain continuous HIPAA, SOC 2, GDPR, and PCI-DSS compliance with automated policy enforcement.", icon: "🛡️" }
  ];

  const comparisons = [
    { feature: "AES-256-GCM Encryption", archi: true, others: false },
    { feature: "Automated Key Rotation", archi: true, others: false },
    { feature: "Zero-Knowledge Architecture", archi: true, others: true },
    { feature: "Real-time Audit Logs", archi: true, others: true },
    { feature: "Sub-millisecond Latency", archi: true, others: false }
  ];

  const faqs = [
    { q: "What encryption standards does ARCHI.AI use?", a: "ARCHI.AI uses FIPS 140-3 validated cryptographic modules including AES-256-GCM for symmetric encryption, RSA-4096 and ECC P-384 for asymmetric operations, and ChaCha20-Poly1305 for high-performance mobile contexts." },
    { q: "How does zero-knowledge architecture work?", a: "Our zero-knowledge architecture ensures that encryption keys are generated and held strictly on your client instances. ARCHI.AI infrastructure handles data routing without ever having access to the raw key material." }
  ];

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#070510] text-slate-100 font-sans antialiased flex flex-col md:flex-row">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-[#0b0813] border-r border-purple-950/40 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-10">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg">Ω</div>
              <span className="text-xl font-black tracking-tight text-white">ARCHI.<span className="text-purple-400">AI</span></span>
            </div>
            
            <nav className="space-y-2">
              <div className="px-4 py-2.5 rounded-xl bg-purple-600/10 text-purple-400 font-bold text-xs flex items-center gap-2 border border-purple-500/20">
                <span>📊</span> Security Center
              </div>
              <div className="px-4 py-2.5 rounded-xl text-slate-400 hover:bg-slate-900 font-semibold text-xs transition cursor-not-allowed flex items-center gap-2">
                <span>🔑</span> IAM Keys <span className="text-[9px] bg-purple-950 px-1.5 py-0.5 rounded text-purple-400 uppercase ml-auto">Pro</span>
              </div>
              <div className="px-4 py-2.5 rounded-xl text-slate-400 hover:bg-slate-900 font-semibold text-xs transition cursor-not-allowed flex items-center gap-2">
                <span>🛡️</span> Compliance Check
              </div>
            </nav>
          </div>

          {/* User Section & Logout */}
          <div className="border-t border-purple-950/40 pt-4 mt-6">
            <div className="text-[10px] text-slate-500 font-mono truncate mb-2">Operator: {currentUser}</div>
            <button onClick={handleLogout} className="w-full py-2 bg-red-950/30 border border-red-900/30 text-red-400 font-bold text-xs rounded-xl hover:bg-red-900/20 transition flex items-center justify-center gap-1.5">
              <span>🚪</span> Terminate Session
            </button>
          </div>
        </aside>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full relative overflow-y-auto">
          {/* Top Info Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-purple-950/20 pb-6 mb-8">
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">Security Analytics Hub</h1>
              <p className="text-xs text-slate-400 mt-1">Continuous zero-knowledge telemetry stream from local gateway nodes.</p>
            </div>
            <div className="flex gap-2 text-[11px] font-mono bg-[#110d24] border border-purple-950/50 p-2 rounded-xl text-slate-400">
              <span className="text-purple-400 font-bold">Status:</span> SECURE PIPELINE ACTIVE
            </div>
          </div>

          {/* Grid Cards (Metrics) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="p-5 bg-[#110d24]/60 rounded-2xl border border-purple-950/40 backdrop-blur-xl">
              <span className="text-xs text-slate-400 font-medium block mb-1">Active Symmetric Keys</span>
              <div className="flex items-baseline gap-2"><span className="text-2xl font-black text-white">12,847</span><span className="text-xs text-emerald-400 font-bold">+4.2%</span></div>
            </div>
            <div className="p-5 bg-[#110d24]/60 rounded-2xl border border-purple-950/40 backdrop-blur-xl">
              <span className="text-xs text-slate-400 font-medium block mb-1">Decryption Latency</span>
              <div className="flex items-baseline gap-2"><span className="text-2xl font-black text-white">0.34ms</span><span className="text-xs text-purple-400 font-medium">Optimal</span></div>
            </div>
            <div className="p-5 bg-[#110d24]/60 rounded-2xl border border-purple-950/40 backdrop-blur-xl">
              <span className="text-xs text-slate-400 font-medium block mb-1">Active Sockets Firewalls</span>
              <div className="flex items-baseline gap-2"><span className="text-2xl font-black text-white">PORT 5000</span><span className="text-xs text-emerald-400 font-bold ml-1 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>CONNECTED</span></div>
            </div>
          </div>

          {/* ==========================================
              🛠️ NEW BLOCK: INTERACTIVE SECURITY TOOLKIT
             ========================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* 🔒 Encryption Generator Terminal */}
            <div className="p-6 bg-[#0b0813] border border-purple-900/20 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black uppercase text-purple-400 tracking-wider mb-2 flex items-center gap-2">
                  <span>🔒</span> Adaptive Cryptographic Engine
                </h3>
                <p className="text-[11px] text-slate-400 mb-4">Input raw configuration files or strings to compute live secure AES standard block arrays.</p>
                <input 
                  type="text" 
                  value={rawText}
                  onChange={(e) => executeLocalEncryption(e.target.value)}
                  placeholder="Enter raw secret payload node data..." 
                  className="w-full px-3 py-2 bg-[#070510] border border-purple-950 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-purple-500/50 mb-4 font-mono"
                />
                <div className="bg-[#070510] p-3 rounded-xl border border-purple-950/60 font-mono text-[11px] break-all min-h-[50px] flex items-center text-slate-300">
                  {encryptedOutput ? (
                    <span className="text-emerald-400 font-medium">{encryptedOutput}</span>
                  ) : (
                    <span className="text-slate-600">Waiting for payload injection sequence...</span>
                  )}
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-mono mt-4">Protocol Status: AES-256-GCM Array Enabled</p>
            </div>

            {/* 🔑 SaaS Infrastructure Configurator */}
            <div className="p-6 bg-[#0b0813] border border-purple-900/20 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black uppercase text-purple-400 tracking-wider mb-2 flex items-center gap-2">
                  <span>⚙️</span> Enterprise Service Integrations
                </h3>
                <p className="text-[11px] text-slate-400 mb-4">Provision automated client credentials and invoke pipeline security tests manually inside the virtual sandbox context.</p>
                
                <div className="flex gap-2 mb-4">
                  <button 
                    onClick={generateSaaSKey}
                    className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition shadow-md"
                  >
                    Generate API Token
                  </button>
                  <button 
                    onClick={triggerAttackSimulation}
                    disabled={isSimulating}
                    className={`flex-1 py-2 font-bold text-xs rounded-xl transition border ${isSimulating ? 'bg-slate-900 text-slate-600 border-slate-950' : 'bg-red-950/40 text-red-400 border-red-900/30 hover:bg-red-900/20'}`}
                  >
                    {isSimulating ? 'Simulating Logs...' : 'Simulate Vector Attack'}
                  </button>
                </div>

                {generatedApiKey && (
                  <div className="bg-[#070510] p-3 rounded-xl border border-purple-950/60 font-mono text-[11px] text-center text-purple-300 select-all cursor-pointer">
                    {generatedApiKey}
                  </div>
                )}
              </div>
              <p className="text-[10px] text-slate-500 font-mono mt-4">SaaS Provisioner Node: Integrated Successfully</p>
            </div>

          </div>

          {/* 📡 LIVE SOCKET.IO TELEMETRY STREAM PANEL */}
          <div className="bg-[#0b0813] border border-purple-900/30 rounded-2xl p-6 font-mono text-xs shadow-2xl">
            <div className="flex justify-between items-center text-slate-500 border-b border-purple-950/50 pb-4 mb-4">
              <span className="font-bold uppercase text-[10px] text-purple-400 tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse shadow-md shadow-purple-500"></span>
                Live Enterprise Core Threat Feed
              </span>
              <span className="text-[10px] text-slate-500">Gateway Pipeline Stream</span>
            </div>
            <div className="space-y-3">
              {liveEvents.map((e, index) => (
                <div key={index} className="flex justify-between items-center bg-[#110d24]/40 p-3 rounded-xl border border-purple-950/20 transition-all duration-300 hover:border-purple-500/20 animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${e.type === 'danger' ? 'bg-red-500 shadow-md shadow-red-500' : e.type === 'success' ? 'bg-emerald-400 shadow-md shadow-emerald-400' : 'bg-indigo-400'}`}></span>
                    <span className="text-slate-200 font-medium text-xs">{e.text}</span>
                    <span className="text-[9px] bg-purple-950/70 px-2 py-0.5 rounded text-purple-300 font-sans font-bold uppercase">{e.meta}</span>
                  </div>
                  <span className="text-slate-500 text-xs font-sans">{e.time}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 🌐 PUBLIC LANDING PAGE VIEW (LOGGED OUT)
  return (
    <div className="min-h-screen bg-[#0b0813] text-slate-100 font-sans antialiased selection:bg-purple-500/30 overflow-x-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-purple-900/20 via-indigo-950/10 to-transparent blur-[120px] pointer-events-none"></div>

      <header className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center border-b border-purple-950/30 backdrop-blur-md relative z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg">Ω</div>
          <span className="text-xl font-black tracking-tight text-white">ARCHI.<span className="text-purple-400">AI</span></span>
        </div>
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-purple-400 transition">Solutions</a>
          <a href="#comparison" className="hover:text-purple-400 transition">Platform</a>
          <a href="#pricing" className="hover:text-purple-400 transition">Pricing</a>
        </nav>
        <div className="flex items-center gap-4">
          <button onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }} className="text-sm font-semibold text-slate-300 hover:text-white transition">Log in</button>
          <button onClick={() => { setAuthMode('signup'); setIsAuthOpen(true); }} className="px-4 py-2 text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition shadow-md shadow-purple-600/20">Encrypt Now</button>
        </div>
      </header>

      <section className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center z-10">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-6 tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
          Next-Generation Cybersecurity Platform
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Intelligent Encryption <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-200">for Modern Businesses.</span>
        </h1>
        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          ARCHI.AI delivers enterprise-grade encryption infrastructure that protects your data, secures your systems, and ensures compliance — without slowing you down.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <button onClick={() => { setAuthMode('signup'); setIsAuthOpen(true); }} className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition shadow-lg shadow-purple-600/30 text-xs">Encrypt Your Platform →</button>
          <button onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }} className="px-6 py-3 bg-slate-900/80 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold rounded-xl transition text-xs flex items-center justify-center gap-2">
            <span>▶</span> Watch Demo
          </button>
        </div>

        <div className="border-t border-b border-purple-950/40 py-6 mb-20">
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-4 font-bold">Trusted by Security Teams At</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-xs font-bold text-slate-500">
            <span>Cloudflare</span>
            <span>HashiCorp</span>
            <span>Datadog</span>
            <span>Vercel</span>
            <span>Stripe</span>
            <span>GitHub</span>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-purple-950/20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wider">Security Protocols</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-4 mb-4">AI Solutions That Turn Your Security into Advantage.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {features.map((f, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[#110d24]/30 border border-purple-950/30 hover:border-purple-500/20 transition">
              <div className="w-10 h-10 rounded-xl bg-[#171231] border border-purple-950/50 flex items-center justify-center text-lg mb-6">{f.icon}</div>
              <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="comparison" className="max-w-4xl mx-auto px-6 py-16 border-t border-purple-950/20">
        <div className="text-center mb-12">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wider">Competitive Edge</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-4">The Best Encryption Platform at the Right Price.</h2>
        </div>
        
        <div className="overflow-x-auto bg-[#110d24]/40 border border-purple-950/40 rounded-xl backdrop-blur-md">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-purple-950/60 text-xs font-bold text-slate-400 uppercase bg-[#171231]/40">
                <th className="p-4 pl-6">Feature Details</th>
                <th className="p-4 text-purple-400 font-black">ARCHI.AI</th>
                <th className="p-4">Others</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-purple-950/30 text-slate-300">
              {comparisons.map((c, i) => (
                <tr key={i} className="hover:bg-purple-950/10 transition">
                  <td className="p-4 pl-6 font-medium text-slate-200">{c.feature}</td>
                  <td className="p-4 text-emerald-400 font-bold text-sm pl-7">{c.archi ? "✓" : "✕"}</td>
                  <td className="p-4 text-slate-600 text-sm pl-6">{c.others ? "✓" : "✕"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="pricing" className="max-w-5xl mx-auto px-6 py-20 border-t border-purple-950/20">
        <div className="text-center mb-16">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wider">Pricing Plans</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-4">Automated Encryption For Any Size.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-8">
          <div className="p-6 rounded-2xl bg-[#110d24]/40 border border-purple-950/40 flex flex-col justify-between backdrop-blur-sm">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/10 text-purple-400">Starter</span>
              <div className="my-4 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">$49</span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 border-t border-purple-950/30 pt-6">
                <li><span className="text-purple-400 font-bold mr-2">✓</span> Up to 1M encrypted records</li>
                <li><span className="text-purple-400 font-bold mr-2">✓</span> AES-256-GCM Encryption</li>
              </ul>
            </div>
            <button onClick={() => { setAuthMode('signup'); setIsAuthOpen(true); }} className="mt-8 w-full py-2.5 bg-slate-900 border border-slate-800 text-slate-200 font-bold rounded-xl text-xs hover:bg-slate-800 transition">Start Free Trial</button>
          </div>

          <div className="p-6 rounded-2xl bg-[#171231]/50 border-2 border-purple-500/60 flex flex-col justify-between relative shadow-xl shadow-purple-500/5">
            <div className="absolute -top-3 right-6 px-2 py-0.5 rounded-full bg-purple-500 text-[8px] font-black uppercase text-white">Most Popular</div>
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500 text-white">Growth</span>
              <div className="my-4 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">$199</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-200 border-t border-purple-500/20 pt-6">
                <li><span className="text-purple-400 font-bold mr-2">✓</span> Up to 50M encrypted records</li>
                <li><span className="text-purple-400 font-bold mr-2">✓</span> Full cipher suite access config</li>
              </ul>
            </div>
            <button onClick={() => { setAuthMode('signup'); setIsAuthOpen(true); }} className="mt-8 w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition">Encrypt Your Platform</button>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 border-t border-purple-950/20">
        <div className="text-center mb-12">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wider">FAQ</span>
          <h2 className="text-2xl font-extrabold text-white mt-3">We've Got the Answers You're Looking For.</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-purple-950/40 bg-[#110d24]/20 rounded-xl overflow-hidden transition">
              <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full p-4 text-left text-xs font-bold text-slate-200 hover:text-white flex justify-between items-center bg-[#110d24]/40">
                <span>{faq.q}</span>
                <span className="text-purple-400 text-sm transition-transform duration-200" style={{ transform: openFaq === index ? 'rotate(45deg)' : 'rotate(0deg)' }}>＋</span>
              </button>
              {openFaq === index && <div className="p-4 text-xs text-slate-400 border-t border-purple-950/20 bg-[#070510]/30 leading-relaxed">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      <footer className="max-w-7xl mx-auto px-6 pt-16 pb-8 border-t border-purple-950/20 text-xs text-slate-500 relative z-50">
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-purple-950/20 pb-10 mb-10">
          <div>
            <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Security Digest</h4>
            <p className="text-[10px] text-slate-500 mt-1">Stay ahead of cyber threats.</p>
          </div>
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <div className="flex gap-2 w-full sm:w-auto">
              <input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="px-3 py-1.5 bg-[#070510] border border-purple-950/60 rounded-lg text-slate-300 text-xs focus:outline-none focus:border-purple-500/50 w-full sm:w-52" />
              <button type="submit" className="px-4 py-1.5 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition text-xs">Subscribe</button>
            </div>
            {statusMessage && <p className={`text-[10px] mt-1 font-medium ${isError ? 'text-red-400' : 'text-emerald-400'}`}>{statusMessage}</p>}
          </div>
        </form>
        <p className="text-[10px] text-center">© 2026 ARCHI Technologies Inc. All rights reserved.</p>
      </footer>

      {isAuthOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="w-full max-w-sm bg-[#110d24] border border-purple-500/30 rounded-2xl p-6 relative shadow-2xl">
            <button onClick={() => setIsAuthOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-sm">✕</button>
            <h3 className="text-lg font-black text-white text-center mb-1 uppercase tracking-tight">
              {authMode === 'login' ? 'Access Dashboard' : 'Create Secure ID'}
            </h3>
            <p className="text-[11px] text-slate-400 text-center mb-6">
              {authMode === 'login' ? 'Enter credentials connected to ARCHI.AI pipeline.' : 'Register a new profile directly into local MongoDB.'}
            </p>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Email Node Address</label>
                <input type="email" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="name@company.com" className="w-full px-3 py-2 bg-[#070510] border border-purple-950 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Cryptographic Password</label>
                <input type="password" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 bg-[#070510] border border-purple-950 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-purple-500/50" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition">
                {authMode === 'login' ? 'Initialize Safe Login' : 'Deploy Secure Account'}
              </button>
            </form>
            {authStatus && <p className={`text-[11px] text-center mt-4 font-semibold ${authError ? 'text-red-400' : 'text-emerald-400'}`}>{authStatus}</p>}
            <div className="mt-6 pt-4 border-t border-purple-950/60 text-center text-[11px] text-slate-400">
              {authMode === 'login' ? (
                <p>New operator? <span onClick={() => { setAuthMode('signup'); setAuthStatus(''); }} className="text-purple-400 hover:underline cursor-pointer font-medium">Create credentials</span></p>
              ) : (
                <p>Existing key? <span onClick={() => { setAuthMode('login'); setAuthStatus(''); }} className="text-purple-400 hover:underline cursor-pointer font-medium">Log in here</span></p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}