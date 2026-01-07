import React, { useState } from 'react';
import axios from 'axios';


interface LoginProps {
  onLoginSuccess: (username: string) => void;
  onPageChange: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onPageChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      const data = response.data as { token: string; username: string; userId: string };
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId); 
      onLoginSuccess(data.username);
      onPageChange('dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-blue-400 p-4">
      {/* Logo & Branding */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg mb-3">
          <span className="text-2xl">💰</span>
        </div>
        <h1 className="text-4xl font-extrabold">
          <span className="text-slate-800">SmartPocket</span>
          {/* <span className="bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Pocket
          </span> */}
        </h1>
        <p color='white'>Speak. Save. Succeed.</p>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md bg-white bg-opacity-90 rounded-2xl shadow-xl p-8 backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-center text-purple-700 mb-4">Login</h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition duration-300 shadow-md"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{' '}
          <button
            className="text-purple-600 font-semibold hover:underline"
            onClick={() => onPageChange('register')}
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};


// import React, { useState } from 'react';
// import axios from 'axios';

// interface LoginProps {
//   onLoginSuccess: (username: string) => void;
//   onPageChange: (page: string) => void;
// }

// export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onPageChange }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/login', {
//         email,
//         password,
//       });
//       const data = response.data as { token: string; username: string };
//       localStorage.setItem('token', data.token);
//       onLoginSuccess(data.username);
//       onPageChange('dashboard');
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Login failed');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-blue-400 p-4">
//       <div className="w-full max-w-md bg-white bg-opacity-90 rounded-2xl shadow-xl p-8 backdrop-blur-md">
//         <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-6">SmartPocket Login</h2>
//         {error && <p className="text-red-600 text-center mb-4">{error}</p>}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//             <input
//               type="password"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition duration-300 shadow-md"
//           >
//             Login
//           </button>
//         </form>
//         <p className="mt-6 text-sm text-center text-gray-600">
//           Don’t have an account?{' '}
//           <button
//             className="text-purple-600 font-semibold hover:underline"
//             onClick={() => onPageChange('register')}
//           >
//             Register here
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };
