import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface DSAProblem {
  id: string;
  user_id: string;
  title: string;
  platform: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  time_complexity: string;
  space_complexity: string;
  problem_url?: string;
  solution_url?: string;
  notes?: string;
  solved: boolean;
  created_at: string;
  updated_at: string;
}

export const useDSAProblems = () => {
  return useQuery({
    queryKey: ['dsa-problems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dsa_problems')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DSAProblem[];
    },
  });
};

export const useCreateDSAProblem = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (problem: Omit<DSAProblem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase
        .from('dsa_problems')
        .insert([{ ...problem, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dsa-problems'] });
      toast.success('DSA problem added successfully!');
    },
    onError: (error) => {
      console.error('Error creating DSA problem:', error);
      toast.error('Failed to add DSA problem');
    },
  });
};

export const useUpdateDSAProblem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Omit<DSAProblem, 'id' | 'user_id' | 'created_at' | 'updated_at'>> }) => {
      const { data, error } = await supabase
        .from('dsa_problems')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dsa-problems'] });
      toast.success('DSA problem updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating DSA problem:', error);
      toast.error('Failed to update DSA problem');
    },
  });
};

export const useDeleteDSAProblem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('dsa_problems')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dsa-problems'] });
      toast.success('DSA problem deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting DSA problem:', error);
      toast.error('Failed to delete DSA problem');
    },
  });
};