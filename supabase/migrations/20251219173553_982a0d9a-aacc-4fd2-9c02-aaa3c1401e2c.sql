-- Create student_data table for uploaded CSV data
CREATE TABLE public.student_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_email TEXT NOT NULL,
  name TEXT NOT NULL,
  roll_no TEXT,
  class TEXT,
  attendance NUMERIC NOT NULL DEFAULT 0,
  avg_marks NUMERIC NOT NULL DEFAULT 0,
  assignment_completion NUMERIC NOT NULL DEFAULT 0,
  behavior_score NUMERIC NOT NULL DEFAULT 0,
  risk_level TEXT NOT NULL DEFAULT 'Medium',
  risk_probability NUMERIC NOT NULL DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(teacher_id, student_email)
);

-- Enable RLS
ALTER TABLE public.student_data ENABLE ROW LEVEL SECURITY;

-- Teachers can view all their uploaded student data
CREATE POLICY "Teachers can view their student data"
ON public.student_data
FOR SELECT
USING (has_role(auth.uid(), 'teacher'::app_role) AND teacher_id = auth.uid());

-- Teachers can insert student data
CREATE POLICY "Teachers can insert student data"
ON public.student_data
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'teacher'::app_role) AND teacher_id = auth.uid());

-- Teachers can update their student data
CREATE POLICY "Teachers can update their student data"
ON public.student_data
FOR UPDATE
USING (has_role(auth.uid(), 'teacher'::app_role) AND teacher_id = auth.uid());

-- Teachers can delete their student data
CREATE POLICY "Teachers can delete their student data"
ON public.student_data
FOR DELETE
USING (has_role(auth.uid(), 'teacher'::app_role) AND teacher_id = auth.uid());

-- Students can view their own data (matched by email)
CREATE POLICY "Students can view their own data"
ON public.student_data
FOR SELECT
USING (
  has_role(auth.uid(), 'student'::app_role) AND 
  student_email = (SELECT email FROM public.profiles WHERE user_id = auth.uid())
);

-- Create trigger for updated_at
CREATE TRIGGER update_student_data_updated_at
BEFORE UPDATE ON public.student_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();