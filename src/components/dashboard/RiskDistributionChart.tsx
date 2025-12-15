import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Student } from '@/data/sampleStudents';

interface RiskDistributionChartProps {
  students: Student[];
}

const COLORS = {
  Low: 'hsl(145, 65%, 42%)',
  Medium: 'hsl(38, 92%, 55%)',
  High: 'hsl(0, 72%, 55%)',
};

export function RiskDistributionChart({ students }: RiskDistributionChartProps) {
  const data = [
    { name: 'Low Risk', value: students.filter((s) => s.riskLevel === 'Low').length },
    { name: 'Medium Risk', value: students.filter((s) => s.riskLevel === 'Medium').length },
    { name: 'High Risk', value: students.filter((s) => s.riskLevel === 'High').length },
  ];

  return (
    <div className="stat-card h-[350px]">
      <h3 className="text-lg font-semibold mb-4">Risk Distribution</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            label={({ name, value }) => `${value}`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name.split(' ')[0] as keyof typeof COLORS]}
                className="transition-all duration-300 hover:opacity-80"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
