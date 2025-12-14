import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/authentificationSlice';
import { RootState } from '@/store/store';
import { Button } from "@/components/ui/button";
import { Database, BarChart3, User, LogOut, Home } from 'lucide-react';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path ? "bg-slate-700" : "";

  return (
    <nav className="bg-slate-900 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            <Database className="text-blue-400" /> Plateforme
          </Link>

          <div className="flex gap-2 flex-wrap">
            <Link to="/home">
              <Button variant="ghost" className={`text-white hover:text-white hover:bg-slate-700 cursor-pointer hover:cursor-pointer ${isActive('/home')}`}>
                <Home size={18} className="mr-2"/> Accueil
              </Button>
            </Link>
            <Link to="/data">
              <Button variant="ghost" className={`text-white hover:text-white hover:bg-slate-700 cursor-pointer hover:cursor-pointer ${isActive('/data')}`}>
                <Database size={18} className="mr-2"/> Données
              </Button>
            </Link>
            <Link to="/stats">
              <Button variant="ghost" className={`text-white hover:text-white hover:bg-slate-700 cursor-pointer hover:cursor-pointer ${isActive('/stats')}`}>
                <BarChart3 size={18} className="text-green-500"/> Statistiques
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" className={`text-white hover:text-white hover:bg-slate-700 cursor-pointer hover:cursor-pointer ${isActive('/profile')}`}>
                <User size={18} className="mr-2"/> Profil
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400 mr-2 hidden sm:inline">{user}</span>
          <Button variant="destructive" size="sm" onClick={handleLogout} className="gap-2 cursor-pointer hover:cursor-pointer">
            <LogOut size={16} /> <span className="hidden sm:inline text-red-500">Sortir</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}