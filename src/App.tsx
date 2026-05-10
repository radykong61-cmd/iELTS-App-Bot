/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  BarChart3, 
  BookOpen, 
  AlertCircle, 
  CheckCircle2,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { cn } from './lib/utils';
import Evaluator from './components/Evaluator';
import BandResources from './components/BandResources';
import CommonErrors from './components/CommonErrors';
import SampleEssays from './components/SampleEssays';

type Tab = 'evaluator' | 'resources' | 'errors' | 'samples';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('evaluator');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = [
    { id: 'evaluator', label: 'Essay Evaluator', icon: FileText },
    { id: 'resources', label: 'Band & Rubric', icon: BarChart3 },
    { id: 'errors', label: 'Common Errors', icon: AlertCircle },
    { id: 'samples', label: 'Sample Essays', icon: BookOpen },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 flex flex-col pt-0">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <FileText className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-800">IELTS Master</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-500"
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </header>

      <div className="flex relative flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block",
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}>
          <div className="p-6 hidden lg:block border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-100">
                <FileText className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight leading-none text-slate-800">IELTS Master</h1>
                <p className="text-[10px] uppercase tracking-widest font-bold text-blue-600 mt-1 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 inline-block">Task 2 Specialist</p>
              </div>
            </div>
          </div>

          <nav className="mt-6 px-3 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-slate-100 text-blue-600 border border-slate-200 shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent"
                )}
              >
                <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-blue-600" : "text-slate-400")} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="ml-auto"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-sm shadow-blue-200" />
                  </motion.div>
                )}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="p-4 bg-slate-800 rounded-xl text-slate-300 shadow-lg">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Success Target</p>
              <p className="text-sm font-bold mt-1 text-white">Aim for Band 7.5+</p>
              <div className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-blue-500" />
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen overflow-y-auto overflow-x-hidden p-6 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <header className="mb-10">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                <p className="text-slate-500 mt-2 text-sm max-w-2xl leading-relaxed">
                  {activeTab === 'evaluator' && 'Get instant AI-driven feedback on your essay parts or full writing using official IELTS standards.'}
                  {activeTab === 'resources' && 'Understanding the official band descriptors and evaluating your work against expert criteria.'}
                  {activeTab === 'errors' && 'Learn from frequent mistakes and master the writing nuances of high-scoring candidates.'}
                  {activeTab === 'samples' && 'Explore high-scoring essays and understand what makes them successful through expert annotation.'}
                </p>
              </header>

              {activeTab === 'evaluator' && <Evaluator />}
              {activeTab === 'resources' && <BandResources />}
              {activeTab === 'errors' && <CommonErrors />}
              {activeTab === 'samples' && <SampleEssays />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Bottom Bar */}
      <footer className="hidden lg:flex h-10 bg-slate-800 text-slate-400 text-[10px] px-8 items-center justify-between border-t border-slate-700 shrink-0">
        <div className="flex gap-6 font-medium">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-300">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            System Status: Optimal
          </span>
          <span>Engine version: <b className="text-slate-200">v2.4.1-Smart</b></span>
        </div>
        <div className="flex gap-4 items-center uppercase tracking-widest font-bold">
          <span>Current Session Plan: <b className="text-blue-400">IELTS Pro</b></span>
        </div>
      </footer>
    </div>
  );
}
