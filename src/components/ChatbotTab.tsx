import React, { useState, useRef, useEffect } from 'react';
    import { Send, Bot, User } from 'lucide-react';
    import axios from 'axios';
    import { MarketData, PriceData } from '../types';

    interface Message {
      role: 'user' | 'assistant';
      content: string;
    }

    interface ChatbotTabProps {
      apiKey: string;
    }

    const isPersian = (text: string): boolean => {
      const persianRegex = /^[\u0600-\u06FF\s]+$/;
      return persianRegex.test(text);
    };

    const findPrice = (data: MarketData | null, query: string): string | null => {
      if (!data) return null;

      const normalizedQuery = query.replace(/[?؟!]/g, '').trim().toLowerCase();

      // Common price queries in Persian
      const currencyQueries = {
        'دلار': ['دلار', 'دلار آمریکا'],
        'یورو': ['یورو'],
        'پوند': ['پوند'],
        'درهم': ['درهم'],
        'لیر': ['لیر'],
        'بیت‌کوین': ['بیتکوین', 'بیت کوین', 'bitcoin'],
        'اتریوم': ['اتریوم', 'ethereum'],
        'طلا': ['طلا', 'طلای ۱۸ عیار'],
        'سکه': ['سکه', 'سکه امامی', 'سکه بهار آزادی'],
      };

      // Find the requested currency
      let requestedItem: PriceData | undefined;
      for (const [key, queries] of Object.entries(currencyQueries)) {
        if (queries.some(q => normalizedQuery.includes(q))) {
          // Search in all categories
          requestedItem = [...data.currency, ...data.gold, ...data.cryptocurrency]
            .find(item => item.name.includes(key));
          break;
        }
      }

      if (requestedItem) {
        return `قیمت ${requestedItem.name} در حال حاضر ${requestedItem.price.toLocaleString('fa-IR')} ${requestedItem.unit} است.
${requestedItem.change_percent > 0 ? '📈' : '📉'} تغییرات: ${requestedItem.change_percent.toLocaleString('fa-IR')}٪`;
      }

      return null;
    }

    export const ChatbotTab: React.FC<ChatbotTabProps> = ({ apiKey }) => {
      const [messages, setMessages] = useState<Message[]>([]);
      const [input, setInput] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const [errorMessage, setErrorMessage] = useState<string | null>(null);
      const [marketData, setMarketData] = useState<MarketData | null>(null);
      const messagesEndRef = useRef<HTMLDivElement>(null);

      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      };

      useEffect(() => {
        scrollToBottom();
      }, [messages]);

      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get<MarketData>(
              'https://brsapi.ir/FreeTsetmcBourseApi/Api_Free_Gold_Currency_v2.json'
            );
            setMarketData(response.data);
          } catch (error) {
            console.error('Error fetching market data:', error);
          }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000); // Update every minute
        return () => clearInterval(interval);
      }, []);

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();

        if (!isPersian(userMessage)) {
          setErrorMessage('لطفا فقط به زبان فارسی سوال بپرسید.');
          return;
        } else {
          setErrorMessage(null);
        }

        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        // Check if the query is about prices
        const priceResponse = findPrice(marketData, userMessage);
        if (priceResponse) {
          setMessages(prev => [...prev, { role: 'assistant', content: priceResponse }]);
          setIsLoading(false);
          return;
        }

        try {
          const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
            {
              contents: [{ role: 'user', parts: [{ text: userMessage }] }],
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          const botResponse = response.data.candidates[0].content.parts[0].text;
          setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
        } catch (error) {
          console.error('Error calling Gemini API:', error);
          setMessages(prev => [...prev, { role: 'assistant', content: 'متاسفانه در حال حاضر قادر به پاسخگویی نیستم.' }]);
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <div className="bg-white rounded-lg shadow-md h-[calc(100vh-16rem)] flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Bot className="w-6 h-6" />
              دستیار هوشمند
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {errorMessage && (
              <div className="text-red-500 text-center">{errorMessage}</div>
            )}
            {messages.length === 0 && (
              <div className="text-center text-gray-500">
                <p>سلام! من دستیار هوشمند شما هستم.</p>
                <p>سوالات خود را بپرسید.</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.role === 'user' ? (
                      <>
                        <span className="font-bold">شما</span>
                        <User className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span className="font-bold">دستیار</span>
                        <Bot className="w-4 h-4" />
                      </>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">دستیار</span>
                    <Bot className="w-4 h-4" />
                  </div>
                  <p>در حال تایپ...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="پیام خود را بنویسید..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                ارسال
              </button>
            </div>
          </form>
        </div>
      );
    };
