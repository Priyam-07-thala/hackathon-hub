import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, Eye, MoreVertical } from 'lucide-react';
import { Student } from '@/data/sampleStudents';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface StudentCardProps {
  student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
  const TrendIcon =
    student.trend === 'improving'
      ? TrendingUp
      : student.trend === 'declining'
      ? TrendingDown
      : Minus;

  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">
              {student.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{student.name}</h3>
            <p className="text-sm text-muted-foreground">
              {student.rollNo} • {student.class}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Send Message</DropdownMenuItem>
            <DropdownMenuItem>Generate Report</DropdownMenuItem>
            <DropdownMenuItem>Add Note</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Attendance</p>
          <div className="flex items-center gap-2">
            <Progress value={student.attendance} className="h-2 flex-1" />
            <span className="text-sm font-medium">{student.attendance}%</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Avg Marks</p>
          <div className="flex items-center gap-2">
            <Progress value={student.avgMarks} className="h-2 flex-1" />
            <span className="text-sm font-medium">{student.avgMarks}%</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge
            className={cn(
              'font-medium',
              student.riskLevel === 'Very Low' && 'risk-badge-very-low',
              student.riskLevel === 'Low' && 'risk-badge-low',
              student.riskLevel === 'Medium' && 'risk-badge-medium',
              student.riskLevel === 'High' && 'risk-badge-high'
            )}
          >
            {student.riskLevel} Risk
          </Badge>
          <div
            className={cn(
              'flex items-center gap-1 text-xs',
              student.trend === 'improving' && 'text-success',
              student.trend === 'declining' && 'text-destructive',
              student.trend === 'stable' && 'text-muted-foreground'
            )}
          >
            <TrendIcon className="w-3 h-3" />
            {student.trend}
          </div>
        </div>
        <Link to={`/students/${student.id}`}>
          <Button variant="ghost" size="sm" className="text-primary">
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
        </Link>
      </div>
    </div>
  );
}
