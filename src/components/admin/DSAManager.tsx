import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, ExternalLink, Code2, Clock, Trophy } from 'lucide-react';
import { useDSAProblems, useDeleteDSAProblem, type DSAProblem } from '@/hooks/useDSAProblems';
import DSAForm from '@/components/forms/DSAForm';

const DSAManager = () => {
  const { data: problems, isLoading, error } = useDSAProblems();
  const deleteProblem = useDeleteDSAProblem();
  const [editingProblem, setEditingProblem] = useState<DSAProblem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await deleteProblem.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting DSA problem:', error);
    }
  };

  const handleEdit = (problem: DSAProblem) => {
    setEditingProblem(problem);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProblem(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Hard": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-destructive">Error loading DSA problems</p>
        </CardContent>
      </Card>
    );
  }

  if (!problems || problems.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-muted-foreground text-center">No DSA problems found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {problems.map((problem) => (
        <Card key={problem.id} className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-lg">{problem.title}</CardTitle>
                  {problem.problem_url && (
                    <a
                      href={problem.problem_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {problem.solved && (
                    <Trophy className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{problem.platform}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(problem)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete DSA Problem</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{problem.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(problem.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge 
                  variant="outline" 
                  className={`text-xs border ${getDifficultyColor(problem.difficulty)}`}
                >
                  {problem.difficulty}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {problem.category}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Time:</span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    {problem.time_complexity}
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Space:</span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    {problem.space_complexity}
                  </code>
                </div>
              </div>

              {problem.solution_url && (
                <div>
                  <a
                    href={problem.solution_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    View Solution <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {problem.notes && (
                <div>
                  <p className="text-xs text-muted-foreground italic">
                    {problem.notes}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <DSAForm 
        open={showForm} 
        onOpenChange={handleCloseForm}
        editingProblem={editingProblem}
      />
    </div>
  );
};

export default DSAManager;