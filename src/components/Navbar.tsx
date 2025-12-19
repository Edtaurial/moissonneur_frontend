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
            <Home size={18} className="text-blue-400" /> Accueil
          </Link>

          <div className="flex gap-2 flex-wrap">
            
            <Link to="/data">
              <Button variant="ghost" className={`text-white hover:text-white hover:bg-slate-700 cursor-pointer hover:cursor-pointer ${isActive('/data')}`}>
                <Database size={18} className="text-gray-400"/> Données
              </Button>
            </Link>
            <Link to="/stats">
              <Button variant="ghost" className={`text-white hover:text-white hover:bg-slate-700 cursor-pointer hover:cursor-pointer ${isActive('/stats')}`}>
                <BarChart3 size={18} className="text-green-500"/> Statistiques
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" className={`text-white hover:text-white hover:bg-slate-700 cursor-pointer hover:cursor-pointer ${isActive('/profile')}`}>
                <User size={18} className="text-red-500"/> Profil
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400 mr-2 hidden sm:inline">{user}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 cursor-pointer hover:cursor-pointer text-red-500 hover:text-red-400 hover:bg-slate-800">
            <LogOut size={16} /> <span>Se déconnecter</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}