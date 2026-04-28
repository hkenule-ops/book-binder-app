import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Loader2, BookOpen, Trash2, Search, ExternalLink, ChevronDown, ChevronRight, FolderOpen } from 'lucide-react';
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
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());

  const load = async () => {
    const [b, c] = await Promise.all([api.getAllBooks(), api.getCategories()]);
    if (b.data?.books) setBooks(b.data.books);
    if (c.data?.categories) {
      setCategories(c.data.categories);
      // Expand all categories by default
      setExpandedCats(new Set(c.data.categories.map((cat: Category) => cat.id)));
    }
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

  const toggleCat = (id: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Group books by category, filtered by search
  const booksByCategory = categories.map((cat) => ({
    category: cat,
    books: books.filter(
      (b) =>
        b.category_id === cat.id &&
        b.title.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  // Only show categories that have matching books (when searching) or always show all
  const visibleCategories = search
    ? booksByCategory.filter((g) => g.books.length > 0)
    : booksByCategory;

  const totalFiltered = visibleCategories.reduce((acc, g) => acc + g.books.length, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#0F6E56' }} />
      </div>
    );
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

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Expand / Collapse all */}
      {!search && categories.length > 0 && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedCats(new Set(categories.map((c) => c.id)))}
            style={{ borderColor: '#0F6E56', color: '#0F6E56' }}
          >
            Expand All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedCats(new Set())}
            style={{ borderColor: '#0F6E56', color: '#0F6E56' }}
          >
            Collapse All
          </Button>
        </div>
      )}

      {/* No results */}
      {search && totalFiltered === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-12 w-12 mb-3" style={{ color: '#0F6E56', opacity: 0.4 }} />
            <p className="text-muted-foreground">No books match your search</p>
          </CardContent>
        </Card>
      ) : categories.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-12 w-12 mb-3" style={{ color: '#0F6E56', opacity: 0.4 }} />
            <p className="text-muted-foreground">No courses yet. Create a course first.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {visibleCategories.map(({ category, books: catBooks }) => {
            const isExpanded = expandedCats.has(category.id);
            return (
              <div
                key={category.id}
                className="rounded-xl border overflow-hidden"
                style={{ borderColor: 'hsl(var(--border))' }}
              >
                {/* Category Header */}
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-muted/50"
                  style={{ background: 'rgba(15,110,86,0.06)' }}
                  onClick={() => toggleCat(category.id)}
                >
                  <div className="flex items-center gap-3">
                    <FolderOpen className="h-5 w-5" style={{ color: '#0F6E56' }} />
                    <span className="font-semibold text-base">{category.name}</span>
                    <Badge
                      style={{ background: 'rgba(15,110,86,0.15)', color: '#0a4a38', border: 'none' }}
                      className="text-xs"
                    >
                      {catBooks.length} {catBooks.length === 1 ? 'book' : 'books'}
                    </Badge>
                  </div>
                  {isExpanded
                    ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  }
                </button>

                {/* Books Grid */}
                {isExpanded && (
                  <div className="p-4" style={{ borderTop: '1px solid hsl(var(--border))' }}>
                    {catBooks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <BookOpen className="h-8 w-8 mb-2" style={{ color: '#0F6E56', opacity: 0.3 }} />
                        <p className="text-sm text-muted-foreground">No books in this course yet</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {catBooks.map((b) => (
                          <Card key={b.id} className="group hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-start justify-between pb-2">
                              <CardTitle className="text-base line-clamp-2">{b.title}</CardTitle>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                style={{ color: '#C0322A' }}
                                onClick={() => handleDelete(b.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </CardHeader>
                            <CardContent>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                style={{ borderColor: '#0F6E56', color: '#0F6E56' }}
                                asChild
                              >
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
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}