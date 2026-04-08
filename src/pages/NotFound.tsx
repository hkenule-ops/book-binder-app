import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import logo from '@/images/mrsoft logo.svg';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a4a38 0%, #0F6E56 60%, #1a5c2a 100%)' }}>
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-6">
          <div className="bg-white/95 rounded-2xl px-4 py-3 shadow-lg">
            <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />
          </div>
        </div>
        <h1 className="text-7xl font-bold text-white">404</h1>
        <p className="text-xl text-white/70">Oops! Page not found</p>
        <a
          href="/"
          className="inline-block mt-4 px-6 py-2 rounded-lg font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: '#C0322A' }}
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;