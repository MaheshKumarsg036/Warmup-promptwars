import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Mic, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Navigation, 
  Hospital, 
  Trash2, 
  Cpu,
  ChevronRight,
  BrainCircuit,
  Maximize2
} from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const Dashboard: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [textInput, setTextInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const handleDispatch = async () => {
        if (!textInput && images.length === 0) return;
        setIsProcessing(true);
        setError(null);
        
        const formData = new FormData();
        formData.append('text', textInput);
        images.forEach(img => formData.append('images', img));
        
        try {
            const response = await axios.post(`${API_BASE}/api/dispatch`, formData);
            setResult(response.data);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Gemini processing failed. Check connection.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/30">
            {/* Background Grid & Glow */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10 opacity-20" />
            
            <Header />

            <main className="max-w-[1600px] mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-[1fr_2px_1fr] gap-0 min-h-[calc(100vh-120px)]">
                
                {/* LEFT PANEL: Chaos Mode */}
                <section className="p-6 md:p-10 flex flex-col gap-8">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest">
                            <AlertTriangle size={12} /> Live Emergency Chaos
                        </div>
                        <h2 className="text-4xl font-extrabold tracking-tight">Messy Human Input</h2>
                        <p className="text-slate-400 text-sm max-w-sm">Capture frantic audio, blurry photos, and panicky messages to bridge the gap.</p>
                    </div>

                    <div className="flex-1 flex flex-col gap-6">
                        {/* File Upload Area */}
                        <div 
                            className="relative group cursor-pointer aspect-video rounded-3xl border-2 border-dashed border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 hover:border-red-500/40 transition-all flex flex-col items-center justify-center p-8 overflow-hidden"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple hidden accept="image/*" />
                            
                            {images.length === 0 ? (
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-red-500/10 group-hover:text-red-500 transition-colors">
                                        <Plus size={32} />
                                    </div>
                                    <p className="text-slate-400 font-medium">Add Blurry Photos <br/><span className="text-xs opacity-50 font-normal">(Drag & Drop or Click)</span></p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-3 w-full animate-in fade-in zoom-in duration-300">
                                    {images.map((img, i) => (
                                        <div key={i} className="aspect-square relative rounded-xl overflow-hidden group/img shadow-2xl">
                                            <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt="" />
                                            <div className="absolute inset-0 bg-red-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                <AlertTriangle className="text-white" size={20} />
                                            </div>
                                        </div>
                                    ))}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setImages([]) }} 
                                        className="bg-black/60 backdrop-blur-md text-white p-2 rounded-full absolute top-4 right-4 hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Text & Mic Input */}
                        <div className="space-y-4">
                            <div className="flex gap-4 items-center">
                                <div className="flex-1 relative">
                                    <textarea 
                                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500 outline-none transition-all resize-none min-h-[120px] shadow-inner"
                                        placeholder="Brief us: 'Severe multiple-car pileup, possible casualties...'"
                                        value={textInput}
                                        onChange={(e) => setTextInput(e.target.value)}
                                    />
                                    <div className="absolute bottom-4 right-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">Chaos Buffer</div>
                                </div>
                                
                                <button 
                                    onClick={() => setIsRecording(!isRecording)} 
                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                >
                                    <Mic size={24} />
                                </button>
                            </div>

                            <button 
                                disabled={isProcessing || (images.length === 0 && !textInput)}
                                onClick={handleDispatch}
                                className="w-full bg-white text-slate-950 hover:bg-red-50 hover:text-red-600 font-bold py-5 rounded-2xl shadow-xl hover:shadow-red-500/20 active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-3 uppercase tracking-tighter text-lg"
                            >
                                {isProcessing ? (
                                    <>
                                        <Cpu className="animate-spin" size={20} /> Bridge Active...
                                    </>
                                ) : (
                                    <>
                                        Synthesize Clarity <ChevronRight size={20} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </section>

                {/* VISUAL DIVIDER / BRIDGE */}
                <div className="hidden lg:flex flex-col items-center justify-center relative">
                    <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-slate-800 to-transparent" />
                    <div className={`absolute w-16 h-16 rounded-full border border-slate-800 bg-[#020617] flex items-center justify-center transition-all duration-700 ${isProcessing ? 'border-cyan-500 scale-125 shadow-[0_0_40px_rgba(6,182,212,0.5)]' : 'scale-100 opacity-20'}`}>
                        <BrainCircuit className={`${isProcessing ? 'text-cyan-400 rotate-180 animate-pulse' : 'text-slate-400'} transition-all`} size={32} />
                    </div>
                </div>

                {/* RIGHT PANEL: Clarity Mode */}
                <section className="p-6 md:p-10 flex flex-col gap-8">
                    <div className="space-y-2 lg:text-right flex flex-col items-start lg:items-end">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] font-bold uppercase tracking-widest">
                            <CheckCircle2 size={12} /> Actionable Clarity
                        </div>
                        <h2 className="text-4xl font-extrabold tracking-tight">Structured Output</h2>
                        <p className="text-slate-400 text-sm max-w-sm text-left lg:text-right">Gemini 1.5 Pro instantly structuralizes the chaos into critical mission-ready data.</p>
                    </div>

                    <div className="flex-1 flex flex-col gap-6">
                        <AnimatePresence mode="wait">
                            {!result ? (
                                <div className="flex-1 flex flex-col items-center justify-center border-2 border-slate-900 bg-slate-950/20 rounded-3xl opacity-40 select-none space-y-4">
                                    <div className="w-20 h-20 rounded-full border border-dashed border-slate-800 flex items-center justify-center">
                                        <Activity size={32} />
                                    </div>
                                    <p className="text-xs uppercase tracking-widest font-bold">Awaiting Data Core Injection</p>
                                </div>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex-1 flex flex-col gap-6"
                                >
                                    {/* Action Cards */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4">
                                            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                                                <Navigation size={14} /> Global Route
                                            </div>
                                            <div className="text-2xl font-black text-white">{result.action_plan.recommended_er ? result.action_plan.recommended_er.split('_').pop() : 'GPS_42'}</div>
                                            <div className="text-[10px] text-slate-500 uppercase">Optimal Arrival: 4m 20s</div>
                                        </div>
                                        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4">
                                            <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider">
                                                <AlertTriangle size={14} /> Severity
                                            </div>
                                            <div className={`text-2xl font-black ${result.visual_analysis.severity === 'CRITICAL' ? 'text-red-500' : 'text-amber-500'}`}>
                                                {result.visual_analysis.severity}
                                            </div>
                                            <div className="text-[10px] text-slate-500 uppercase">Immediate Action Required</div>
                                        </div>
                                    </div>

                                    {/* Medical Transcript */}
                                    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-4 overflow-y-auto max-h-[250px] shadow-2xl">
                                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">Mission Payload</div>
                                            <Maximize2 size={12} className="text-slate-600" />
                                        </div>
                                        <pre className="text-sm font-mono text-cyan-400 leading-relaxed whitespace-pre-wrap">
                                            {JSON.stringify(result, null, 2)}
                                        </pre>
                                    </div>

                                    <div className="mt-auto flex gap-4">
                                        <button className="flex-1 py-4 px-6 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm transition-all border border-slate-700">
                                            <Hospital size={18} /> Update ER
                                        </button>
                                        <button className="flex-1 py-4 px-6 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 text-sm transition-all shadow-lg shadow-cyan-900/20">
                                            <Send size={18} /> Push Dispatch
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>
                
            </main>

            {/* Error Toast */}
            <AnimatePresence>
                {error && (
                    <motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-4 bg-red-600 text-white rounded-2xl shadow-2xl font-bold z-50 overflow-hidden"
                    >
                        <AlertTriangle size={18} />
                        <span className="text-sm">{error}</span>
                        <div className="absolute bottom-0 left-0 h-1 bg-red-800 animate-shrink" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Header = () => (
    <header className="px-8 py-6 max-w-[1600px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/5">
                <BrainCircuit className="text-slate-950" size={24} />
            </div>
            <div>
                <h1 className="text-xl font-black uppercase tracking-tighter">Gemini Dispatch <span className="text-slate-500 font-light">OS</span></h1>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Uplink Active: Bangalore Hub</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">Processing Latency</div>
                <div className="text-sm font-mono text-cyan-500 font-bold tracking-tighter">0.14s</div>
            </div>
            <div className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer">
                <Activity size={20} />
            </div>
        </div>
    </header>
);

export default Dashboard;
