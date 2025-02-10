import React, { useState } from 'react';

    interface AdminPanelProps {
      setHotNews: (news: string) => void;
    }

    export const AdminPanel: React.FC<AdminPanelProps> = ({ setHotNews }) => {
      const [newsInput, setNewsInput] = useState('');

      const handleNewsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setHotNews(newsInput);
        setNewsInput('');
      };

      return (
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-4">پنل مدیریت</h2>
          <form onSubmit={handleNewsSubmit}>
            <div className="mb-4">
              <label htmlFor="hotNews" className="block text-gray-700 text-sm font-bold mb-2">
                داغ ترین خبر:
              </label>
              <input
                type="text"
                id="hotNews"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="خبر جدید را وارد کنید"
                value={newsInput}
                onChange={(e) => setNewsInput(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              ثبت خبر
            </button>
          </form>
        </div>
      );
    };
