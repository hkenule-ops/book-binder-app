import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { api } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FolderOpen, ExternalLink, Download, Loader2, ArrowLeft, LogOut, Moon, Sun, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Category, Book } from '@/types';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const res = await api.getCategories();
      if (res.data?.categories) {
        const assigned = res.data.categories.filter((c) => user?.categories.includes(c.id));
        setCategories(assigned);
      }
      setLoading(false);
    }
    load();
  }, [user]);

  const openCategory = async (cat: Category) => {
    setSelectedCat(cat);
    setLoadingBooks(true);
    setSearch('');
    const res = await api.getBooksByCategory(cat.id);
    if (res.data?.books) setBooks(res.data.books);
    setLoadingBooks(false);
  };

  const getDownloadUrl = (url: string) => {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    return url;
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const filteredBooks = books.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-bold">Bookshelf</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 animate-fade-in">
        {!selectedCat ? (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">My Shelves</h1>
              <p className="text-muted-foreground">Welcome, {user?.email}</p>
            </div>
            {categories.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center py-12">
                  <FolderOpen className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No categories assigned yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((c) => (
                  <Card key={c.id} className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all" onClick={() => openCategory(c)}>
                    <CardHeader>
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                        <FolderOpen className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{c.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{c.description || 'Explore materials'}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => { setSelectedCat(null); setBooks([]); }}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{selectedCat.name}</h1>
                <p className="text-muted-foreground">{selectedCat.description}</p>
              </div>
            </div>

            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search books..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>

            {loadingBooks ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : filteredBooks.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">{search ? 'No matching books' : 'No books in this category'}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBooks.map((b) => (
                  <Card key={b.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-base line-clamp-2">{b.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <a href={b.file_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-1 h-3 w-3" />View
                        </a>
                      </Button>
                      <Button variant="default" size="sm" className="flex-1" asChild>
                        <a href={getDownloadUrl(b.file_url)} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-1 h-3 w-3" />Download
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
