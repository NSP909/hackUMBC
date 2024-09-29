import React from 'react';

function MessageList({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-2 p-3 rounded-lg max-w-xs ${
            message.sender === 'user'
              ? 'bg-gray-800 text-white self-end rounded-br-none'
              : 'bg-gray-100 text-gray-800 self-start rounded-bl-none'
          }`}
        >
          <div className="break-words">
            {message.text}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessageList;