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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const students = users.filter((u) => u.role === 'student');

  const stats = [
    { label: 'Students', value: students.length, icon: Users, color: 'text-primary' },
    { label: 'Categories', value: categories.length, icon: FolderOpen, color: 'text-accent' },
    { label: 'Books', value: books.length, icon: BookOpen, color: 'text-warning' },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your bookshelf system</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <p className="text-muted-foreground text-sm">No categories yet</p>
            ) : (
              <div className="space-y-2">
                {categories.slice(0, 5).map((c) => (
                  <div key={c.id} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                    <span className="font-medium text-sm">{c.name}</span>
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
                  <div key={s.id} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                    <span className="font-medium text-sm">{s.email}</span>
                    <span className="text-xs text-muted-foreground">
                      {s.categories.length} {s.categories.length === 1 ? 'category' : 'categories'}
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
