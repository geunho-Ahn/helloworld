/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Upload, FileType, CheckCircle, AlertCircle } from "lucide-react";
import Papa from "papaparse";
import React, { useCallback, useState } from "react";
import * as XLSX from "xlsx";

interface FileUploadProps {
  onDataLoaded: (data: any[], fileName: string) => void;
}

export default function FileUpload({ onDataLoaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    const reader = new FileReader();
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          onDataLoaded(results.data, file.name);
        },
        error: (err) => {
          setError(`CSV Parsing Error: ${err.message}`);
        }
      });
    } else if (extension === "xlsx" || extension === "xls") {
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          onDataLoaded(json, file.name);
        } catch (err) {
          setError("Excel Parsing Error. Please check the file format.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setError("Unsupported file format. Please upload CSV or Excel.");
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        id="drop-zone"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
          isDragging
            ? "border-hanwha-orange bg-orange-50"
            : "border-gray-200 hover:border-hanwha-orange hover:bg-white"
        }`}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          className="hidden"
          accept=".csv, .xlsx, .xls"
          onChange={onFileChange}
        />
        
        <div className="p-4 bg-hanwha-gray rounded-full mb-6 border border-gray-100 shadow-sm">
          <Upload className="w-10 h-10 text-hanwha-orange" />
        </div>
        
        <h3 className="text-xl font-bold text-hanwha-dark mb-2">
          부품 데이터 분석 시작
        </h3>
        <p className="text-gray-500 text-center max-w-sm text-sm">
          협력사에서 제공한 CSV 또는 Excel 파일을 업로드하세요. <br/>
          정밀 분석 엔진이 데이터를 즉시 표준화합니다.
        </p>
        
        <div className="mt-8 flex gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <FileType className="w-3 h-3 text-hanwha-orange" />
            <span>XLSX / CSV</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3 h-3 text-hanwha-orange" />
            <span>AI Mapping</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
