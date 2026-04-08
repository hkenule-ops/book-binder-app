import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FolderOpen, BookOpen, Loader2 } from 'lucide-react';
import type { Category, User, Book } from '@/types';

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [u, c, b] = await Promise.all([
        api.getUsers(),
        api.getCategories(),
        api.getAllBooks(),
      ]);
      if (u.data?.users) setUsers(u.data.users);
      if (c.data?.categories) setCategories(c.data.categories);
      if (b.data?.books) setBooks(b.data.books);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#0F6E56' }} />
      </div>
    );
  }

  const students = users.filter((u) => u.role === 'student');

  const stats = [
    { label: 'Students', value: students.length, icon: Users, bg: '#0F6E56', iconColor: '#fff' },
    { label: 'Courses', value: categories.length, icon: FolderOpen, bg: '#0a4a38', iconColor: '#fff' },
    { label: 'Books', value: books.length, icon: BookOpen, bg: '#C0322A', iconColor: '#fff' },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your bookshelf system</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/50 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon className="h-4 w-4" style={{ color: s.iconColor }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: s.bg }}>{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Courses</CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <p className="text-muted-foreground text-sm">No courses yet</p>
            ) : (
              <div className="space-y-2">
                {categories.slice(0, 5).map((c) => (
                  <div key={c.id} className="flex justify-between items-center p-2 rounded-md" style={{ background: 'rgba(15,110,86,0.08)' }}>
                    <span className="font-medium text-sm" style={{ color: '#0a4a38' }}>{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.description}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Students</CardTitle>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-muted-foreground text-sm">No students yet</p>
            ) : (
              <div className="space-y-2">
                {students.slice(0, 5).map((s) => (
                  <div key={s.id} className="flex justify-between items-center p-2 rounded-md" style={{ background: 'rgba(15,110,86,0.08)' }}>
                    <span className="font-medium text-sm" style={{ color: '#0a4a38' }}>{s.email}</span>
                    <span className="text-xs text-muted-foreground">
                      {s.categories.length} {s.categories.length === 1 ? 'course' : 'course'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}