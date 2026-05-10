import { COMMON_ERRORS } from '../constants';
import { AlertCircle, HelpCircle } from 'lucide-react';

export default function CommonErrors() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
      {COMMON_ERRORS.map((error, index) => (
        <div key={index} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 bg-rose-50 text-rose-700 text-[10px] font-black uppercase tracking-widest rounded border border-rose-100">
              {error.category}
            </span>
          </div>
          
          <h4 className="text-base font-bold text-slate-800 mb-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 mt-1 shrink-0" />
            {error.error}
          </h4>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-rose-500">Band Score Impact:</p>
            <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-rose-500 pl-3">{error.bandImpact}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-4 flex-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">How to address:</p>
            <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-blue-500 pl-3">{error.correction}</p>
          </div>

          <div className="flex items-start gap-2 text-slate-500 bg-blue-50/30 p-4 rounded-lg border border-blue-50/50">
            <HelpCircle className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
            <p className="text-[11px] leading-relaxed italic">{error.explanation}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
