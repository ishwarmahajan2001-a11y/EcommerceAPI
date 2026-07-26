import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'
  }`;

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-indigo-600 shadow">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold tracking-tight text-white">
            Shop<span className="text-amber-300">Stack</span>
          </Link>
          <div className="hidden gap-1 sm:flex">
            <NavLink to="/" end className={navLinkClass}>
              Products
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/orders" className={navLinkClass}>
                My Orders
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin/products" className={navLinkClass}>
                Admin
              </NavLink>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="relative rounded-md px-3 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-500 hover:text-white"
            aria-label={`Cart with ${totalCount} items`}
          >
            Cart
            {totalCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-slate-900">
                {totalCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <>
              <span className="text-sm text-indigo-100">{user.username}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md bg-indigo-800 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-900"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
