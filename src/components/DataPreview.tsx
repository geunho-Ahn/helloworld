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
          <div className="flex items-center gap-2 font-medium text-gray-700">
            <Table className="w-4 h-4" />
            <span>데이터 미리보기 (상위 {displayRows}개 항목)</span>
          </div>
          <div className="flex gap-4 text-xs font-medium">
            <span className="flex items-center gap-1 text-gray-500">
              <span className="w-2 h-2 rounded-full bg-gray-300"></span>
              원본 데이터
            </span>
            <span className="flex items-center gap-1 text-blue-600">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              정제 완료
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4 border-b border-gray-100">항목</th>
                <th className="px-6 py-4 border-b border-gray-100">Part No</th>
                <th className="px-6 py-4 border-b border-gray-100">품명</th>
                <th className="px-6 py-4 border-b border-gray-100">재질</th>
                <th className="px-6 py-4 border-b border-gray-100">수량</th>
                <th className="px-6 py-4 border-b border-gray-100">중량 (kg)</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {cleanedData.slice(0, displayRows).map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-gray-400">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-xs line-through">{String(rawData[idx]?.['Part No'] || rawData[idx]?.['P/N'] || '')}</span>
                      <span className="font-medium text-blue-600">{item.partNo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{item.partName}</td>
                  <td className="px-6 py-4 text-gray-700">{item.material}</td>
                  <td className="px-6 py-4 text-gray-700">{item.quantity}</td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col">
                      <span className="text-gray-400 text-xs line-through">{String(rawData[idx]?.['Weight'] || rawData[idx]?.['중량'] || '')}</span>
                      <span className="font-medium text-blue-600">{item.weight}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900">데이터 정제 성공</h4>
            <p className="text-sm text-blue-700 mt-1">
              공백 제거, 특수문자 제거, 숫자 형식 변환이 완료되었습니다.
            </p>
          </div>
        </div>
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-4">
          <div className="p-2 bg-amber-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h4 className="font-semibold text-amber-900">검토 필요 사항</h4>
            <p className="text-sm text-amber-700 mt-1">
              {cleanedData.length < rawData.length 
                ? `${rawData.length - cleanedData.length}개의 중복 항목이 제외되었습니다.` 
                : "중복이나 오류 항목이 발견되지 않았습니다."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
