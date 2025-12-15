import { Users, AlertTriangle, TrendingUp, BookOpen } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { StatCard } from '@/components/dashboard/StatCard';
import { RiskDistributionChart } from '@/components/dashboard/RiskDistributionChart';
import { PerformanceTrendChart } from '@/components/dashboard/PerformanceTrendChart';
import { AtRiskList } from '@/components/dashboard/AtRiskList';
import { sampleStudents } from '@/data/sampleStudents';

export default function Dashboard() {
  const totalStudents = sampleStudents.length;
  const highRiskCount = sampleStudents.filter((s) => s.riskLevel === 'High').length;
  const avgAttendance = Math.round(
    sampleStudents.reduce((sum, s) => sum + s.attendance, 0) / totalStudents
  );
  const improvingCount = sampleStudents.filter((s) => s.trend === 'improving').length;

  return (
    <Layout
      title="Dashboard"
      subtitle={`Welcome back! Here's an overview of your class performance.`}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={totalStudents}
          change="+2 this semester"
          changeType="positive"
          icon={Users}
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
        />
        <StatCard
          title="At-Risk Students"
          value={highRiskCount}
          change="2 more than last month"
          changeType="negative"
          icon={AlertTriangle}
          iconColor="text-destructive"
          iconBgColor="bg-destructive/10"
        />
        <StatCard
          title="Avg Attendance"
          value={`${avgAttendance}%`}
          change="-3% from last week"
          changeType="negative"
          icon={BookOpen}
          iconColor="text-warning"
          iconBgColor="bg-warning/10"
        />
        <StatCard
          title="Improving"
          value={improvingCount}
          change="3 students showing progress"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-success"
          iconBgColor="bg-success/10"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PerformanceTrendChart />
        <RiskDistributionChart students={sampleStudents} />
      </div>

      {/* At-Risk Students */}
      <AtRiskList students={sampleStudents} />
    </Layout>
  );
}
