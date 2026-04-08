import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Loader2, Users, Copy, RefreshCw, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import type { User, Category } from '@/types';

export default function ManageStudents() {
  const [students, setStudents] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [search, setSearch] = useState('');

  // Assign dialog
  const [assignUser, setAssignUser] = useState<User | null>(null);
  const [assignCats, setAssignCats] = useState<string[]>([]);
  const [assigning, setAssigning] = useState(false);

  // PIN Reset Dialog
  const [openPinReset, setOpenPinReset] = useState(false);
  const [resetPinUser, setResetPinUser] = useState<User | null>(null);
  const [resetPinValue, setResetPinValue] = useState('');

  const load = async () => {
    const [u, c] = await Promise.all([api.getUsers(), api.getCategories()]);
    if (u.data?.users) setStudents(u.data.users.filter((x) => x.role === 'student'));
    if (c.data?.categories) setCategories(c.data.categories);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!email.trim()) { toast.error('Email is required'); return; }
    if (!name.trim()) { toast.error('Name is required'); return; }
    setCreating(true);
    const res = await api.createUser(email.trim(), selectedCats, name.trim());
    setCreating(false);
    if (res.success && res.data) {
      setNewPin(res.data.pin);
      toast.success('Student created');
      setEmail(''); 
      setName('');
      setSelectedCats([]);
      load();
    } else {
      toast.error(res.error || 'Failed');
    }
  };

  const handleRegenPin = async (user: User) => {
    setResetPinUser(user);
    const res = await api.regeneratePin(user.id);
    if (res.success && res.data) {
      setResetPinValue(res.data.pin);
      setOpenPinReset(true);
      load();
    } else {
      toast.error(res.error || 'Failed');
    }
  };

  const handleAssign = async () => {
    if (!assignUser) return;
    setAssigning(true);
    const res = await api.assignCategory(assignUser.id, assignCats);
    setAssigning(false);
    if (res.success) { toast.success('Course updated'); setAssignUser(null); load(); }
    else toast.error(res.error || 'Failed');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this student?')) return;
    const res = await api.deleteUser(id);
    if (res.success) { toast.success('Deleted'); load(); }
    else toast.error(res.error || 'Failed');
  };

  const toggleCat = (id: string, list: string[], set: (v: string[]) => void) => {
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  };

  const catName = (id: string) => categories.find((c) => c.id === id)?.name || id;

  const filtered = students.filter((s) => 
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.name && s.name.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin" style={{ color: '#0F6E56' }} /></div>;
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-muted-foreground">Manage student accounts & access</p>
        </div>
        <Dialog open={openCreate} onOpenChange={(v) => { setOpenCreate(v); if (!v) setNewPin(''); }}>
          <DialogTrigger asChild>
            <Button style={{ background: '#0F6E56', color: '#fff', border: 'none' }}>
              <Plus className="mr-2 h-4 w-4" />Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{newPin ? 'Student Created!' : 'Add Student'}</DialogTitle></DialogHeader>
            {newPin ? (
              <div className="space-y-4 text-center">
                <p className="text-muted-foreground">Share this PIN with the student (shown once):</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-2xl font-mono font-bold px-4 py-2 rounded-lg" style={{ background: 'rgba(15,110,86,0.1)', color: '#0a4a38' }}>{newPin}</code>
                  <Button variant="outline" size="icon" style={{ borderColor: '#0F6E56', color: '#0F6E56' }} onClick={() => { navigator.clipboard.writeText(newPin); toast.success('Copied!'); }}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" onClick={() => { setNewPin(''); setOpenCreate(false); }} className="w-full" style={{ borderColor: '#0F6E56', color: '#0F6E56' }}>Done</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Full Name <span className="text-red-500">*</span></label>
                  <Input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="John Doe" 
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email <span className="text-red-500">*</span></label>
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="student@example.com" 
                    maxLength={255} 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Assign Course</label>
                  <div className="space-y-2 max-h-40 overflow-auto">
                    {categories.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Create Course first</p>
                    ) : categories.map((c) => (
                      <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox checked={selectedCats.includes(c.id)} onCheckedChange={() => toggleCat(c.id, selectedCats, setSelectedCats)} />
                        <span className="text-sm">{c.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Button onClick={handleCreate} disabled={creating} className="w-full" style={{ background: '#0F6E56', color: '#fff', border: 'none' }}>
                  {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create Student
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search students by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 mb-3" style={{ color: '#0F6E56', opacity: 0.4 }} />
            <p className="text-muted-foreground">{search ? 'No matching students' : 'No students yet'}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <Card key={s.id} className="hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4">
                <div className="space-y-1">
                  <p className="font-medium">
                    {s.name && <span>{s.name}</span>}
                    {s.name && <span className="text-muted-foreground text-sm ml-2">({s.email})</span>}
                    {!s.name && <span>{s.email}</span>}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {s.categories.length === 0 ? (
                      <span className="text-xs text-muted-foreground">No categories assigned</span>
                    ) : s.categories.map((cid) => (
                      <Badge key={cid} style={{ background: 'rgba(15,110,86,0.12)', color: '#0a4a38', border: 'none' }} className="text-xs">{catName(cid)}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" style={{ borderColor: '#0F6E56', color: '#0F6E56' }} onClick={() => { setAssignUser(s); setAssignCats([...s.categories]); }}>
                    Assign
                  </Button>
                  <Button variant="outline" size="sm" style={{ borderColor: '#0F6E56', color: '#0F6E56' }} onClick={() => handleRegenPin(s)}>
                    <RefreshCw className="h-3 w-3 mr-1" />PIN
                  </Button>
                  <Button variant="ghost" size="sm" style={{ color: '#C0322A' }} onClick={() => handleDelete(s.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* PIN Reset Dialog - Same design as create student dialog */}
      <Dialog open={openPinReset} onOpenChange={(v) => { setOpenPinReset(v); if (!v) { setResetPinUser(null); setResetPinValue(''); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>PIN Reset Successful!</DialogTitle></DialogHeader>
          <div className="space-y-4 text-center">
            <p className="text-muted-foreground">
              New PIN for {resetPinUser?.name || resetPinUser?.email}:
            </p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-2xl font-mono font-bold px-4 py-2 rounded-lg" style={{ background: 'rgba(15,110,86,0.1)', color: '#0a4a38' }}>
                {resetPinValue}
              </code>
              <Button variant="outline" size="icon" style={{ borderColor: '#0F6E56', color: '#0F6E56' }} onClick={() => { navigator.clipboard.writeText(resetPinValue); toast.success('Copied!'); }}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" onClick={() => { setOpenPinReset(false); setResetPinUser(null); setResetPinValue(''); }} className="w-full" style={{ borderColor: '#0F6E56', color: '#0F6E56' }}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={!!assignUser} onOpenChange={(v) => { if (!v) setAssignUser(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Assign Categories – {assignUser?.name || assignUser?.email}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2 max-h-60 overflow-auto">
              {categories.map((c) => (
                <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={assignCats.includes(c.id)} onCheckedChange={() => toggleCat(c.id, assignCats, setAssignCats)} />
                  <span className="text-sm">{c.name}</span>
                </label>
              ))}
            </div>
            <Button onClick={handleAssign} disabled={assigning} className="w-full" style={{ background: '#0F6E56', color: '#fff', border: 'none' }}>
              {assigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}