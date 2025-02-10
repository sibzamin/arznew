import React, { useEffect, useState } from 'react';
    import axios from 'axios';
    import { RefreshCw } from 'lucide-react';
    import { MarketData } from './types';
    import { PriceSection } from './components/PriceSection';
    import { ConversionTab } from './components/ConversionTab';
    import { ChatbotTab } from './components/ChatbotTab';
    import { AdminPanel } from './components/AdminPanel';
    import { AdminLogin } from './components/AdminLogin';

    function App() {
      const [data, setData] = useState<MarketData | null>(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);
      const [lastUpdate, setLastUpdate] = useState<string | null>(null);
      const [activeTab, setActiveTab] = useState<'prices' | 'conversion' | 'chat' | 'admin'>('prices');
      const [isChatbotUnlocked, setIsChatbotUnlocked] = useState(localStorage.getItem('chatbotUnlocked') === 'true');
      const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
      const [hotNews, setHotNews] = useState(localStorage.getItem('hotNews') || '');

      useEffect(() => {
        if (isChatbotUnlocked) {
          localStorage.setItem('chatbotUnlocked', 'true');
        } else {
          localStorage.removeItem('chatbotUnlocked');
        }
      }, [isChatbotUnlocked]);

      useEffect(() => {
        localStorage.setItem('hotNews', hotNews);
      }, [hotNews]);

      useEffect(() => {
        if (isAdmin) {
          localStorage.setItem('isAdmin', 'true');
        } else {
          localStorage.removeItem('isAdmin');
        }
      }, [isAdmin]);

      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios.get<MarketData>(
            'https://brsapi.ir/FreeTsetmcBourseApi/Api_Free_Gold_Currency_v2.json'
          );
          setData(response.data);
          setLastUpdate(new Date().toLocaleTimeString('fa-IR'));
          setError(null);
        } catch (err) {
          setError('خطا در دریافت اطلاعات');
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Update every minute
        return () => clearInterval(interval);
      }, []);

      if (error) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 text-xl mb-4">{error}</p>
              <button
                onClick={fetchData}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                تلاش مجدد
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="container mx-auto px-4 py-8">
          {/* Hot News Section */}
          {hotNews && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
              <p className="font-bold">داغ ترین خبر:</p>
              <p>{hotNews}</p>
            </div>
          )}

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">قیمت لحظه‌ای بازار</h1>
            <div className="flex items-center gap-4">
              {lastUpdate && (
                <span className="text-gray-500">
                  آخرین به‌روزرسانی: {lastUpdate}
                </span>
              )}
              <button
                onClick={fetchData}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                به‌روزرسانی
              </button>
            </div>
          </div>

          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'prices'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('prices')}
                >
                  قیمت‌ها
                </button>
                <button
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'conversion'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('conversion')}
                >
                  تبدیل
                </button>
                <button
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'chat'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('chat')}
                >
                  دستیار هوشمند
                </button>
                {isAdmin ? (
                  <button
                    className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'admin'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('admin')}
                  >
                    قسمت مدیریتی
                  </button>
                ) : (
                  <button
                    className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'admin'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('admin')}
                  >
                    قسمت مدیریتی
                  </button>
                )}
              </nav>
            </div>
          </div>

          {activeTab === 'chat' ? (
            isChatbotUnlocked ? (
              <ChatbotTab apiKey="AIzaSyDS7GmMk1mX8sNFeWzVUxGcG5xGXxfMzz4" />
            ) : (
              <PasswordGate onUnlock={() => setIsChatbotUnlocked(true)} />
            )
          ) : activeTab === 'admin' ? (
            isAdmin ? (
              <AdminPanel setHotNews={setHotNews} />
            ) : (
              <AdminLogin onLogin={() => setIsAdmin(true)} />
            )
          ) : data && (
            activeTab === 'prices' ? (
              <>
                <PriceSection title="طلا و سکه" data={data.gold} />
                <PriceSection title="ارز" data={data.currency} />
                <PriceSection title="ارز دیجیتال" data={data.cryptocurrency} />
              </>
            ) : (
              <ConversionTab data={data} />
            )
          )}
        </div>
      );
    }

    export default App;

    interface PasswordGateProps {
      onUnlock: () => void;
    }

    const PasswordGate: React.FC<PasswordGateProps> = ({ onUnlock }) => {
      const [password, setPassword] = useState('');
      const [error, setError] = useState<string | null>(null);

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'AB#!ad123f@@') {
          onUnlock();
        } else {
          setError('رمز عبور اشتباه است.');
        }
      };

      return (
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl font-bold mb-4">ورود به دستیار هوشمند</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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
