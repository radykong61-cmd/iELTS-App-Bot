import { motion } from 'motion/react';
import { FeedbackResult } from '../types';
import { BarChart3, Star, AlertCircle, TrendingUp, Sparkles, BookOpen, Layers } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

export default function FeedbackDisplay({ feedback }: { feedback: FeedbackResult }) {
  const categories = [
    { key: 'taskResponse', label: 'Task Response', icon: TrendingUp, color: 'bg-indigo-500', text: 'text-indigo-600', light: 'bg-indigo-50' },
    { key: 'coherenceCohesion', label: 'Coherence & Cohesion', icon: Layers, color: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50' },
    { key: 'lexicalResource', label: 'Lexical Resource', icon: Sparkles, color: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-50' },
    { key: 'grammaticalRangeAccuracy', label: 'Grammar', icon: BookOpen, color: 'bg-rose-500', text: 'text-rose-600', light: 'bg-rose-50' },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Overall Score */}
      <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="flex-shrink-0 w-28 h-28 rounded-full border-4 border-blue-500 flex flex-col items-center justify-center bg-blue-50 shadow-inner">
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Overall</span>
          <span className="text-4xl font-black text-blue-700 leading-none">{feedback.overallBand}</span>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-xl font-bold text-slate-800 mb-2">Examiner Analysis</h4>
          <div className="text-slate-500 text-sm leading-relaxed prose prose-slate prose-sm max-w-none">
            <ReactMarkdown>{feedback.overallFeedback}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Grid of criteria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const data = feedback[cat.key as keyof FeedbackResult] as { score: number; feedback: string };
          return (
            <div key={cat.key} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col h-full hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <cat.icon className={cn("w-4 h-4", cat.text)} />
                  <h5 className="font-bold text-slate-700 text-xs uppercase tracking-wider">{cat.label}</h5>
                </div>
                <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-black", cat.text, cat.light, "border-transparent")}>
                  <span>BAND</span>
                  <span>{data.score}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4 space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  <span>Performance Level</span>
                  <span>{Math.round((data.score / 9) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(data.score / 9) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={cn("h-full rounded-full", cat.color)}
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-500 leading-relaxed italic flex-1 prose prose-xs prose-slate max-w-none">
                <ReactMarkdown>{data.feedback}</ReactMarkdown>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
