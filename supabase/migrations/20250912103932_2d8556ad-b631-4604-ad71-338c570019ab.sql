-- Add other_skills column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN other_skills TEXT[] DEFAULT '{}'::text[];