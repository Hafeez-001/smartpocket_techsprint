// import React, { useState } from 'react';
// import axios from 'axios';

// interface RegisterProps {
//   onPageChange: (page: string) => void;
// }

// export const Register: React.FC<RegisterProps> = ({ onPageChange }) => {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     try {
//       await axios.post('http://localhost:5000/api/auth/register', {
//         username,
//         email,
//         password,
//       });
//       setSuccess('Registration successful! You can now login.');
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Registration failed');
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
//       <h2 className="text-2xl font-bold mb-4">Register</h2>
//       {error && <p className="text-red-600 mb-4">{error}</p>}
//       {success && <p className="text-green-600 mb-4">{success}</p>}
//       <form onSubmit={handleSubmit}>
//         <label className="block mb-2">
//           Username:
//           <input
//             type="text"
//             className="w-full border border-gray-300 p-2 rounded"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </label>
//         <label className="block mb-2">
//           Email:
//           <input
//             type="email"
//             className="w-full border border-gray-300 p-2 rounded"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </label>
//         <label className="block mb-4">
//           Password:
//           <input
//             type="password"
//             className="w-full border border-gray-300 p-2 rounded"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </label>
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//         >
//           Register
//         </button>
//       </form>
//       <p className="mt-4">
//         Already have an account?{' '}
//         <button
//           className="text-blue-600 underline"
//           onClick={() => onPageChange('login')}
//         >
//           Login here
//         </button>
//       </p>
//     </div>
//   );
// };

import React, { useState } from 'react';
import axios from 'axios';

interface RegisterProps {
  onPageChange: (page: string) => void;
}

export const Register: React.FC<RegisterProps> = ({ onPageChange }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
      });
      setSuccess('Registration successful! You can now login.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-blue-400 p-4">
      <div className="w-full max-w-md bg-white bg-opacity-90 rounded-2xl shadow-xl p-8 backdrop-blur-md">
        <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-2">Create Account</h2>
        <p className="text-sm text-center text-gray-600 mb-6">Join SmartPocket to track your money smartly ✨</p>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
            Register
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <button
            className="text-purple-600 font-semibold hover:underline"
            onClick={() => onPageChange('login')}
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};
