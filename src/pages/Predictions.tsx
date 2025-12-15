import { useState } from 'react';
import { Brain, RefreshCw, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { sampleStudents, calculateRiskLevel } from '@/data/sampleStudents';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Predictions() {
  const [isRetraining, setIsRetraining] = useState(false);
  const [lastTrained, setLastTrained] = useState('2024-12-14 10:30 AM');

  const handleRetrain = () => {
    setIsRetraining(true);
    toast.info('Model retraining started...');
    
    setTimeout(() => {
      setIsRetraining(false);
      setLastTrained(new Date().toLocaleString());
      toast.success('Model retrained successfully!');
    }, 3000);
  };

  const sortedByRisk = [...sampleStudents].sort(
    (a, b) => b.riskProbability - a.riskProbability
  );

  return (
    <Layout title="Predictions" subtitle="ML-powered student risk predictions">
      {/* Model Status Card */}
      <div className="stat-card mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Risk Prediction Model</h3>
              <p className="text-muted-foreground">
                Random Forest Classifier • 4 Features • 92% Accuracy
              </p>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                Last trained: {lastTrained}
              </div>
            </div>
          </div>
          <Button
            onClick={handleRetrain}
            disabled={isRetraining}
            className="bg-primary hover:bg-primary/90"
          >
            <RefreshCw className={cn('w-4 h-4 mr-2', isRetraining && 'animate-spin')} />
            {isRetraining ? 'Retraining...' : 'Retrain Model'}
          </Button>
        </div>

        {/* Model Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground">Accuracy</p>
            <p className="text-2xl font-bold text-success">92%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Precision</p>
            <p className="text-2xl font-bold">89%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Recall</p>
            <p className="text-2xl font-bold">91%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">F1 Score</p>
            <p className="text-2xl font-bold">90%</p>
          </div>
        </div>
      </div>

      {/* Feature Weights */}
      <div className="stat-card mb-8">
        <h3 className="text-lg font-semibold mb-4">Feature Importance Weights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Average Marks</span>
              <span className="text-sm text-muted-foreground">35%</span>
            </div>
            <Progress value={35} className="h-3" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Attendance</span>
              <span className="text-sm text-muted-foreground">30%</span>
            </div>
            <Progress value={30} className="h-3" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Assignment Completion</span>
              <span className="text-sm text-muted-foreground">20%</span>
            </div>
            <Progress value={20} className="h-3" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Behavior Score</span>
              <span className="text-sm text-muted-foreground">15%</span>
            </div>
            <Progress value={15} className="h-3" />
          </div>
        </div>
      </div>

      {/* Predictions Table */}
      <div className="stat-card">
        <h3 className="text-lg font-semibold mb-4">All Predictions</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Avg Marks</TableHead>
                <TableHead>Assignments</TableHead>
                <TableHead>Behavior</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Probability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedByRisk.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.rollNo}</p>
                    </div>
                  </TableCell>
                  <TableCell>{student.attendance}%</TableCell>
                  <TableCell>{student.avgMarks}%</TableCell>
                  <TableCell>{student.assignmentCompletion}%</TableCell>
                  <TableCell>{student.behaviorScore}/10</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        student.riskLevel === 'Low' && 'risk-badge-low',
                        student.riskLevel === 'Medium' && 'risk-badge-medium',
                        student.riskLevel === 'High' && 'risk-badge-high'
                      )}
                    >
                      {student.riskLevel === 'Low' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {student.riskLevel === 'Medium' && <Clock className="w-3 h-3 mr-1" />}
                      {student.riskLevel === 'High' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {student.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={student.riskProbability}
                        className={cn(
                          'w-16 h-2',
                          student.riskProbability >= 60 && '[&>div]:bg-destructive',
                          student.riskProbability >= 30 && student.riskProbability < 60 && '[&>div]:bg-warning'
                        )}
                      />
                      <span className="text-sm">{student.riskProbability}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
