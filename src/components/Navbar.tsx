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
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            <Database className="text-blue-400" /> Plateforme
          </Link>
          
          <div className="hidden md:flex gap-2">
            <Link to="/home">
                <Button variant="ghost" className={`text-white hover:text-white hover:bg-slate-700 ${isActive('/home')}`}>
                    <Home size={18} className="mr-2"/> Accueil
                </Button>
            </Link>
            <Link to="/data">
                <Button variant="ghost" className={`text-white hover:text-white hover:bg-slate-700 ${isActive('/data')}`}>
                    <Database size={18} className="mr-2"/> Données
                </Button>
            </Link>
            <Link to="/stats">
                <Button variant="ghost" className={`text-white hover:text-white hover:bg-slate-700 ${isActive('/stats')}`}>
                    <BarChart3 size={18} className="mr-2"/> Statistiques
                </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400 mr-2 hidden sm:inline">{user}</span>
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="text-white hover:bg-slate-700">
                <User size={20} />
            </Button>
          </Link>
          <Button variant="destructive" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut size={16} /> <span className="hidden sm:inline">Sortir</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}