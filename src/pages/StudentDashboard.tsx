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
import logo from '@/images/mrsoft logo.svg';
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
  const isDark = theme === 'dark';

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
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #061a12 0%, #0a2a1c 50%, #0d3322 100%)'
            : 'linear-gradient(135deg, #e8f5f0 0%, #f0faf6 50%, #e4f2eb 100%)',
        }}
      >
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#0F6E56' }} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #061a12 0%, #0a2a1c 50%, #0d3322 100%)'
          : 'linear-gradient(135deg, #e8f5f0 0%, #f0faf6 50%, #e4f2eb 100%)',
      }}
    >
      {/* Blobs */}
      <div
        className="absolute top-10 left-1/4 w-96 h-96 rounded-full filter blur-3xl pointer-events-none animate-blob-fast"
        style={{ background: '#0F6E56', opacity: isDark ? 0.35 : 0.45 }}
      />
      <div
        className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full filter blur-3xl pointer-events-none animate-blob-fast animation-delay-2000"
        style={{ background: '#C0322A', opacity: isDark ? 0.28 : 0.35 }}
      />
      <div
        className="absolute top-1/2 right-10 w-72 h-72 rounded-full filter blur-3xl pointer-events-none animate-blob-fast animation-delay-1000"
        style={{ background: '#0a4a38', opacity: isDark ? 0.35 : 0.38 }}
      />

      {/* Header */}
      <header
        className="border-b sticky top-0 z-10 backdrop-blur-md"
        style={{
          background: isDark ? 'rgba(10, 30, 20, 0.6)' : 'rgba(255, 255, 255, 0.6)',
          borderBottomColor: isDark ? 'rgba(15,110,86,0.25)' : 'rgba(15,110,86,0.15)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" style={{ color: '#C0322A' }} onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-6 animate-fade-in relative z-10">
        {!selectedCat ? (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">My Book Shelf</h1>
              <p className="text-muted-foreground">Welcome, {user?.name}</p>
            </div>
            {categories.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center py-12">
                  <FolderOpen className="h-12 w-12 mb-3" style={{ color: '#0F6E56', opacity: 0.4 }} />
                  <p className="text-muted-foreground">No categories assigned yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((c) => (
                  <Card
                    key={c.id}
                    className="cursor-pointer hover:shadow-md transition-all"
                    style={{ borderColor: 'transparent' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(15,110,86,0.3)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
                    onClick={() => openCategory(c)}
                  >
                    <CardHeader>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2" style={{ background: 'rgba(15,110,86,0.1)' }}>
                        <FolderOpen className="h-5 w-5" style={{ color: '#0F6E56' }} />
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
              <Button variant="ghost" size="icon" style={{ color: '#0F6E56' }} onClick={() => { setSelectedCat(null); setBooks([]); }}>
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
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" style={{ color: '#0F6E56' }} /></div>
            ) : filteredBooks.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center py-12">
                  <BookOpen className="h-12 w-12 mb-3" style={{ color: '#0F6E56', opacity: 0.4 }} />
                  <p className="text-muted-foreground">{search ? 'No matching books' : 'No books in this category'}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBooks.map((b) => (
                  <Card key={b.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2" style={{ background: 'rgba(15,110,86,0.1)' }}>
                        <BookOpen className="h-5 w-5" style={{ color: '#0F6E56' }} />
                      </div>
                      <CardTitle className="text-base line-clamp-2">{b.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" style={{ borderColor: '#0F6E56', color: '#0F6E56' }} asChild>
                        <a href={b.file_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-1 h-3 w-3" />View
                        </a>
                      </Button>
                      <Button size="sm" className="flex-1" style={{ background: '#0F6E56', color: '#fff', border: 'none' }} asChild>
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

      <style>{`
        @keyframes blob-fast {
          0%   { transform: translate(0px, 0px) scale(1); }
          25%  { transform: translate(40px, -60px) scale(1.15); }
          50%  { transform: translate(-30px, 30px) scale(0.85); }
          75%  { transform: translate(20px, -20px) scale(1.05); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob-fast { animation: blob-fast 4s ease-in-out infinite; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}