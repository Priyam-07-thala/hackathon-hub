import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Layout } from '@/components/layout/Layout';
import { sampleStudents, classPerformanceTrend } from '@/data/sampleStudents';

export default function Analytics() {
  // Subject-wise class average
  const subjects = ['Mathematics', 'Science', 'English', 'History'];
  const subjectAverages = subjects.map((subject) => {
    const scores = sampleStudents.flatMap((s) =>
      s.subjects.filter((sub) => sub.subject === subject).map((sub) => sub.score)
    );
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return { subject, average: Math.round(avg) };
  });

  // Attendance distribution
  const attendanceRanges = [
    { range: '90-100%', count: sampleStudents.filter((s) => s.attendance >= 90).length },
    { range: '80-89%', count: sampleStudents.filter((s) => s.attendance >= 80 && s.attendance < 90).length },
    { range: '70-79%', count: sampleStudents.filter((s) => s.attendance >= 70 && s.attendance < 80).length },
    { range: '60-69%', count: sampleStudents.filter((s) => s.attendance >= 60 && s.attendance < 70).length },
    { range: '<60%', count: sampleStudents.filter((s) => s.attendance < 60).length },
  ];

  // Class comparison
  const classes = [...new Set(sampleStudents.map((s) => s.class))];
  const classComparison = classes.map((cls) => {
    const classStudents = sampleStudents.filter((s) => s.class === cls);
    return {
      class: cls,
      avgMarks: Math.round(classStudents.reduce((sum, s) => sum + s.avgMarks, 0) / classStudents.length),
      attendance: Math.round(classStudents.reduce((sum, s) => sum + s.attendance, 0) / classStudents.length),
      assignments: Math.round(classStudents.reduce((sum, s) => sum + s.assignmentCompletion, 0) / classStudents.length),
    };
  });

  // Radar data for overall metrics
  const radarData = [
    {
      metric: 'Attendance',
      value: Math.round(sampleStudents.reduce((sum, s) => sum + s.attendance, 0) / sampleStudents.length),
      fullMark: 100,
    },
    {
      metric: 'Avg Marks',
      value: Math.round(sampleStudents.reduce((sum, s) => sum + s.avgMarks, 0) / sampleStudents.length),
      fullMark: 100,
    },
    {
      metric: 'Assignments',
      value: Math.round(sampleStudents.reduce((sum, s) => sum + s.assignmentCompletion, 0) / sampleStudents.length),
      fullMark: 100,
    },
    {
      metric: 'Behavior',
      value: Math.round((sampleStudents.reduce((sum, s) => sum + s.behaviorScore, 0) / sampleStudents.length) * 10),
      fullMark: 100,
    },
  ];

  return (
    <Layout title="Analytics" subtitle="Comprehensive performance analytics and insights">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Subject Performance */}
        <div className="stat-card h-[400px]">
          <h3 className="text-lg font-semibold mb-4">Subject-wise Class Average</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={subjectAverages}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="average" fill="hsl(185, 65%, 35%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Overall Metrics Radar */}
        <div className="stat-card h-[400px]">
          <h3 className="text-lg font-semibold mb-4">Overall Class Metrics</h3>
          <ResponsiveContainer width="100%" height="85%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
              <Radar
                name="Class Average"
                dataKey="value"
                stroke="hsl(185, 65%, 35%)"
                fill="hsl(185, 65%, 35%)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Attendance Distribution */}
        <div className="stat-card h-[400px]">
          <h3 className="text-lg font-semibold mb-4">Attendance Distribution</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={attendanceRanges} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis dataKey="range" type="category" width={80} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="hsl(38, 92%, 55%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Class Comparison */}
        <div className="stat-card h-[400px]">
          <h3 className="text-lg font-semibold mb-4">Class Comparison</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={classComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="class" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="avgMarks" name="Avg Marks" fill="hsl(185, 65%, 35%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="attendance" name="Attendance" fill="hsl(38, 92%, 55%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="assignments" name="Assignments" fill="hsl(145, 65%, 42%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="stat-card h-[400px]">
        <h3 className="text-lg font-semibold mb-4">Monthly Performance Trend</h3>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={classPerformanceTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
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
            />
            <Line
              type="monotone"
              dataKey="attendance"
              name="Attendance"
              stroke="hsl(38, 92%, 55%)"
              strokeWidth={3}
              dot={{ fill: 'hsl(38, 92%, 55%)', strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="atRiskCount"
              name="At-Risk Count"
              stroke="hsl(0, 72%, 55%)"
              strokeWidth={3}
              dot={{ fill: 'hsl(0, 72%, 55%)', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Layout>
  );
}
