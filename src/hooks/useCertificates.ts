import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credential_id: string | null;
  image_url: string | null;
  verification_url: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useCertificates = () => {
  return useQuery({
    queryKey: ['certificates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching certificates:', error);
        throw error;
      }

      return data as Certificate[];
    },
  });
};

export const useCreateCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (certificate: Omit<Certificate, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('certificates')
        .insert([{ ...certificate, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast({
        title: "Success",
        description: "Certificate added successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add certificate",
        variant: "destructive",
      });
    },
  });
};

export const useUploadCertificateImage = () => {
  return useMutation({
    mutationFn: async ({ file, userId }: { file: File; userId: string }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('certificates')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('certificates')
        .getPublicUrl(fileName);

      return publicUrl;
    },
    onError: (error: any) => {
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Omit<Certificate, 'id' | 'user_id' | 'created_at' | 'updated_at'>> }) => {
      const { data, error } = await supabase
        .from('certificates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast({
        title: 'Updated',
        description: 'Certificate updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update certificate',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast({
        title: 'Deleted',
        description: 'Certificate deleted successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete certificate',
        variant: 'destructive',
      });
    },
  });
};