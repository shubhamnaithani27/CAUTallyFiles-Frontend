import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loginAttempted, setLoginAttempted] = useState(false); // track login trigger
  const navigate = useNavigate();
  const { login, user } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Both fields are required.');
      return;
    }

    const success = await login(form.username, form.password);
    if (success) {
      setLoginAttempted(true); // mark that login was successful
    } else {
      setError('Invalid username or password.');
    }
  };

  // Wait for user to be set after login, then redirect
  useEffect(() => {
    if (loginAttempted && user?.role) {
      console.log("lll");
      navigate(user.role === 'admin' ? '/admin' : '/user');
    }
  }, [user, loginAttempted, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;


// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';

// const LoginPage = () => {
//   const { setUser, setToken } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleLogin = (e) => {
//     e.preventDefault();

//     const mockUsers = [
//       { username: 'admin', password: '123456', role: 'admin' },
//       { username: 'john@example.com', password: 'password123', role: 'user' },
//     ];

//     const trimmedUsername = username.trim();

//     const matchedUser = mockUsers.find(
//       (user) =>
//         user.username.toLowerCase() === trimmedUsername.toLowerCase() &&
//         user.password === password
//     );

//     if (matchedUser) {
//       setToken('mock-jwt-token');
//       setUser({ username: matchedUser.username, role: matchedUser.role });
//       navigate(matchedUser.role === 'admin' ? '/admin' : '/user');
//     } else {
//       setError('Invalid username or password');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
//         <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
//         {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

//         <input
//           type="text"
//           placeholder="Username"
//           className="w-full mb-3 p-2 border rounded"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full mb-4 p-2 border rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button
//           type="submit"
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;
