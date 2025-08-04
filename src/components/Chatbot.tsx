import { useState } from 'react';

export const Chatbot = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('https://linebot-n8n.zeabur.app/webhook/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const botMsg = { sender: 'bot', text: data.reply || '沒有收到回覆' };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: '發生錯誤，請稍後再試' }]);
    }

    setInput('');
  };

  return (
    <div className="p-4 border rounded bg-white shadow">
      <div className="h-64 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`text-sm ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-3 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-100' : 'bg-gray-200'}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-grow border px-3 py-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="輸入你的問題..."
        />
        <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">發送</button>
      </div>
    </div>
  );
};
