import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateProject, useUploadProjectImage } from '@/hooks/useProjects';
import { toast } from '@/hooks/use-toast';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  github_url: z.string().url('Invalid URL').or(z.literal('')),
  demo_url: z.string().url('Invalid URL').or(z.literal('')),
  image: z.any().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export const ProjectForm = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const createProject = useCreateProject();
  const uploadImage = useUploadProjectImage();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      technologies: [],
      github_url: '',
      demo_url: '',
    },
  });

  const technologies = watch('technologies') || [];

  const addTechnology = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setValue('technologies', [...technologies, techInput.trim()]);
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    setValue('technologies', technologies.filter(t => t !== tech));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a project',
        variant: 'destructive',
      });
      return;
    }

    try {
      let imageUrl = null;

      // Upload image if selected
      if (selectedFile) {
        imageUrl = await uploadImage.mutateAsync({
          file: selectedFile,
          userId: user.id,
        });
      }

      // Create project
      await createProject.mutateAsync({
        title: data.title,
        description: data.description,
        technologies: data.technologies,
        github_url: data.github_url || null,
        demo_url: data.demo_url || null,
        image_url: imageUrl,
      });

      // Reset form and close dialog
      reset();
      setSelectedFile(null);
      setImagePreview(null);
      setTechInput('');
      setOpen(false);
    } catch (error: any) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hero-gradient text-white shadow-card hover:shadow-hover transition-all duration-300">
          <Plus className="w-4 h-4 mr-2" />
          Add New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Project Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-w-xs h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Project title"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Project description"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              {/* Technologies */}
              <div className="space-y-2">
                <Label>Technologies</Label>
                <div className="flex gap-2">
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="Add a technology"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTechnology();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTechnology} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1"
                        onClick={() => removeTechnology(tech)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                {errors.technologies && (
                  <p className="text-sm text-destructive">{errors.technologies.message}</p>
                )}
              </div>

              {/* GitHub URL */}
              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub URL (optional)</Label>
                <Input
                  id="github_url"
                  {...register('github_url')}
                  placeholder="https://github.com/username/repo"
                />
                {errors.github_url && (
                  <p className="text-sm text-destructive">{errors.github_url.message}</p>
                )}
              </div>

              {/* Demo URL */}
              <div className="space-y-2">
                <Label htmlFor="demo_url">Demo URL (optional)</Label>
                <Input
                  id="demo_url"
                  {...register('demo_url')}
                  placeholder="https://your-demo.com"
                />
                {errors.demo_url && (
                  <p className="text-sm text-destructive">{errors.demo_url.message}</p>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    reset();
                    setSelectedFile(null);
                    setImagePreview(null);
                    setTechInput('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="hero-gradient text-white"
                  disabled={createProject.isPending || uploadImage.isPending}
                >
                  {createProject.isPending || uploadImage.isPending
                    ? 'Creating...'
                    : 'Create Project'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};