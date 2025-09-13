import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  bio: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  leetcode_url: string | null;
  avatar_url: string | null;
  frontend_skills: string[];
  backend_skills: string[];
  other_skills: string[];
  currently_learning: string[];
  currently_working: string[];
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProfile = async (userId?: string) => {
    // If no user is provided, try to get from auth context, or use the portfolio owner's ID
    const targetUserId = userId || user?.id || '0fef7352-c624-4a9b-8ff2-bf12f24fabc7';
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', targetUserId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data || null);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    try {
      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      let data;
      if (existingProfile) {
        // Update existing profile
        const { data: updatedData, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('user_id', user.id)
          .select()
          .single();
        
        if (error) throw error;
        data = updatedData;
      } else {
        // Insert new profile
        const { data: insertedData, error } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            ...updates,
          })
          .select()
          .single();
        
        if (error) throw error;
        data = insertedData;
      }

      setProfile(data);
      toast.success('Profile updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const uploadAvatar = async (file: File) => {
    console.log('uploadAvatar called with file:', file);
    if (!user) {
      console.log('No user found, cannot upload avatar');
      toast.error('Please sign in to upload avatar');
      return;
    }

    console.log('User found:', user.id);

    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;
      console.log('Uploading to:', fileName);

      toast.success('Uploading avatar...');

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful, getting public URL');

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      console.log('Public URL:', data.publicUrl);

      await updateProfile({ avatar_url: data.publicUrl });
      toast.success('Avatar updated successfully!');
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
      throw error;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  // Realtime subscription to profile changes so UI updates instantly
  useEffect(() => {
    const targetUserId = user?.id || '0fef7352-c624-4a9b-8ff2-bf12f24fabc7';

    const channel = supabase
      .channel(`profiles_changes_${targetUserId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `user_id=eq.${targetUserId}`,
      }, (payload) => {
        if (payload.eventType === 'DELETE') {
          setProfile(null);
        } else {
          setProfile(payload.new as Profile);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Expose fetchProfile function to allow fetching specific user profiles
  const fetchUserProfile = (userId: string) => fetchProfile(userId);

  return {
    profile,
    loading,
    updateProfile,
    uploadAvatar,
    refetch: fetchProfile,
    fetchUserProfile,
  };
};