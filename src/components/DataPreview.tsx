/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Table, AlertTriangle, CheckCircle2 } from "lucide-react";
import { PartData } from "../types";

interface DataPreviewProps {
  rawData: any[];
  cleanedData: PartData[];
}

export default function DataPreview({ rawData, cleanedData }: DataPreviewProps) {
  const displayRows = 5;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest text-hanwha-dark">
            <Table className="w-3 h-3 text-hanwha-orange" />
            <span>Dataset Verification Engine</span>
          </div>
          <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5 text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
              Input Stream
            </span>
            <span className="flex items-center gap-1.5 text-hanwha-orange">
              <span className="w-1.5 h-1.5 rounded-full bg-hanwha-orange"></span>
              Standardized Output
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">
                <th className="px-6 py-5 border-b border-gray-100">Index</th>
                <th className="px-6 py-5 border-b border-gray-100">Component ID</th>
                <th className="px-6 py-5 border-b border-gray-100">Description</th>
                <th className="px-6 py-5 border-b border-gray-100">Spec / Material</th>
                <th className="px-6 py-5 border-b border-gray-100">Quantity</th>
                <th className="px-6 py-5 border-b border-gray-100">Unit Mass (kg)</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-gray-50">
              {cleanedData.slice(0, displayRows).map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-gray-300">{String(idx + 1).padStart(3, '0')}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-gray-300 text-[10px] line-through">{String(rawData[idx]?.['Part No'] || rawData[idx]?.['P/N'] || '')}</span>
                      <span className="font-bold text-hanwha-dark group-hover:text-hanwha-orange transition-colors">{item.partNo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{item.partName}</td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="flex flex-col">
                      <span className="font-bold text-hanwha-dark">{item.material}</span>
                      <span className="text-[10px]">{item.specification || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-bold">{item.quantity.toLocaleString()}</td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col">
                      <span className="text-gray-300 text-[10px] line-through">{String(rawData[idx]?.['Weight'] || rawData[idx]?.['중량'] || '')}</span>
                      <span className="font-bold text-hanwha-orange">{item.weight.toFixed(3)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 bg-white rounded-xl border border-gray-100 flex items-start gap-4 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-hanwha-orange" />
          <div className="p-2.5 bg-orange-50 rounded-lg group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-5 h-5 text-hanwha-orange" />
          </div>
          <div>
            <h4 className="font-bold text-hanwha-dark text-sm uppercase tracking-tight">Cleaning Engine Operational</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Automated removal of whitespace, unit labels, and illegal characters completed successfully. 
              Data precision is now calibrated to aerospace standards.
            </p>
          </div>
        </div>
        <div className="p-5 bg-white rounded-xl border border-gray-100 flex items-start gap-4 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-hanwha-dark" />
          <div className="p-2.5 bg-gray-50 rounded-lg group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-5 h-5 text-hanwha-dark" />
          </div>
          <div>
            <h4 className="font-bold text-hanwha-dark text-sm uppercase tracking-tight">Anomaly Detection Log</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {cleanedData.length < rawData.length 
                ? `System filtered ${rawData.length - cleanedData.length} redundant entries to maintain data integrity.` 
                : "No structural anomalies or critical data gaps detected in the current sequence."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
