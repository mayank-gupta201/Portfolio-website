import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, Edit2, Trash2 } from 'lucide-react';
import { useCertificates, useDeleteCertificate, useUpdateCertificate } from '@/hooks/useCertificates';

export const CertificatesManager = () => {
  const { data: certificates = [], isLoading } = useCertificates();
  const updateMutation = useUpdateCertificate();
  const deleteMutation = useDeleteCertificate();

  const [editOpen, setEditOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    issuer: '',
    date: '',
    credential_id: '',
    verification_url: '',
  });

  const onEdit = (cert: any) => {
    setSelectedId(cert.id);
    setForm({
      title: cert.title || '',
      issuer: cert.issuer || '',
      date: cert.date || '',
      credential_id: cert.credential_id || '',
      verification_url: cert.verification_url || '',
    });
    setEditOpen(true);
  };

  const onSave = async () => {
    if (!selectedId) return;
    await updateMutation.mutateAsync({
      id: selectedId,
      updates: {
        title: form.title,
        issuer: form.issuer,
        date: form.date,
        credential_id: form.credential_id || null,
        verification_url: form.verification_url || null,
      },
    });
    setEditOpen(false);
  };

  const onDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  if (isLoading) return null;

  return (
    <section aria-labelledby="certificates-manager-heading">
      <header className="mb-4">
        <h2 id="certificates-manager-heading" className="text-xl font-semibold">Existing Certificates</h2>
      </header>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Issuer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Credential ID</TableHead>
              <TableHead>Verify</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certificates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">No certificates yet.</TableCell>
              </TableRow>
            ) : (
              certificates.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell className="font-medium">{cert.title}</TableCell>
                  <TableCell>{cert.issuer}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{cert.date}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{cert.credential_id || '-'}</TableCell>
                  <TableCell>
                    {cert.verification_url ? (
                      <Button variant="outline" size="sm" onClick={() => window.open(cert.verification_url!, '_blank')}>
                        <ExternalLink className="w-4 h-4 mr-2" /> Verify
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(cert)} aria-label={`Edit ${cert.title}`}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label={`Delete ${cert.title}`}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete certificate?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently remove the certificate.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(cert.id)}>Delete</AlertDialogAction>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Certificate</DialogTitle>
            <DialogDescription>Update the details and save your changes.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issuer">Issuer</Label>
              <Input id="issuer" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credential_id">Credential ID</Label>
              <Input id="credential_id" value={form.credential_id} onChange={(e) => setForm({ ...form, credential_id: e.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="verification_url">Verification URL</Label>
              <Input id="verification_url" value={form.verification_url} onChange={(e) => setForm({ ...form, verification_url: e.target.value })} />
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

export default CertificatesManager;