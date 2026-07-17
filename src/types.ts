/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PartData {
  id?: string;
  partNo: string;
  partName: string;
  material: string;
  specification?: string;
  quantity: number;
  weight: number; // Unit: kg
  supplier: string;
  project?: string;
}

export interface AnalysisResult {
  totalItems: number;
  totalWeight: number;
  materialDistribution: Record<string, number>;
  supplierDistribution: Record<string, number>;
  projectDistribution: Record<string, number>;
  duplicates: PartData[];
  missingFields: Array<{ row: number; field: string }>;
  outliers: Array<{ row: number; field: string; value: any; reason: string }>;
}

export interface AISummary {
  summary: string;
  insights: string[];
  recommendations: string[];
}

export interface ColumnMapping {
  original: string;
  standard: keyof PartData | null;
}
