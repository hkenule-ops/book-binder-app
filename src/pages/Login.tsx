import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import logo from '@/images/mrsoft logo.svg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !pin.trim()) {
      toast.error('Please enter both email and PIN');
      return;
    }

    setLoading(true);
    const res = await api.login(email.trim(), pin.trim());
    setLoading(false);

    if (res.success && res.data?.user) {
      login(res.data.user);
      toast.success('Welcome back!');
      navigate(res.data.user.role === 'admin' ? '/admin' : '/student');
    } else {
      toast.error(res.error || 'Invalid credentials');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a4a38 0%, #0F6E56 60%, #1a5c2a 100%)'
      }}
    >
      {/* Animated background blobs */}
      <div
        className="absolute top-20 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"
        style={{ background: '#0F6E56' }}
      />
      <div
        className="absolute bottom-20 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"
        style={{ background: '#C0322A' }}
      />
      <div
        className="absolute top-40 right-40 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"
        style={{ background: '#8B1A14' }}
      />

      <div
        className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl flex relative z-10"
        style={{
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          minHeight: '520px'
        }}
      >
        {/* Left Panel */}
        <div
          className="hidden md:flex flex-1 flex-col justify-between p-10 relative overflow-hidden backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 110, 86, 0.95) 0%, rgba(10, 74, 56, 0.9) 100%)',
          }}
        >
          {/* Background decorative circles */}
          <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />

          {/* Logo */}
          <div className="z-10">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg inline-block">
              <img
                src={logo}
                alt="Logo"
                className="h-16 w-auto object-contain"
              />
            </div>
          </div>

          {/* Tagline */}
          <div className="z-10">
            <h2 className="text-white font-bold text-2xl leading-snug mb-3" style={{ fontFamily: 'Georgia, serif' }}>
              Your Digital Learning Library
            </h2>
            <p className="text-sm leading-relaxed text-white/80">
              Access your books, track progress,<br />and learn at your own pace.
            </p>
          </div>

          {/* Decorative dots */}
          <div className="flex gap-2 z-10">
            <div className="w-2 h-2 rounded-full bg-white/90" />
            <div className="w-2 h-2 rounded-full bg-white/30" />
            <div className="w-2 h-2 rounded-full bg-white/30" />
          </div>
        </div>

        {/* Right Panel */}
        <div
          className="flex-1 flex flex-col justify-center p-10 backdrop-blur-md"
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px 0 rgba(10, 74, 56, 0.2)'
          }}
        >
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Sign in to Bookshelf</h3>
            <p className="text-sm text-gray-600">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="bg-white/50 backdrop-blur-sm border-gray-200 focus:border-[#0F6E56] focus:ring-[#0F6E56]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">PIN</label>
              <Input
                type="password"
                placeholder="••••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={6}
                autoComplete="current-password"
                className="bg-white/50 backdrop-blur-sm border-gray-200 focus:border-[#0F6E56] focus:ring-[#0F6E56]"
              />
            </div>
            <Button
              type="submit"
              className="w-full font-semibold transition-all duration-200 hover:scale-105"
              disabled={loading}
              style={{ background: '#C0322A', color: '#fff', border: 'none' }}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          <div className="relative text-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <span className="relative bg-transparent px-3 text-xs text-gray-500">powered by</span>
          </div>

          <div className="flex gap-2 justify-center">
            <span className="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-600 bg-white/30 backdrop-blur-sm">
              MRSoft Bookshelf
            </span>
            <span className="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-600 bg-white/30 backdrop-blur-sm">
              v2.0
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}