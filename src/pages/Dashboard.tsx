import { useState, useEffect } from 'react';
import { Users, AlertTriangle, TrendingUp, BookOpen, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { StatCard } from '@/components/dashboard/StatCard';
import { RiskDistributionChart } from '@/components/dashboard/RiskDistributionChart';
import { PerformanceTrendChart } from '@/components/dashboard/PerformanceTrendChart';
import { AtRiskList } from '@/components/dashboard/AtRiskList';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Student } from '@/data/sampleStudents';

interface StudentData {
  id: string;
  name: string;
  roll_no: string | null;
  class: string | null;
  student_email: string;
  attendance: number;
  avg_marks: number;
  assignment_completion: number;
  behavior_score: number;
  risk_level: string;
  risk_probability: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStudents();
    }
  }, [user]);

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('student_data')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching students:', error);
    } else if (data) {
      // Transform to Student format
      const transformedStudents: Student[] = data.map((s: StudentData) => ({
        id: s.id,
        name: s.name,
        email: s.student_email,
        class: s.class || 'N/A',
        rollNo: s.roll_no || 'N/A',
        attendance: Number(s.attendance),
        avgMarks: Number(s.avg_marks),
        assignmentCompletion: Number(s.assignment_completion),
        behaviorScore: Number(s.behavior_score),
        riskLevel: s.risk_level as 'Very Low' | 'Low' | 'Medium' | 'High',
        riskProbability: Number(s.risk_probability),
        trend: 'stable' as const,
        subjects: [
          { subject: 'Math', score: Math.round(Number(s.avg_marks) * 0.9), maxScore: 100, trend: 'stable' as const },
          { subject: 'Science', score: Math.round(Number(s.avg_marks) * 1.05), maxScore: 100, trend: 'stable' as const },
          { subject: 'English', score: Math.round(Number(s.avg_marks) * 0.95), maxScore: 100, trend: 'stable' as const },
        ],
        recommendations: [],
        lastUpdated: new Date().toISOString(),
      }));
      setStudents(transformedStudents);
    }
    setLoading(false);
  };

  const totalStudents = students.length;
  const highRiskCount = students.filter((s) => s.riskLevel === 'High').length;
  const avgAttendance = totalStudents > 0 
    ? Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / totalStudents)
    : 0;

  if (loading) {
    return (
      <Layout title="Dashboard" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Dashboard"
      subtitle={totalStudents > 0 
        ? `Welcome back! Here's an overview of your ${totalStudents} students.`
        : `Welcome! Upload student data to get started.`
      }
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={totalStudents}
          change={totalStudents > 0 ? "From uploaded data" : "No data yet"}
          changeType="positive"
          icon={Users}
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
        />
        <StatCard
          title="At-Risk Students"
          value={highRiskCount}
          change={highRiskCount > 0 ? `${Math.round((highRiskCount / totalStudents) * 100)}% of total` : "None identified"}
          changeType={highRiskCount > 0 ? "negative" : "positive"}
          icon={AlertTriangle}
          iconColor="text-destructive"
          iconBgColor="bg-destructive/10"
        />
        <StatCard
          title="Avg Attendance"
          value={`${avgAttendance}%`}
          change={avgAttendance >= 80 ? "Good attendance" : "Needs attention"}
          changeType={avgAttendance >= 80 ? "positive" : "negative"}
          icon={BookOpen}
          iconColor="text-warning"
          iconBgColor="bg-warning/10"
        />
        <StatCard
          title="Low Risk"
          value={students.filter(s => s.riskLevel === 'Very Low' || s.riskLevel === 'Low').length}
          change="Students performing well"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-success"
          iconBgColor="bg-success/10"
        />
      </div>

      {totalStudents > 0 ? (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <PerformanceTrendChart />
            <RiskDistributionChart students={students} />
          </div>

          {/* At-Risk Students */}
          <AtRiskList students={students} />
        </>
      ) : (
        <div className="stat-card text-center py-16">
          <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-xl font-semibold mb-2">No Student Data Yet</h3>
          <p className="text-muted-foreground mb-4">
            Upload a CSV file with student information to see analytics and predictions.
          </p>
          <a href="/upload" className="text-primary hover:underline">
            Go to Upload Page →
          </a>
        </div>
      )}
    </Layout>
  );
}
