import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function BarChartBox({ data }) {
  return (
    <div className="w-full h-96 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-700">Metrics Overview</h2>
      <ResponsiveContainer>
        {/*
          To add space between the chart and the legend, we increase the `bottom` value in the `margin` prop.
        */}
        <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 20 }} barCategoryGap="20%">
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip wrapperClassName="!bg-white !border-gray-300 !rounded-md !shadow-lg" />
          <Legend />
          <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
