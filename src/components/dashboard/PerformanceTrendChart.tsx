import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { classPerformanceTrend } from '@/data/sampleStudents';

export function PerformanceTrendChart() {
  return (
    <div className="stat-card h-[350px]">
      <h3 className="text-lg font-semibold mb-4">Class Performance Trend</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={classPerformanceTrend}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="month"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="avgScore"
            name="Avg Score"
            stroke="hsl(185, 65%, 35%)"
            strokeWidth={3}
            dot={{ fill: 'hsl(185, 65%, 35%)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="attendance"
            name="Attendance %"
            stroke="hsl(38, 92%, 55%)"
            strokeWidth={3}
            dot={{ fill: 'hsl(38, 92%, 55%)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
