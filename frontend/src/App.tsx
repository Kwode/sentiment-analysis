/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import axios from 'axios';
import { Send, AlertCircle, CheckCircle2, Loader2, Brain, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SentimentResult {
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  score: number;
}

interface SentimentSectionProps {
  title: string;
  endpoint: string;
  icon: React.ReactNode;
  description: string;
}

const SentimentSection = ({ title, endpoint, icon, description }: SentimentSectionProps) => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(endpoint, { text });
      // Assuming the API returns { sentiment: string, score: number }
      // Adjusting to match the user's requirement of "Positive / Neutral / Negative"
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to connect to the sentiment analysis API.');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'negative': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 shadow-sm">
            {icon}
          </div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">{title}</h2>
        </div>
        <p className="text-sm text-slate-500">{description}</p>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste text to analyze..."
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none text-slate-700 placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="flex items-center justify-center gap-2 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all shadow-md shadow-indigo-200 active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Analyze Sentiment</span>
              </>
            )}
          </button>
        </form>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-700 text-sm"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-2 text-slate-900 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Analysis Complete</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border flex flex-col gap-1 ${getSentimentColor(result.sentiment)}`}>
                  <span className="text-[10px] uppercase tracking-wider font-bold opacity-70">Sentiment</span>
                  <span className="text-lg font-bold">{result.sentiment}</span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-1 text-slate-700">
                  <span className="text-[10px] uppercase tracking-wider font-bold opacity-70">Confidence</span>
                  <span className="text-lg font-bold">{(result.score * 100).toFixed(1)}%</span>
                </div>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${result.score * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full ${result.sentiment === 'Positive' ? 'bg-emerald-500' : result.sentiment === 'Negative' ? 'bg-rose-500' : 'bg-amber-500'}`}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-white border-b border-slate-200 py-8 px-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sentiment Analyzer</h1>
              <p className="text-slate-500 font-medium">Advanced linguistic analysis powered by AI</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-10">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <SentimentSection
            title="Transformers Analysis"
            endpoint="http://localhost:8000/vader"
            description="Deep learning model utilizing attention mechanisms for nuanced context understanding."
            icon={<Brain className="w-5 h-5" />}
          />
          <SentimentSection
            title="VADER Analysis"
            endpoint="http://localhost:8000/sent"
            description="Lexicon and rule-based sentiment analysis tool specifically attuned to social media sentiments."
            icon={<BarChart3 className="w-5 h-5" />}
          />
        </div>

        <footer className="mt-16 pt-8 border-t border-slate-200 text-center">
          <p className="text-slate-400 text-sm">
            Connect your local backend at <code className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-indigo-600">localhost:8000</code> to start processing.
          </p>
        </footer>
      </main>
    </div>
  );
}
