import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  RefreshCcw, 
  HelpCircle, 
  Layout, 
  Layers, 
  FileEdit,
  Loader2,
  Trash2,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { evaluateEssayPart } from '../services/geminiService';
import { FeedbackResult } from '../types';
import FeedbackDisplay from './FeedbackDisplay';

type EvalMode = 'modular' | 'full';

export default function Evaluator() {
  const [mode, setMode] = useState<EvalMode>('modular');
  const [prompt, setPrompt] = useState('');
  
  // Modular inputs
  const [intro, setIntro] = useState('');
  const [body, setBody] = useState('');
  const [conclusion, setConclusion] = useState('');
  
  // Full input
  const [fullEssay, setFullEssay] = useState('');
  
  const [loading, setLoading] = useState<string | null>(null); // 'introduction', 'body', 'conclusion', 'full'
  const [results, setResults] = useState<{
    introduction?: FeedbackResult;
    body?: FeedbackResult;
    conclusion?: FeedbackResult;
    full?: FeedbackResult;
  }>({});

  const handleEvaluate = async (type: 'introduction' | 'body' | 'conclusion' | 'full') => {
    if (!prompt.trim()) {
      alert("Please enter the essay prompt first.");
      return;
    }

    let content = '';
    if (type === 'introduction') content = intro;
    else if (type === 'body') content = body;
    else if (type === 'conclusion') content = conclusion;
    else if (type === 'full') content = fullEssay;

    if (!content.trim()) {
      alert(`Please enter the ${type} content.`);
      return;
    }

    setLoading(type);
    try {
      const feedback = await evaluateEssayPart(type, content, prompt);
      setResults(prev => ({ ...prev, [type]: feedback }));
    } catch (error) {
      alert("Evaluation failed. Please check your connection and try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleCombineAll = () => {
    const combined = `${intro}\n\n${body}\n\n${conclusion}`.trim();
    if (!combined) return;
    setFullEssay(combined);
    setMode('full');
  };

  const clearResults = (type: keyof typeof results) => {
    setResults(prev => {
      const next = { ...prev };
      delete next[type];
      return next;
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Configuration Header */}
      <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Essay Prompt / Topic</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Paste your IELTS Writing Task 2 prompt here..."
              className="w-full min-h-[80px] p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm text-slate-600 placeholder:text-slate-300"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">Mode:</span>
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setMode('modular')}
                className={cn(
                  "px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2",
                  mode === 'modular' ? "bg-white text-blue-600 shadow-sm border border-slate-200/50" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Layers className="w-3.5 h-3.5" />
                Modular Analysis
              </button>
              <button
                onClick={() => setMode('full')}
                className={cn(
                  "px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2",
                  mode === 'full' ? "bg-white text-blue-600 shadow-sm border border-slate-200/50" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <FileEdit className="w-3.5 h-3.5" />
                Full Submission
              </button>
            </div>
            {mode === 'modular' && (intro || body || conclusion) && (
              <button 
                onClick={handleCombineAll}
                className="ml-auto text-[11px] bg-slate-800 text-white font-bold py-2 px-4 rounded-md hover:bg-slate-900 transition-colors flex items-center gap-2"
              >
                Compile for Review
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Inputs Area */}
      <AnimatePresence mode="wait">
        {mode === 'modular' ? (
          <motion.div
            key="modular"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {[
              { id: 'introduction', label: 'Introduction', value: intro, setter: setIntro, result: results.introduction as FeedbackResult },
              { id: 'body', label: 'Body Paragraphs', value: body, setter: setBody, result: results.body as FeedbackResult },
              { id: 'conclusion', label: 'Conclusion', value: conclusion, setter: setConclusion, result: results.conclusion as FeedbackResult },
            ].map((section) => (
              <div key={section.id} className="space-y-4">
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm group transition-all hover:border-slate-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                        {section.label}
                      </h3>
                      {section.result && (
                        <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100">
                          BAND {section.result.overallBand}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                       {loading === section.id && (
                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin mr-2" />
                      )}
                      {section.result && (
                        <button 
                          onClick={() => clearResults(section.id as any)}
                          className="p-1.5 hover:bg-slate-50 rounded-md transition-colors text-slate-400 hover:text-rose-500"
                        >
                          <RefreshCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        disabled={!!loading || !section.value.trim()}
                        onClick={() => handleEvaluate(section.id as any)}
                        className={cn(
                          "px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 border",
                          section.result 
                            ? "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100" 
                            : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-sm"
                        )}
                      >
                        <Send className="w-3 h-3" />
                        {section.result ? 'Recount' : 'Analyze'}
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={section.value}
                    onChange={(e) => section.setter(e.target.value)}
                    placeholder={`Draft your ${section.label.toLowerCase()}...`}
                    className="w-full min-h-[100px] p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm text-slate-600 font-serif border-l-4 border-l-blue-500/30"
                  />
                </div>
                {section.result && <FeedbackDisplay feedback={section.result} />}
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <FileEdit className="w-4 h-4" />
                  Full Essay Response
                </h3>
                <div className="flex items-center gap-3">
                   {loading === 'full' && (
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  )}
                   {results.full && (
                    <button 
                      onClick={() => clearResults('full')}
                      className="p-1.5 hover:bg-slate-50 rounded-md transition-colors text-slate-400"
                    >
                      <RefreshCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    disabled={!!loading || !fullEssay.trim()}
                    onClick={() => handleEvaluate('full')}
                    className={cn(
                      "px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm",
                      results.full
                        ? "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
                        : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    )}
                  >
                    <Send className="w-3.5 h-3.5" />
                    {results.full ? 'Re-Analyze' : 'Run Full Analysis'}
                  </button>
                </div>
              </div>
              <textarea
                value={fullEssay}
                onChange={(e) => setFullEssay(e.target.value)}
                placeholder="Submit your complete essay for a final band score evaluation..."
                className="w-full min-h-[400px] p-8 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none text-[15px] leading-relaxed font-serif text-slate-700 border-l-8 border-l-blue-600"
              />
            </div>
            {results.full && <FeedbackDisplay feedback={results.full as FeedbackResult} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
