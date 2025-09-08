import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateCertificate, useUploadCertificateImage } from '@/hooks/useCertificates';
import { toast } from '@/hooks/use-toast';

const certificateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  date: z.string().min(1, 'Date is required'),
  credential_id: z.string().optional(),
  verification_url: z.string().url('Invalid URL').or(z.literal('')),
  image: z.any().optional(),
});

type CertificateFormData = z.infer<typeof certificateSchema>;

export const CertificateForm = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const createCertificate = useCreateCertificate();
  const uploadImage = useUploadCertificateImage();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      title: '',
      issuer: '',
      date: '',
      credential_id: '',
      verification_url: '',
    },
  });

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

  const onSubmit = async (data: CertificateFormData) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a certificate',
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

      // Create certificate
      await createCertificate.mutateAsync({
        title: data.title,
        issuer: data.issuer,
        date: data.date,
        credential_id: data.credential_id || null,
        verification_url: data.verification_url || null,
        image_url: imageUrl,
      });

      // Reset form and close dialog
      reset();
      setSelectedFile(null);
      setImagePreview(null);
      setOpen(false);
    } catch (error: any) {
      console.error('Error creating certificate:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hero-gradient text-white shadow-card hover:shadow-hover transition-all duration-300">
          <Plus className="w-4 h-4 mr-2" />
          Add New Certificate
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add New Certificate</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Certificate Image</Label>
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
                <Label htmlFor="title">Certificate Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="e.g., AWS Certified Developer"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              {/* Issuer */}
              <div className="space-y-2">
                <Label htmlFor="issuer">Issuer</Label>
                <Input
                  id="issuer"
                  {...register('issuer')}
                  placeholder="e.g., Amazon Web Services"
                />
                {errors.issuer && (
                  <p className="text-sm text-destructive">{errors.issuer.message}</p>
                )}
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Date Issued</Label>
                <Input
                  id="date"
                  {...register('date')}
                  placeholder="e.g., 2024"
                />
                {errors.date && (
                  <p className="text-sm text-destructive">{errors.date.message}</p>
                )}
              </div>

              {/* Credential ID */}
              <div className="space-y-2">
                <Label htmlFor="credential_id">Credential ID (optional)</Label>
                <Input
                  id="credential_id"
                  {...register('credential_id')}
                  placeholder="e.g., AWS-DEV-2024-001"
                />
                {errors.credential_id && (
                  <p className="text-sm text-destructive">{errors.credential_id.message}</p>
                )}
              </div>

              {/* Verification URL */}
              <div className="space-y-2">
                <Label htmlFor="verification_url">Verification URL (optional)</Label>
                <Input
                  id="verification_url"
                  {...register('verification_url')}
                  placeholder="https://verification-url.com"
                />
                {errors.verification_url && (
                  <p className="text-sm text-destructive">{errors.verification_url.message}</p>
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
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="hero-gradient text-white"
                  disabled={createCertificate.isPending || uploadImage.isPending}
                >
                  {createCertificate.isPending || uploadImage.isPending
                    ? 'Creating...'
                    : 'Create Certificate'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};