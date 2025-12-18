import { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Minus, 
  AlertCircle, Lightbulb, MessageSquare, 
  BookOpen, CheckCircle2, Clock, Target, Send
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { sampleStudents, Student } from '@/data/sampleStudents';
import { toast } from 'sonner';

interface Message {
  id: string;
  subject: string;
  content: string;
  message_type: 'alert' | 'recommendation' | 'general';
  is_read: boolean;
  created_at: string;
  sender_id: string;
  recipient_id: string;
}

export default function StudentDashboard() {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [newSubject, setNewSubject] = useState('');
  const [newContent, setNewContent] = useState('');
  const [sending, setSending] = useState(false);
  const [teachers, setTeachers] = useState<{ id: string; full_name: string }[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');

  useEffect(() => {
    if (user) {
      fetchMessages();
      fetchTeachers();
      // For demo, use sample data
      const demoStudent = sampleStudents.find(s => s.email === profile?.email) || sampleStudents[2];
      setStudentData(demoStudent);
    }
  }, [user, profile]);

  // Real-time subscription for new messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('student-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          setMessages(prev => [payload.new as Message, ...prev]);
          toast.info('New message from teacher!');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchMessages = async () => {
    if (!user) return;

    const { data: received } = await supabase
      .from('messages')
      .select('*')
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false });

    if (received) setMessages(received as Message[]);

    const { data: sent } = await supabase
      .from('messages')
      .select('*')
      .eq('sender_id', user.id)
      .order('created_at', { ascending: false });

    if (sent) setSentMessages(sent as Message[]);
  };

  const fetchTeachers = async () => {
    const { data } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'teacher');

    if (data && data.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', data.map(d => d.user_id));

      if (profiles) {
        setTeachers(profiles.map(p => ({ id: p.user_id, full_name: p.full_name || 'Teacher' })));
      }
    }
  };

  const sendMessage = async () => {
    if (!user || !newSubject.trim() || !newContent.trim() || !selectedTeacher) {
      toast.error('Please fill in all fields and select a teacher');
      return;
    }

    setSending(true);
    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      recipient_id: selectedTeacher,
      subject: newSubject.trim(),
      content: newContent.trim(),
      message_type: 'general'
    });

    setSending(false);
    if (error) {
      toast.error('Failed to send message');
    } else {
      toast.success('Message sent to teacher!');
      setNewSubject('');
      setNewContent('');
      setSelectedTeacher('');
      fetchMessages();
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
      case 'Very Low': return 'risk-badge-very-low';
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
      subtitle={`Welcome back, ${profile?.full_name || 'Student'}!`}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <Card className="glass-card">
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

        {/* Messaging Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Messages
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount} new
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="inbox" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="inbox">Inbox</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
                <TabsTrigger value="compose">Compose</TabsTrigger>
              </TabsList>

              <TabsContent value="inbox" className="mt-4">
                {messages.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>No messages yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        onClick={() => !msg.is_read && markAsRead(msg.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          msg.is_read 
                            ? 'bg-secondary/30 border-border/50' 
                            : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {getMessageIcon(msg.message_type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h4 className="font-medium text-sm truncate">{msg.subject}</h4>
                              {!msg.is_read && <Badge variant="secondary" className="text-xs">New</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{msg.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(msg.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sent" className="mt-4">
                {sentMessages.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Send className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>No sent messages</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {sentMessages.map((msg) => (
                      <div key={msg.id} className="p-3 rounded-lg border bg-secondary/30 border-border/50">
                        <div className="flex items-start gap-2">
                          <Send className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{msg.subject}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">{msg.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(msg.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="compose" className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">To (Teacher)</label>
                  <select
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    className="w-full p-2 rounded-md border bg-background text-foreground"
                  >
                    <option value="">Select a teacher...</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>{t.full_name}</option>
                    ))}
                  </select>
                </div>
                <Input
                  placeholder="Subject"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                />
                <Textarea
                  placeholder="Write your message..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                />
                <Button onClick={sendMessage} disabled={sending} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  {sending ? 'Sending...' : 'Send Message'}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}