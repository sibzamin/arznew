import React, { useState } from 'react';

    interface AdminLoginProps {
      onLogin: () => void;
    }

    export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState<string | null>(null);

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin') {
          onLogin();
        } else {
          setError('نام کاربری یا رمز عبور اشتباه است.');
        }
      };

      return (
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl font-bold mb-4">ورود به پنل مدیریت</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="نام کاربری"
              className="border rounded p-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="رمز عبور"
              className="border rounded p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600">
              ورود
            </button>
          </form>
        </div>
      );
    };
