-- Create message types enum
CREATE TYPE public.message_type AS ENUM ('alert', 'recommendation', 'general');

-- Create messages table for teacher-to-student communication
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  message_type message_type NOT NULL DEFAULT 'general',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Teachers can send messages (insert)
CREATE POLICY "Teachers can send messages"
ON public.messages
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'teacher'::app_role) AND auth.uid() = sender_id);

-- Teachers can view all messages they sent
CREATE POLICY "Teachers can view sent messages"
ON public.messages
FOR SELECT
USING (has_role(auth.uid(), 'teacher'::app_role) AND auth.uid() = sender_id);

-- Students can view messages sent to them
CREATE POLICY "Students can view their messages"
ON public.messages
FOR SELECT
USING (has_role(auth.uid(), 'student'::app_role) AND auth.uid() = recipient_id);

-- Students can update read status of their messages
CREATE POLICY "Students can mark messages as read"
ON public.messages
FOR UPDATE
USING (has_role(auth.uid(), 'student'::app_role) AND auth.uid() = recipient_id)
WITH CHECK (has_role(auth.uid(), 'student'::app_role) AND auth.uid() = recipient_id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_messages_updated_at
BEFORE UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;