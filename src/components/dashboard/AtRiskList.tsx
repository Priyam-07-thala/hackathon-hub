import { Link } from 'react-router-dom';
import { AlertTriangle, TrendingDown, MessageSquare, Eye } from 'lucide-react';
import { Student } from '@/data/sampleStudents';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AtRiskListProps {
  students: Student[];
}

export function AtRiskList({ students }: AtRiskListProps) {
  const atRiskStudents = students
    .filter((s) => s.riskLevel === 'High' || s.riskLevel === 'Medium')
    .sort((a, b) => b.riskProbability - a.riskProbability)
    .slice(0, 5);

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">At-Risk Students</h3>
        <Link to="/students">
          <Button variant="ghost" size="sm" className="text-primary">
            View All
          </Button>
        </Link>
      </div>
      <div className="space-y-3">
        {atRiskStudents.map((student, index) => (
          <div
            key={student.id}
            className={cn(
              'flex items-center justify-between p-4 rounded-xl bg-secondary/50 animate-slide-up',
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  student.riskLevel === 'High' ? 'bg-destructive/20' : 'bg-warning/20'
                )}
              >
                <AlertTriangle
                  className={cn(
                    'w-5 h-5',
                    student.riskLevel === 'High' ? 'text-destructive' : 'text-warning'
                  )}
                />
              </div>
              <div>
                <p className="font-medium text-foreground">{student.name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{student.class}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    {student.trend}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                className={cn(
                  'font-medium',
                  student.riskLevel === 'High' ? 'risk-badge-high' : 'risk-badge-medium'
                )}
              >
                {student.riskProbability}% Risk
              </Badge>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Link to={`/students/${student.id}`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
