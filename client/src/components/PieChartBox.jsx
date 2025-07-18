import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#4f46e5', '#818cf8', '#a5b4fc', '#c7d2fe'];

export default function PieChartBox({ data }) {
  return (
    <div className="w-full h-96 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-700">Metrics Distribution</h2>
      <ResponsiveContainer>
        {/*
          To create space at the bottom, we adjust the Pie's vertical center (cy)
          and add a bottom margin to the PieChart component.
        */}
        <PieChart margin={{ top: 20, right: 0, bottom: 20, left: 0 }}>
          <Pie
            data={data}
            cx="50%"
            cy="45%" // Move the pie up from the center to make space for the legend
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
