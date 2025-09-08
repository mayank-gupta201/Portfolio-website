import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Upload, User } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const profileSchema = z.object({
  display_name: z.string().min(1, 'Display name is required'),
  bio: z.string().optional(),
  location: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  github_url: z.string().url().optional().or(z.literal('')),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  leetcode_url: z.string().url().optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfileForm = () => {
  const { user } = useAuth();
  const { profile, updateProfile, uploadAvatar } = useProfile();
  const [frontendSkills, setFrontendSkills] = useState<string[]>(profile?.frontend_skills || ['React & TypeScript', 'Next.js', 'Tailwind CSS']);
  const [backendSkills, setBackendSkills] = useState<string[]>(profile?.backend_skills || ['Node.js', 'Python', 'PostgreSQL']);
  const [newFrontendSkill, setNewFrontendSkill] = useState('');
  const [newBackendSkill, setNewBackendSkill] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: profile?.display_name || 'Mayank Gupta',
      bio: profile?.bio || "I'm a passionate developer with expertise in modern web technologies. I love creating beautiful, functional applications that solve real-world problems and provide exceptional user experiences.",
      location: profile?.location || 'Gwalior, M.P., India',
      email: profile?.email || 'mayankgoyal3005@gmail.com',
      phone: profile?.phone || '+919098488654',
      github_url: profile?.github_url || 'https://github.com/mayank-gupta201',
      linkedin_url: profile?.linkedin_url || 'https://www.linkedin.com/in/mayank-gupta-8151bb273/',
      leetcode_url: profile?.leetcode_url || 'https://leetcode.com/u/mayank_gupta201/',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile({
        ...data,
        frontend_skills: frontendSkills,
        backend_skills: backendSkills,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      await uploadAvatar(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  const addFrontendSkill = () => {
    if (newFrontendSkill.trim() && !frontendSkills.includes(newFrontendSkill.trim())) {
      setFrontendSkills([...frontendSkills, newFrontendSkill.trim()]);
      setNewFrontendSkill('');
    }
  };

  const addBackendSkill = () => {
    if (newBackendSkill.trim() && !backendSkills.includes(newBackendSkill.trim())) {
      setBackendSkills([...backendSkills, newBackendSkill.trim()]);
      setNewBackendSkill('');
    }
  };

  const removeFrontendSkill = (skill: string) => {
    setFrontendSkills(frontendSkills.filter(s => s !== skill));
  };

  const removeBackendSkill = (skill: string) => {
    setBackendSkills(backendSkills.filter(s => s !== skill));
  };

  if (!user) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Please sign in to edit your profile.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-card border-0">
      <CardHeader>
        <CardTitle className="text-2xl">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-brand-primary/20">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-primary/10 flex items-center justify-center">
                    <User className="w-12 h-12 text-brand-primary" />
                  </div>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 rounded-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="display_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[100px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="github_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://github.com/username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="linkedin_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://linkedin.com/in/username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="leetcode_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LeetCode URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://leetcode.com/username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Skills Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-brand-primary mb-2">Frontend Skills</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {frontendSkills.map(skill => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-destructive" 
                          onClick={() => removeFrontendSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newFrontendSkill}
                      onChange={(e) => setNewFrontendSkill(e.target.value)}
                      placeholder="Add frontend skill"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFrontendSkill())}
                    />
                    <Button type="button" size="sm" onClick={addFrontendSkill}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-brand-primary mb-2">Backend Skills</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {backendSkills.map(skill => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-destructive" 
                          onClick={() => removeBackendSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newBackendSkill}
                      onChange={(e) => setNewBackendSkill(e.target.value)}
                      placeholder="Add backend skill"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBackendSkill())}
                    />
                    <Button type="button" size="sm" onClick={addBackendSkill}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full hero-gradient text-white">
                Save Profile
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};