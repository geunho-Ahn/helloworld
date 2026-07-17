/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResult, PartData } from "../types";

export const cleanValue = (value: any, field: keyof PartData): any => {
  if (value === null || value === undefined) return "";
  
  const str = String(value).trim();
  
  if (field === "weight" || field === "quantity") {
    // Remove non-numeric characters except for decimal point
    const numericStr = str.replace(/[^\d.-]/g, "");
    const num = parseFloat(numericStr);
    return isNaN(num) ? 0 : num;
  }
  
  return str;
};

export const processData = (
  rawData: any[],
  mapping: Record<string, keyof PartData | null>
): { cleaned: PartData[]; analysis: AnalysisResult } => {
  const cleaned: PartData[] = [];
  const duplicates: PartData[] = [];
  const seenPartNos = new Set<string>();
  const missingFields: AnalysisResult["missingFields"] = [];
  const outliers: AnalysisResult["outliers"] = [];

  const materialDistribution: Record<string, number> = {};
  const supplierDistribution: Record<string, number> = {};
  const projectDistribution: Record<string, number> = {};
  let totalWeight = 0;

  rawData.forEach((row, index) => {
    const part: Partial<PartData> = {};
    
    Object.entries(mapping).forEach(([userHeader, standardField]) => {
      if (standardField) {
        part[standardField as keyof PartData] = cleanValue(row[userHeader], standardField);
      }
    });

    const partData = part as PartData;

    // Validation
    if (!partData.partNo) missingFields.push({ row: index + 1, field: "partNo" });
    if (!partData.partName) missingFields.push({ row: index + 1, field: "partName" });
    
    if (partData.partNo) {
      if (seenPartNos.has(partData.partNo)) {
        duplicates.push(partData);
      } else {
        seenPartNos.add(partData.partNo);
        cleaned.push(partData);
        
        // Stats
        if (partData.material) {
          materialDistribution[partData.material] = (materialDistribution[partData.material] || 0) + 1;
        }
        if (partData.supplier) {
          supplierDistribution[partData.supplier] = (supplierDistribution[partData.supplier] || 0) + 1;
        }
        if (partData.project) {
          projectDistribution[partData.project] = (projectDistribution[partData.project] || 0) + 1;
        }
        totalWeight += partData.weight || 0;

        // Outlier detection (simple example: weight <= 0)
        if (partData.weight <= 0) {
          outliers.push({ row: index + 1, field: "weight", value: partData.weight, reason: "Weight must be greater than 0" });
        }
      }
    }
  });

  return {
    cleaned,
    analysis: {
      totalItems: cleaned.length,
      totalWeight,
      materialDistribution,
      supplierDistribution,
      projectDistribution,
      duplicates,
      missingFields,
      outliers,
    },
  };
};
