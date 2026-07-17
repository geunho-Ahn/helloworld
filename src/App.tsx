/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileSpreadsheet, Download, RefreshCcw, LayoutDashboard, Database, Sparkles } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";
import FileUpload from "./components/FileUpload";
import DataPreview from "./components/DataPreview";
import Dashboard from "./components/Dashboard";
import AISummaryView from "./components/AISummaryView";
import { AISummary, AnalysisResult, PartData } from "./types";
import { processData } from "./utils/dataProcessor";

export default function App() {
  const [rawData, setRawData] = useState<any[] | null>(null);
  const [cleanedData, setCleanedData] = useState<PartData[] | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "data">("dashboard");

  const handleDataLoaded = async (data: any[], fileName: string) => {
    setRawData(data);
    
    // Auto-map columns using AI or simple matching (Simplified for this version)
    // In a real app, we'd call /api/map-columns
    const headers = Object.keys(data[0] || {});
    const mapping: Record<string, keyof PartData | null> = {};
    
    headers.forEach(h => {
      const lower = h.toLowerCase();
      if (lower.includes('part no') || lower.includes('p/n') || lower.includes('품번')) mapping[h] = 'partNo';
      else if (lower.includes('name') || lower.includes('품명')) mapping[h] = 'partName';
      else if (lower.includes('material') || lower.includes('재질')) mapping[h] = 'material';
      else if (lower.includes('spec') || lower.includes('규격')) mapping[h] = 'specification';
      else if (lower.includes('qty') || lower.includes('수량')) mapping[h] = 'quantity';
      else if (lower.includes('weight') || lower.includes('중량')) mapping[h] = 'weight';
      else if (lower.includes('supplier') || lower.includes('업체')) mapping[h] = 'supplier';
      else if (lower.includes('project') || lower.includes('프로젝트')) mapping[h] = 'project';
    });

    const { cleaned, analysis: stats } = processData(data, mapping);
    setCleanedData(cleaned);
    setAnalysis(stats);

    // Call AI for analysis
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          dataSample: cleaned.slice(0, 5),
          stats 
        }),
      });
      const aiData = await response.json();
      setAiSummary(aiData);
    } catch (error) {
      console.error("AI Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadExcel = () => {
    if (!cleanedData || !analysis) return;

    const wb = XLSX.utils.book_new();

    // Sheet 1: Raw Data
    const wsRaw = XLSX.utils.json_to_sheet(rawData || []);
    XLSX.utils.book_append_sheet(wb, wsRaw, "Raw Data");

    // Sheet 2: Cleaned Data
    const wsCleaned = XLSX.utils.json_to_sheet(cleanedData);
    XLSX.utils.book_append_sheet(wb, wsCleaned, "Cleaned Data");

    // Sheet 3: Duplicates/Errors
    const errorData = [
      ...analysis.duplicates.map(d => ({ ...d, errorType: "Duplicate" })),
      ...analysis.missingFields.map(m => ({ row: m.row, field: m.field, errorType: "Missing Field" })),
      ...analysis.outliers.map(o => ({ row: o.row, field: o.field, value: o.value, reason: o.reason, errorType: "Outlier" }))
    ];
    const wsErrors = XLSX.utils.json_to_sheet(errorData);
    XLSX.utils.book_append_sheet(wb, wsErrors, "Errors & Duplicates");

    // Sheet 4: Summary Stats
    const summaryData = [
      { Metric: "Total Items", Value: analysis.totalItems },
      { Metric: "Total Weight (kg)", Value: analysis.totalWeight },
      { Metric: "Unique Materials", Value: Object.keys(analysis.materialDistribution).length },
      { Metric: "Total Suppliers", Value: Object.keys(analysis.supplierDistribution).length },
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary Report");

    XLSX.writeFile(wb, `LS_Component_Analysis_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const reset = () => {
    setRawData(null);
    setCleanedData(null);
    setAnalysis(null);
    setAiSummary(null);
    setActiveTab("dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-hanwha-orange rounded-lg flex items-center justify-center">
              <FileSpreadsheet className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-hanwha-dark">LS 부품 데이터 분석기</h1>
              <p className="text-[10px] text-hanwha-orange font-bold tracking-[0.2em] uppercase">Aerospace Data Intelligence</p>
            </div>
          </div>

          {analysis && (
            <div className="flex items-center gap-4">
              <button 
                onClick={reset}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-500 hover:text-hanwha-orange hover:bg-orange-50 rounded-lg transition-all"
              >
                <RefreshCcw className="w-4 h-4" />
                <span>다시 시작</span>
              </button>
              <button 
                onClick={downloadExcel}
                className="flex items-center gap-2 bg-hanwha-dark text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-gray-200 hover:bg-hanwha-orange transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>분석 리포트 다운로드</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!analysis ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
                데이터 통합 및 분석의 새로운 기준
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                파편화된 협력사 부품 데이터를 업로드하세요. 
                AI가 표준화된 형식으로 정제하고, 즉석에서 인사이트 리포트를 작성합니다.
              </p>
            </div>
            <FileUpload onDataLoaded={handleDataLoaded} />
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Tabs */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 w-fit">
              <button 
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === "dashboard" ? "bg-hanwha-orange text-white shadow-lg shadow-orange-100" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                통계 대시보드
              </button>
              <button 
                onClick={() => setActiveTab("data")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === "data" ? "bg-hanwha-orange text-white shadow-lg shadow-orange-100" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Database className="w-4 h-4" />
                정제 데이터
              </button>
            </div>

            {/* AI Summary Always Visible */}
            <AISummaryView summary={aiSummary} loading={isAnalyzing} />

            {/* Content Area */}
            {activeTab === "dashboard" ? (
              <Dashboard analysis={analysis} />
            ) : (
              <DataPreview rawData={rawData || []} cleanedData={cleanedData || []} />
            )}
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-200 mt-20 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-gray-500">
          <Sparkles className="w-4 h-4 text-hanwha-orange" />
          <span className="text-sm font-bold tracking-tight">DESIGNED BY HANWHA AEROSPACE STYLE ENGINE</span>
        </div>
        <p className="text-gray-400 text-xs font-medium">
          LS Component Data Analytics v1.0 • AI-Enabled Precision Engineering
        </p>
      </footer>
    </div>
  );
}
