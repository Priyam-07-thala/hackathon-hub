import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Star,
  Lightbulb,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { sampleStudents } from '@/data/sampleStudents';
import { predictRisk, getModelInfo } from '@/lib/mlPredictor';
import { cn } from '@/lib/utils';

export default function StudentProfile() {
  const { id } = useParams();
  const student = sampleStudents.find((s) => s.id === id);
  const modelInfo = getModelInfo();

  if (!student) {
    return (
      <Layout title="Student Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Student not found</p>
          <Link to="/students">
            <Button>Back to Students</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  // Get live prediction from ML model
  const prediction = predictRisk({
    attendance: student.attendance,
    avgMarks: student.avgMarks,
    assignmentCompletion: student.assignmentCompletion,
    behaviorScore: student.behaviorScore,
  });

  const TrendIcon =
    student.trend === 'improving'
      ? TrendingUp
      : student.trend === 'declining'
      ? TrendingDown
      : Minus;

  const subjectData = student.subjects.map((s) => ({
    name: s.subject,
    score: s.score,
  }));

  // Use actual ML model weights
  const featureImportance = [
    { feature: 'Average Marks', importance: Math.round(modelInfo.weights.avgMarks * 100), value: student.avgMarks },
    { feature: 'Attendance', importance: Math.round(modelInfo.weights.attendance * 100), value: student.attendance },
    { feature: 'Assignments', importance: Math.round(modelInfo.weights.assignmentCompletion * 100), value: student.assignmentCompletion },
    { feature: 'Behavior', importance: Math.round(modelInfo.weights.behaviorScore * 100), value: student.behaviorScore * 10 },
  ];

  return (
    <Layout title="Student Profile" subtitle={`Viewing ${student.name}'s detailed profile`}>
      {/* Back Button */}
      <Link to="/students" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Students
      </Link>

      {/* Header Card */}
      <div className="stat-card mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">
                {student.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{student.name}</h2>
              <p className="text-muted-foreground">
                {student.rollNo} • Class {student.class}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{student.email}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge
              className={cn(
                'text-lg px-4 py-1',
                prediction.riskLevel === 'Very Low' && 'risk-badge-very-low',
                prediction.riskLevel === 'Low' && 'risk-badge-low',
                prediction.riskLevel === 'Medium' && 'risk-badge-medium',
                prediction.riskLevel === 'High' && 'risk-badge-high'
              )}
            >
              {prediction.riskLevel} Risk ({prediction.riskProbability}%)
            </Badge>
            <div
              className={cn(
                'flex items-center gap-1',
                student.trend === 'improving' && 'text-success',
                student.trend === 'declining' && 'text-destructive',
                student.trend === 'stable' && 'text-muted-foreground'
              )}
            >
              <TrendIcon className="w-4 h-4" />
              <span className="capitalize">{student.trend}</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="stat-card text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{student.attendance}%</p>
              <p className="text-sm text-muted-foreground">Attendance</p>
            </div>
            <div className="stat-card text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-warning" />
              <p className="text-2xl font-bold">{student.avgMarks}%</p>
              <p className="text-sm text-muted-foreground">Avg Marks</p>
            </div>
            <div className="stat-card text-center">
              <ClipboardCheck className="w-8 h-8 mx-auto mb-2 text-success" />
              <p className="text-2xl font-bold">{student.assignmentCompletion}%</p>
              <p className="text-sm text-muted-foreground">Assignments</p>
            </div>
            <div className="stat-card text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold">{student.behaviorScore}/10</p>
              <p className="text-sm text-muted-foreground">Behavior</p>
            </div>
          </div>

          {/* Subject Performance */}
          <div className="stat-card h-[350px]">
            <h3 className="text-lg font-semibold mb-4">Subject Performance</h3>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={subjectData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar
                  dataKey="score"
                  fill="hsl(185, 65%, 35%)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="records">
          <div className="stat-card">
            <h3 className="text-lg font-semibold mb-4">Academic Records</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Subject</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Score</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Max</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Percentage</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {student.subjects.map((subject) => (
                    <tr key={subject.subject} className="border-b border-border/50">
                      <td className="py-3 px-4 font-medium">{subject.subject}</td>
                      <td className="py-3 px-4">{subject.score}</td>
                      <td className="py-3 px-4">{subject.maxScore}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Progress value={(subject.score / subject.maxScore) * 100} className="w-20 h-2" />
                          <span>{Math.round((subject.score / subject.maxScore) * 100)}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            'flex items-center gap-1',
                            subject.trend === 'up' && 'text-success',
                            subject.trend === 'down' && 'text-destructive',
                            subject.trend === 'stable' && 'text-muted-foreground'
                          )}
                        >
                          {subject.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                          {subject.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                          {subject.trend === 'stable' && <Minus className="w-4 h-4" />}
                          {subject.trend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="stat-card">
            <h3 className="text-lg font-semibold mb-4">Risk Prediction Analysis</h3>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Risk Probability</span>
                <span className="text-2xl font-bold">{prediction.riskProbability}%</span>
              </div>
              <div className="h-4 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-500',
                    prediction.riskProbability < 15 && 'bg-[hsl(160,70%,38%)]',
                    prediction.riskProbability >= 15 && prediction.riskProbability < 30 && 'bg-success',
                    prediction.riskProbability >= 30 && prediction.riskProbability < 50 && 'bg-warning',
                    prediction.riskProbability >= 50 && 'bg-destructive'
                  )}
                  style={{ width: `${prediction.riskProbability}%` }}
                />
              </div>
            </div>

            <h4 className="font-medium mb-4">Feature Importance (ML Model Factors)</h4>
            <div className="space-y-4">
              {featureImportance.map((item) => (
                <div key={item.feature}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">{item.feature}</span>
                    <span className="text-sm font-medium">{item.value}% (Weight: {item.importance}%)</span>
                  </div>
                  <Progress value={item.value} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="w-6 h-6 text-warning" />
              <h3 className="text-lg font-semibold">AI-Generated Recommendations</h3>
            </div>
            <div className="space-y-4">
              {student.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">{index + 1}</span>
                  </div>
                  <p className="text-foreground">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
