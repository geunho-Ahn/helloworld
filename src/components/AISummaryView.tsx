/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sparkles, ArrowRight, Lightbulb, Target } from "lucide-react";
import { AISummary } from "../types";
import { motion } from "motion/react";

interface AISummaryViewProps {
  summary: AISummary | null;
  loading: boolean;
}

export default function AISummaryView({ summary, loading }: AISummaryViewProps) {
  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-4 animate-pulse">
        <div className="p-3 bg-orange-50 rounded-full">
          <Sparkles className="w-8 h-8 text-hanwha-orange" />
        </div>
        <p className="text-gray-400 font-bold tracking-widest text-xs uppercase">Engine Initializing...</p>
        <div className="w-full max-w-md h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-hanwha-orange"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-hanwha-dark p-8 rounded-2xl shadow-xl text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-hanwha-orange opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-hanwha-orange rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold tracking-tight uppercase">AI Intelligence Report</h3>
        </div>
        <p className="text-gray-300 leading-relaxed text-xl font-medium italic border-l-2 border-hanwha-orange pl-6">
          "{summary.summary}"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-hanwha-orange opacity-50" />
          <div className="flex items-center gap-2 mb-6 text-hanwha-dark">
            <Lightbulb className="w-5 h-5 text-hanwha-orange" />
            <h4 className="font-bold tracking-tight uppercase text-xs">Strategic Findings</h4>
          </div>
          <ul className="space-y-4">
            {summary.insights.map((insight, idx) => (
              <li key={idx} className="flex gap-4 text-gray-600 text-sm leading-relaxed group/item">
                <ArrowRight className="w-4 h-4 text-hanwha-orange flex-shrink-0 mt-0.5 group-hover/item:translate-x-1 transition-transform" />
                <span className="group-hover/item:text-hanwha-dark transition-colors">{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-hanwha-dark opacity-50" />
          <div className="flex items-center gap-2 mb-6 text-hanwha-dark">
            <Target className="w-5 h-5 text-hanwha-orange" />
            <h4 className="font-bold tracking-tight uppercase text-xs">Tactical Recommendations</h4>
          </div>
          <ul className="space-y-4">
            {summary.recommendations.map((rec, idx) => (
              <li key={idx} className="flex gap-4 text-gray-600 text-sm leading-relaxed group/item">
                <div className="w-6 h-6 bg-hanwha-gray text-hanwha-dark border border-gray-200 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0 group-hover/item:bg-hanwha-orange group-hover/item:text-white group-hover/item:border-hanwha-orange transition-all">
                  {idx + 1}
                </div>
                <span className="group-hover/item:text-hanwha-dark transition-colors">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
