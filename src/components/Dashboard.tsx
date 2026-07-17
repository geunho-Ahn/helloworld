/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResult } from "../types";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

interface DashboardProps {
  analysis: AnalysisResult;
}

const COLORS = ['#f37321', '#222222', '#444444', '#666666', '#888888', '#aaaaaa'];

export default function Dashboard({ analysis }: DashboardProps) {
  const materialData = Object.entries(analysis.materialDistribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const supplierData = Object.entries(analysis.supplierDistribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-hanwha-orange opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Components</p>
          <p className="text-3xl font-bold text-hanwha-dark mt-2 tracking-tight">{analysis.totalItems.toLocaleString()} <span className="text-sm font-medium text-gray-400">ea</span></p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-hanwha-orange opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gross Weight</p>
          <p className="text-3xl font-bold text-hanwha-dark mt-2 tracking-tight">{analysis.totalWeight.toFixed(2)} <span className="text-sm font-medium text-gray-400">kg</span></p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-hanwha-orange opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Anomalies Detected</p>
          <p className="text-3xl font-bold text-hanwha-orange mt-2 tracking-tight">
            {(analysis.duplicates.length + analysis.missingFields.length + analysis.outliers.length).toLocaleString()}
            <span className="text-sm font-medium text-gray-400"> items</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-hanwha-dark tracking-tight">Material Composition Analysis</h4>
            <div className="w-8 h-1 bg-hanwha-orange rounded-full" />
          </div>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={materialData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
              >
                {materialData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-hanwha-dark tracking-tight">Supplier Distribution Matrix</h4>
            <div className="w-8 h-1 bg-hanwha-orange rounded-full" />
          </div>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={supplierData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fontWeight: 500, fill: '#666' }}
              />
              <Tooltip 
                cursor={{ fill: '#f8f9fa' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" fill="#f37321" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
