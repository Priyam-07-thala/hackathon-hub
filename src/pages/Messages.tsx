import { useState, useEffect } from 'react';
import { Send, MessageSquare, AlertCircle, Lightbulb, Check } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  subject: string;
  content: string;
  message_type: 'alert' | 'recommendation' | 'general';
  created_at: string;
  recipient_id: string;
  recipient_name?: string;
}

interface StudentProfile {
  user_id: string;
  full_name: string;
  email: string;
}

export default function Messages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [messageType, setMessageType] = useState<'alert' | 'recommendation' | 'general'>('general');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchSentMessages();
  }, []);

  const fetchStudents = async () => {
    // Fetch all student profiles
    const { data: studentRoles } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'student');

    if (studentRoles && studentRoles.length > 0) {
      const studentIds = studentRoles.map(r => r.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .in('user_id', studentIds);
      
      if (profiles) {
        // Transform to handle null values
        const transformedProfiles: StudentProfile[] = profiles.map(p => ({
          user_id: p.user_id,
          full_name: p.full_name || 'Unknown Student',
          email: p.email || ''
        }));
        setStudents(transformedProfiles);
      }
    }
  };

  const fetchSentMessages = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('sender_id', user.id)
      .order('created_at', { ascending: false });
    
    if (data) {
      // Map recipient names
      const messagesWithNames = await Promise.all(
        data.map(async (msg) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', msg.recipient_id)
            .maybeSingle();
          return {
            ...msg,
            recipient_name: profile?.full_name || 'Unknown Student'
          };
        })
      );
      setSentMessages(messagesWithNames as Message[]);
    }
  };

  const handleSendMessage = async () => {
    if (!user || !selectedStudent || !subject || !content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before sending.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        recipient_id: selectedStudent,
        subject,
        content,
        message_type: messageType
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully."
      });
      setSubject('');
      setContent('');
      setSelectedStudent('');
      setMessageType('general');
      fetchSentMessages();
    }
    
    setIsLoading(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'recommendation': return <Lightbulb className="h-4 w-4 text-warning" />;
      default: return <MessageSquare className="h-4 w-4 text-primary" />;
    }
  };

  const getTypeBadgeVariant = (type: string): "destructive" | "secondary" | "outline" => {
    switch (type) {
      case 'alert': return 'destructive';
      case 'recommendation': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Layout
      title="Messages"
      subtitle="Send alerts and recommendations to students"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compose Message */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Compose Message
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Select Student
              </label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student..." />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.user_id} value={student.user_id}>
                      {student.full_name || student.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Message Type
              </label>
              <Select value={messageType} onValueChange={(v) => setMessageType(v as 'alert' | 'recommendation' | 'general')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      General
                    </div>
                  </SelectItem>
                  <SelectItem value="alert">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      Alert
                    </div>
                  </SelectItem>
                  <SelectItem value="recommendation">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-warning" />
                      Recommendation
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Subject
              </label>
              <Input
                placeholder="Enter message subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Message Content
              </label>
              <Textarea
                placeholder="Type your message here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
              />
            </div>

            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? 'Sending...' : 'Send Message'}
            </Button>
          </CardContent>
        </Card>

        {/* Sent Messages */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-success" />
              Sent Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sentMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No messages sent yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {sentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 rounded-lg bg-secondary/50 border border-border/50"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(msg.message_type)}
                        <span className="font-medium text-sm">{msg.subject}</span>
                      </div>
                      <Badge variant={getTypeBadgeVariant(msg.message_type)}>
                        {msg.message_type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {msg.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>To: {msg.recipient_name}</span>
                      <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
