import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateDSAProblem, useUpdateDSAProblem, type DSAProblem } from '@/hooks/useDSAProblems';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const dsaSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  platform: z.string().min(1, 'Platform is required'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  category: z.string().min(1, 'Category is required'),
  time_complexity: z.string().min(1, 'Time complexity is required'),
  space_complexity: z.string().min(1, 'Space complexity is required'),
  problem_url: z.string().url().optional().or(z.literal('')),
  solution_url: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
  solved: z.boolean(),
});

type DSAFormValues = z.infer<typeof dsaSchema>;

interface DSAFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProblem?: DSAProblem | null;
}

export default function DSAForm({ open, onOpenChange, editingProblem }: DSAFormProps) {
  const { user } = useAuth();
  const createDSAProblem = useCreateDSAProblem();
  const updateDSAProblem = useUpdateDSAProblem();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DSAFormValues>({
    resolver: zodResolver(dsaSchema),
    defaultValues: {
      title: '',
      platform: '',
      difficulty: 'Easy',
      category: '',
      time_complexity: '',
      space_complexity: '',
      problem_url: '',
      solution_url: '',
      notes: '',
      solved: false,
    },
  });

  // Reset form when editing problem changes
  useEffect(() => {
    if (editingProblem) {
      form.reset({
        title: editingProblem.title,
        platform: editingProblem.platform,
        difficulty: editingProblem.difficulty,
        category: editingProblem.category,
        time_complexity: editingProblem.time_complexity,
        space_complexity: editingProblem.space_complexity,
        problem_url: editingProblem.problem_url || '',
        solution_url: editingProblem.solution_url || '',
        notes: editingProblem.notes || '',
        solved: editingProblem.solved,
      });
    } else {
      form.reset({
        title: '',
        platform: '',
        difficulty: 'Easy',
        category: '',
        time_complexity: '',
        space_complexity: '',
        problem_url: '',
        solution_url: '',
        notes: '',
        solved: false,
      });
    }
  }, [editingProblem, form]);

  const onSubmit = async (values: DSAFormValues) => {
    if (!user) {
      toast.error('You must be logged in to manage DSA problems');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingProblem) {
        // Update existing problem
        await updateDSAProblem.mutateAsync({
          id: editingProblem.id,
          updates: {
            title: values.title,
            platform: values.platform,
            difficulty: values.difficulty,
            category: values.category,
            time_complexity: values.time_complexity,
            space_complexity: values.space_complexity,
            problem_url: values.problem_url || undefined,
            solution_url: values.solution_url || undefined,
            notes: values.notes || undefined,
            solved: values.solved,
          },
        });
      } else {
        // Create new problem
        await createDSAProblem.mutateAsync({
          title: values.title,
          platform: values.platform,
          difficulty: values.difficulty,
          category: values.category,
          time_complexity: values.time_complexity,
          space_complexity: values.space_complexity,
          problem_url: values.problem_url || undefined,
          solution_url: values.solution_url || undefined,
          notes: values.notes || undefined,
          solved: values.solved,
        });
      }
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving DSA problem:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingProblem ? 'Edit DSA Problem' : 'Add DSA Problem'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Problem Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Two Sum" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <FormControl>
                    <Input placeholder="LeetCode" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Arrays & Hashing" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time_complexity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Complexity</FormLabel>
                  <FormControl>
                    <Input placeholder="O(n)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="space_complexity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Space Complexity</FormLabel>
                  <FormControl>
                    <Input placeholder="O(1)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="problem_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Problem URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://leetcode.com/problems/two-sum/" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="solution_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Solution URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/username/solutions" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional notes about the solution..." 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="solved"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Solved</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Mark as solved if you've completed this problem
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (editingProblem ? 'Updating...' : 'Adding...') 
                  : (editingProblem ? 'Update Problem' : 'Add Problem')
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}