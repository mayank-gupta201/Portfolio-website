-- Create table for DSA problems and solutions
CREATE TABLE public.dsa_problems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  platform TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  category TEXT NOT NULL,
  time_complexity TEXT NOT NULL,
  space_complexity TEXT NOT NULL,
  problem_url TEXT,
  solution_url TEXT,
  notes TEXT,
  solved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.dsa_problems ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "DSA problems are viewable by everyone" 
ON public.dsa_problems 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own DSA problems" 
ON public.dsa_problems 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own DSA problems" 
ON public.dsa_problems 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own DSA problems" 
ON public.dsa_problems 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_dsa_problems_updated_at
BEFORE UPDATE ON public.dsa_problems
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();