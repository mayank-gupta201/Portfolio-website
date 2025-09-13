-- Add currently_learning and currently_working columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN currently_learning text[] DEFAULT '{}',
ADD COLUMN currently_working text[] DEFAULT '{}';