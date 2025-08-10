import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-green-900 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-4xl font-bold">𖤣.𖥧.𖡼.⚘.❀Plant Nursery❀.⚘.𖡼.𖥧.𖤣</Link>
      <div>
        {user ? (
          <>
            <Link to="/plants" className="mr-4">Plants</Link>
            <Link to="/profile" className="mr-4">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-green-700 px-4 py-2 rounded hover:bg-lime-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link
              to="/register"
              className="bg-green-800 px-4 py-2 rounded hover:bg-lime-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
