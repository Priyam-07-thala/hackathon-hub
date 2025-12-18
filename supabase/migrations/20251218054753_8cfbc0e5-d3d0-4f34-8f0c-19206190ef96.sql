-- Allow students to send messages to teachers
CREATE POLICY "Students can send messages"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'student'::app_role) 
  AND auth.uid() = sender_id
);

-- Allow students to view their sent messages
CREATE POLICY "Students can view their sent messages"
ON public.messages
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'student'::app_role) 
  AND auth.uid() = sender_id
);

-- Allow teachers to view messages sent to them
CREATE POLICY "Teachers can view received messages"
ON public.messages
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'teacher'::app_role) 
  AND auth.uid() = recipient_id
);