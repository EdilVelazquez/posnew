import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { Button } from './ui/Button';

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  current: boolean;
}

function NavItem({ href, children, current }: NavItemProps) {
  return (
    <Link
      to={href}
      className={`${
        current
          ? 'bg-gray-900 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      } px-3 py-2 rounded-md text-sm font-medium`}
    >
      {children}
    </Link>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Orders', href: '/orders' },
    { name: 'Recipes', href: '/recipes' },
    { name: 'Inventory', href: '/inventory' },
    { name: 'Reports', href: '/reports' },
  ];

  if (user?.role === 'admin') {
    navigation.push({ name: 'Admin', href: '/admin' });
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-white text-xl font-bold">Restaurant POS</span>
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <NavItem
                      key={item.name}
                      href={item.href}
                      current={location.pathname === item.href}
                    >
                      {item.name}
                    </NavItem>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <Button
                variant="ghost"
                className="text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
            <div className="md:hidden">
              <button
                className="text-gray-400 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } block px-3 py-2 rounded-md text-base font-medium`}
                >
                  {item.name}
                </Link>
              ))}
              <Button
                variant="ghost"
                className="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}