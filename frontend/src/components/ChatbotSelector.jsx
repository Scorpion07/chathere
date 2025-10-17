import React, { useState } from 'react';

const chatbotOptions = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'Powered by OpenAI GPT models',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/OpenAI_Logo.svg',
  },
  {
    id: 'google-gemini',
    name: 'Google Gemini',
    description: 'Next-gen AI from Google',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    description: 'AI assistant by Anthropic',
    logo: 'https://pbs.twimg.com/profile_images/1640015744537065472/10Gh3E13_400x400.jpg',
  },
  {
    id: 'microsoft-bing',
    name: 'Microsoft Bing AI',
    description: 'AI chatbot by Microsoft Bing',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_Bing_logo_2020.svg',
  },
];

export default function ChatbotSelector({ onSelect }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (id) => {
    setSelected(id);
    onSelect(id);
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-6xl px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Choose Your Chatbot AI</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {chatbotOptions.map(({ id, name, description, logo }) => (
            <div
              key={id}
              onClick={() => handleSelect(id)}
              className={`cursor-pointer p-6 rounded-lg border transition-shadow bg-white shadow-sm hover:shadow-lg flex flex-col items-center text-center ${
                selected === id ? 'border-blue-600 shadow-xl' : 'border-gray-300'
              }`}
            >
              <img
                src={logo}
                alt={`${name} logo`}
                className="w-20 h-20 mb-4 object-contain"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <h3 className="text-xl font-semibold mb-2">{name}</h3>
              <p className="text-gray-600 text-sm">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
