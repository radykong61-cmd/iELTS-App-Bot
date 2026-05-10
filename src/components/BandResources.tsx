import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Info } from 'lucide-react';
import { BAND_EXPLANATIONS } from '../constants';
import { cn } from '../lib/utils';

export default function BandResources() {
  const [selectedBand, setSelectedBand] = useState(BAND_EXPLANATIONS[0].band);
  
  const currentBand = BAND_EXPLANATIONS.find(b => b.band === selectedBand)!;

  const rubricItems = [
    { category: 'Task Response', items: ['Answered all parts of the prompt', 'Presented a clear position', 'Supported ideas with evidence'] },
    { category: 'Coherence & Cohesion', items: ['Organized ideas logically', 'Used linking words correctly', 'Has clear paragraphing'] },
    { category: 'Lexical Resource', items: ['Used a variety of vocabulary', 'Avoided repetitive words', 'Checked for spelling errors'] },
    { category: 'Grammar', items: ['Used a mix of simple & complex sentences', 'Checked for punctuation', 'Minimized grammar mistakes'] },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Band Explanations */}
      <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500" />
          Band Descriptors Explained
        </h3>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {BAND_EXPLANATIONS.map((b) => (
            <button
              key={b.band}
              onClick={() => setSelectedBand(b.band)}
              className={cn(
                "px-5 py-1.5 rounded-md text-xs font-black transition-all border",
                selectedBand === b.band
                  ? "bg-slate-800 text-white border-slate-900 shadow-md"
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
              )}
            >
              Band {b.band}
            </button>
          ))}
        </div>

        <motion.div
          key={selectedBand}
          initial={{ opacity: 0, x: 5 }}
          animate={{ opacity: 1, x: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="col-span-full pb-6 border-b border-slate-100">
            <p className="text-lg font-bold text-slate-800 tracking-tight">{currentBand.description}</p>
          </div>
          
          {Object.entries(currentBand.criteria).map(([key, value]) => (
            <div key={key} className="space-y-2 bg-slate-50/50 p-4 rounded-lg border border-slate-100">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              <p className="text-slate-600 text-[13px] leading-relaxed">{value}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Self-Assessment Rubric */}
      <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Candidate Self-Check Rubric
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {rubricItems.map((group) => (
            <div key={group.category} className="space-y-4">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-600 rounded-full" />
                {group.category}
              </h4>
              <div className="space-y-3">
                {group.items.map((item, i) => (
                  <label key={i} className="flex items-start gap-3 group cursor-pointer">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input type="checkbox" className="peer h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all" />
                    </div>
                    <span className="text-[13px] text-slate-600 group-hover:text-slate-900 transition-colors">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
