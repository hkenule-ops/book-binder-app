import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Loader2, BookOpen, Trash2, Search, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import type { Book, Category } from '@/types';

export default function ManageBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  const load = async () => {
    const [b, c] = await Promise.all([api.getAllBooks(), api.getCategories()]);
    if (b.data?.books) setBooks(b.data.books);
    if (c.data?.categories) setCategories(c.data.categories);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!title.trim() || !fileUrl.trim() || !categoryId) {
      toast.error('All fields are required'); return;
    }
    setCreating(true);
    const res = await api.addBook(title.trim(), fileUrl.trim(), categoryId);
    setCreating(false);
    if (res.success) {
      toast.success('Book added');
      setTitle(''); setFileUrl(''); setCategoryId(''); setOpen(false);
      load();
    } else toast.error(res.error || 'Failed');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this book?')) return;
    const res = await api.deleteBook(id);
    if (res.success) { toast.success('Deleted'); load(); }
    else toast.error(res.error || 'Failed');
  };

  const catName = (id: string) => categories.find((c) => c.id === id)?.name || id;

  const filtered = books
    .filter((b) => filterCat === 'all' || b.category_id === filterCat)
    .filter((b) => b.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin" style={{ color: '#0F6E56' }} /></div>;
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Books</h1>
          <p className="text-muted-foreground">Upload and manage learning materials</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button style={{ background: '#0F6E56', color: '#fff', border: 'none' }}>
              <Plus className="mr-2 h-4 w-4" />Add Book
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Book</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Book title" maxLength={200} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Google Drive Link</label>
                <Input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="https://drive.google.com/..." maxLength={500} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Course</label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreate} disabled={creating} className="w-full" style={{ background: '#0F6E56', color: '#fff', border: 'none' }}>
                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Add Book
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search books..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-12 w-12 mb-3" style={{ color: '#0F6E56', opacity: 0.4 }} />
            <p className="text-muted-foreground">{search || filterCat !== 'all' ? 'No matching books' : 'No books yet'}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <Card key={b.id} className="group hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <CardTitle className="text-base line-clamp-2">{b.title}</CardTitle>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" style={{ color: '#C0322A' }} onClick={() => handleDelete(b.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge style={{ background: 'rgba(15,110,86,0.12)', color: '#0a4a38', border: 'none' }}>{catName(b.category_id)}</Badge>
                <Button variant="outline" size="sm" className="w-full" style={{ borderColor: '#0F6E56', color: '#0F6E56' }} asChild>
                  <a href={b.file_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-3 w-3" />Open in Drive
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}