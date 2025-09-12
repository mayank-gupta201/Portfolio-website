import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ExternalLink, Edit2, Trash2, Github } from 'lucide-react';
import { useProjects, useDeleteProject, useUpdateProject } from '@/hooks/useProjects';

export const ProjectsManager = () => {
  const { data: projects = [], isLoading } = useProjects();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const [editOpen, setEditOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    technologies: [] as string[],
    github_url: '',
    demo_url: '',
  });
  const [newTechnology, setNewTechnology] = useState('');

  const onEdit = (project: any) => {
    setSelectedId(project.id);
    setForm({
      title: project.title || '',
      description: project.description || '',
      technologies: project.technologies || [],
      github_url: project.github_url || '',
      demo_url: project.demo_url || '',
    });
    setEditOpen(true);
  };

  const addTechnology = () => {
    if (newTechnology.trim() && !form.technologies.includes(newTechnology.trim())) {
      setForm({ ...form, technologies: [...form.technologies, newTechnology.trim()] });
      setNewTechnology('');
    }
  };

  const removeTechnology = (tech: string) => {
    setForm({ ...form, technologies: form.technologies.filter(t => t !== tech) });
  };

  const onSave = async () => {
    if (!selectedId) return;
    await updateMutation.mutateAsync({
      id: selectedId,
      updates: {
        title: form.title,
        description: form.description,
        technologies: form.technologies,
        github_url: form.github_url || null,
        demo_url: form.demo_url || null,
      },
    });
    setEditOpen(false);
  };

  const onDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  if (isLoading) return null;

  return (
    <section aria-labelledby="projects-manager-heading">
      <header className="mb-4">
        <h2 id="projects-manager-heading" className="text-xl font-semibold">Existing Projects</h2>
      </header>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Technologies</TableHead>
              <TableHead>Links</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">No projects yet.</TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{project.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {project.github_url && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => window.open(project.github_url!, '_blank')}
                        >
                          <Github className="w-4 h-4" />
                        </Button>
                      )}
                      {project.demo_url && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => window.open(project.demo_url!, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(project)} aria-label={`Edit ${project.title}`}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label={`Delete ${project.title}`}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete project?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently remove the project.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(project.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update the project details and save your changes.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Technologies</Label>
              <div className="flex gap-2">
                <Input
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  placeholder="Add a technology"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                />
                <Button type="button" onClick={addTechnology} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="cursor-pointer" onClick={() => removeTechnology(tech)}>
                    {tech} ×
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input id="github_url" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="demo_url">Demo URL</Label>
                <Input id="demo_url" value={form.demo_url} onChange={(e) => setForm({ ...form, demo_url: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={onSave} disabled={updateMutation.isPending}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ProjectsManager;