import { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Minus, 
  AlertCircle, Lightbulb, MessageSquare, 
  BookOpen, CheckCircle2, Clock, Target
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { sampleStudents, Student } from '@/data/sampleStudents';

interface Message {
  id: string;
  subject: string;
  content: string;
  message_type: 'alert' | 'recommendation' | 'general';
  is_read: boolean;
  created_at: string;
}

export default function StudentDashboard() {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [studentData, setStudentData] = useState<Student | null>(null);

  useEffect(() => {
    if (user) {
      fetchMessages();
      // For demo, use sample data - in production, this would come from the database
      const demoStudent = sampleStudents.find(s => s.email === profile?.email) || sampleStudents[2];
      setStudentData(demoStudent);
    }
  }, [user, profile]);

  const fetchMessages = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setMessages(data as Message[]);
    }
  };

  const markAsRead = async (messageId: string) => {
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId);
    
    setMessages(prev => 
      prev.map(m => m.id === messageId ? { ...m, is_read: true } : m)
    );
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'declining':
      case 'down':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRiskBadgeClass = (level: string) => {
    switch (level) {
      case 'Low': return 'risk-badge-low';
      case 'Medium': return 'risk-badge-medium';
      case 'High': return 'risk-badge-high';
      default: return '';
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'recommendation': return <Lightbulb className="h-5 w-5 text-warning" />;
      default: return <MessageSquare className="h-5 w-5 text-primary" />;
    }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  if (!studentData) {
    return (
      <Layout title="My Dashboard" subtitle="Loading your performance data...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="My Dashboard"
      subtitle={`Welcome back, ${profile?.full_name || 'Student'}! Here's your performance overview.`}
    >
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              {getTrendIcon(studentData.trend)}
            </div>
            <p className="text-sm text-muted-foreground mb-1">Average Score</p>
            <p className="text-2xl font-bold">{studentData.avgMarks}%</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Attendance</p>
            <p className="text-2xl font-bold">{studentData.attendance}%</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Assignments Done</p>
            <p className="text-2xl font-bold">{studentData.assignmentCompletion}%</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-accent/10">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <Badge className={getRiskBadgeClass(studentData.riskLevel)}>
                {studentData.riskLevel} Risk
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
            <p className="text-2xl font-bold">{studentData.riskProbability}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Performance */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Subject Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {studentData.subjects.map((subject) => (
              <div key={subject.subject}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{subject.subject}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {subject.score}/{subject.maxScore}
                    </span>
                    {getTrendIcon(subject.trend)}
                  </div>
                </div>
                <Progress 
                  value={(subject.score / subject.maxScore) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-warning" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studentData.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
                >
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <p className="text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages from Teachers */}
      <Card className="glass-card mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Messages from Teachers
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No messages yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => !msg.is_read && markAsRead(msg.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    msg.is_read 
                      ? 'bg-secondary/30 border-border/50' 
                      : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getMessageIcon(msg.message_type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">{msg.subject}</h4>
                        {!msg.is_read && (
                          <Badge variant="secondary" className="shrink-0">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {msg.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}