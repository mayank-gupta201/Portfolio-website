-- Create storage buckets for projects and certificates
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('projects', 'projects', true),
  ('certificates', 'certificates', true);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  github_url TEXT,
  demo_url TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  credential_id TEXT,
  image_url TEXT,
  verification_url TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for projects
CREATE POLICY "Projects are viewable by everyone" 
ON public.projects 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own projects" 
ON public.projects 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
ON public.projects 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
ON public.projects 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for certificates
CREATE POLICY "Certificates are viewable by everyone" 
ON public.certificates 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own certificates" 
ON public.certificates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own certificates" 
ON public.certificates 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own certificates" 
ON public.certificates 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create storage policies for projects bucket
CREATE POLICY "Project images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'projects');

CREATE POLICY "Users can upload their own project images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'projects' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own project images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'projects' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own project images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'projects' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for certificates bucket
CREATE POLICY "Certificate images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'certificates');

CREATE POLICY "Users can upload their own certificate images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own certificate images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own certificate images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_certificates_updated_at
  BEFORE UPDATE ON public.certificates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();