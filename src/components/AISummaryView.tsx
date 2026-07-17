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
        <div className="p-3 bg-blue-50 rounded-full">
          <Sparkles className="w-8 h-8 text-blue-400" />
        </div>
        <p className="text-gray-500 font-medium">AI가 데이터를 분석하여 요약 리포트를 생성 중입니다...</p>
        <div className="w-full max-w-md h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-blue-500"
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
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-lg text-white">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-blue-200" />
          <h3 className="text-xl font-bold">AI 데이터 인사이트</h3>
        </div>
        <p className="text-blue-50 leading-relaxed text-lg italic">
          "{summary.summary}"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-indigo-600">
            <Lightbulb className="w-5 h-5" />
            <h4 className="font-bold">주요 발견 사항</h4>
          </div>
          <ul className="space-y-3">
            {summary.insights.map((insight, idx) => (
              <li key={idx} className="flex gap-3 text-gray-700 text-sm">
                <ArrowRight className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-emerald-600">
            <Target className="w-5 h-5" />
            <h4 className="font-bold">대응 권고 사항</h4>
          </div>
          <ul className="space-y-3">
            {summary.recommendations.map((rec, idx) => (
              <li key={idx} className="flex gap-3 text-gray-700 text-sm">
                <div className="w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                  {idx + 1}
                </div>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
