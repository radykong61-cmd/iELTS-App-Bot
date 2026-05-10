import { SAMPLE_ESSAYS } from '../constants';
import { BookOpen, Star, MessageSquare } from 'lucide-react';

export default function SampleEssays() {
  return (
    <div className="space-y-6 pb-12">
      {SAMPLE_ESSAYS.map((sample) => (
        <div key={sample.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h4 className="font-bold text-slate-800 tracking-tight">{sample.title}</h4>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md border border-blue-700 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-white" />
              <span className="text-[11px] font-black uppercase">BAND {sample.band}</span>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="bg-blue-50 border-l-4 border-l-blue-500 p-4 rounded-r-lg">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Examiner Prompt:</p>
              <p className="text-sm font-medium text-slate-700 leading-relaxed italic">"{sample.prompt}"</p>
            </div>

            <div className="space-y-3">
              <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5" />
                Sample Content
              </h5>
              <div className="text-[14px] text-slate-600 leading-relaxed whitespace-pre-wrap font-serif bg-slate-50/50 p-6 rounded-lg border border-slate-100">
                {sample.essay}
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="text-[11px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5" />
                Annotation / Commentary
              </h5>
              <div className="bg-emerald-50/30 p-4 rounded-lg border border-emerald-50 text-[13px] text-slate-600 leading-relaxed italic border-l-2 border-emerald-400">
                {sample.feedback}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
