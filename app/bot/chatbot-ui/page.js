'use client';

import { useState, useEffect, useRef } from 'react';

// Menu structure
const menus = {
  main_menu: {
    text: '👋 Hello! Welcome to *Samastha Smart City*\n\nHow can I assist you right now?',
    buttons: [
      { text: 'Emergency', callback_data: 'emergency', number: '1' },
      { text: 'Hospital', callback_data: 'hospital', number: '2' },
      { text: 'Shopping', callback_data: 'shopping', number: '3' },
      { text: 'Education', callback_data: 'education', number: '4' },
    ],
  },
  emergency: {
    text: '🚨 *EMERGENCY SERVICES*\n\nChoose an option:',
    buttons: [
      { text: 'Ambulance', callback_data: 'emergency_ambulance', number: '1' },
      { text: 'Viqaya', callback_data: 'emergency_viqaya', number: '2' },
      { text: 'Police', callback_data: 'emergency_police', number: '3' },
      { text: '🔙 Back', callback_data: 'main_menu', number: '0' },
    ],
  },
  hospital: {
    text: '🏥 *HOSPITAL SERVICES*\n\nChoose an option:',
    buttons: [
      { text: 'Doctors', callback_data: 'hospital_doctores', number: '1' },
      { text: 'Nearby Hospitals', callback_data: 'hospital_nearby_hosptals', number: '2' },
      { text: '🔙 Back', callback_data: 'main_menu', number: '0' },
    ],
  },
  shopping: {
    text: '🛒 *SHOPPING SERVICES*\n\nChoose an option:',
    buttons: [
      { text: 'Food & Restaurants', callback_data: 'shopping_food_restaurants', number: '1' },
      { text: 'Grocery Stores', callback_data: 'shopping_grocery_stores', number: '2' },
      { text: 'Repair Services', callback_data: 'shopping_services_(repair, electricians, etc.)', number: '3' },
      { text: '🔙 Back', callback_data: 'main_menu', number: '0' },
    ],
  },
  education: {
    text: '🎓 *EDUCATION SERVICES*\n\nChoose an option:',
    buttons: [
      { text: 'Schools', callback_data: 'education_schools', number: '1' },
      { text: 'Colleges', callback_data: 'education_collages', number: '2' },
      { text: 'Madrasas / Islamic', callback_data: 'education_ madrasas_Islamic_education', number: '3' },
      { text: 'Online Courses', callback_data: 'education_online_courses', number: '4' },
      { text: '🔙 Back', callback_data: 'main_menu', number: '0' },
    ],
  },
  emergency_ambulance: {
    text: '🚑 *AMBULANCE SERVICE*\n\nContact the ambulance service:',
    buttons: [
      { text: 'Call Ambulance', callback_data: 'ambulance_call', number: '1', phone: '+911234567890' },
      { text: '🔙 Back', callback_data: 'emergency', number: '0' },
    ],
  },
  emergency_police: {
    text: '👮 *POLICE SERVICE*\n\nChoose an option:',
    buttons: [
      { text: 'Call Police: 100', callback_data: 'call_police', number: '1', phone: '100' },
      { text: 'Report Crime', callback_data: 'police_report', number: '2' },
      { text: 'Share Location', callback_data: 'police_location', number: '3' },
      { text: 'Nearby Stations', callback_data: 'police_stations', number: '4' },
      { text: '🔙 Back', callback_data: 'emergency', number: '0' },
    ],
  },
  emergency_viqaya: {
    text: '🔥 *Viqaya SERVICE*\n\nContact Viqaya team:',
    buttons: [
      { text: 'Call Viqaya', callback_data: 'call_viqaya', number: '1', phone: '+919999999999' },
      { text: '🔙 Back', callback_data: 'emergency', number: '0' },
    ],
  },
  hospital_doctores: {
    text: '👨‍⚕️ *DOCTORS LIST*\n\nSelect a doctor:',
    buttons: [
      { text: 'Dr. Ameer Ali (General)', callback_data: 'doc_ameer', number: '1', phone: '+911234567890' },
      { text: 'Dr. Fathima (Cardiology)', callback_data: 'doc_fathima', number: '2', phone: '+911234567890' },
      { text: 'Dr. Rahman (Neurology)', callback_data: 'doc_rahman', number: '3', phone: '+911234567890' },
      { text: 'Dr. Nisha (Pediatrics)', callback_data: 'doc_nisha', number: '4', phone: '+911234567890' },
      { text: 'Dr. Salman (Dental)', callback_data: 'doc_salman', number: '5', phone: '+911234567890' },
      { text: '🔙 Back', callback_data: 'hospital', number: '0' },
    ],
  },
  hospital_nearby_hosptals: {
    text: '🏥 *NEARBY HOSPITALS*\n\nSelect a hospital:',
    buttons: [
      { text: 'Rahman Hospital', callback_data: 'hos_rahman', number: '1', phone: '+919876543210' },
      { text: 'Al-Shifa Medical Center', callback_data: 'hos_shifa', number: '2', phone: '+919123456789' },
      { text: 'City Care Hospital', callback_data: 'hos_citycare', number: '3', phone: '+919988777665' },
      { text: 'Noor Clinic & Hospital', callback_data: 'hos_noor', number: '4', phone: '+919090980808' },
      { text: 'Green Valley Hospital', callback_data: 'hos_green', number: '5', phone: '+918887766655' },
      { text: '🔙 Back', callback_data: 'hospital', number: '0' },
    ],
  },
  'shopping_services_(repair, electricians, etc.)': {
    text: '🛠️ *CITY SERVICES*\n\nAvailable services:',
    buttons: [
      { text: 'Electrician - Rasheed', callback_data: 'srv_electrician', number: '1', phone: '+919876511111' },
      { text: 'Plumber - Sameer', callback_data: 'srv_plumber', number: '2', phone: '+919876522222' },
      { text: 'AC Repair - Afsal', callback_data: 'srv_ac', number: '3', phone: '+919876533333' },
      { text: 'Home Repair - Niyas', callback_data: 'srv_home', number: '4', phone: '+919876544444' },
      { text: 'Computer Repair - Jameel', callback_data: 'srv_computer', number: '5', phone: '+919876555555' },
      { text: '🔙 Back', callback_data: 'shopping', number: '0' },
    ],
  },
  shopping_food_restaurants: {
    text: '🍽️ *FOOD & RESTAURANTS*\n\nChoose an option:',
    buttons: [
      { text: 'Order Food Online', url: 'https://restaurant-ecom.vercel.app/', number: '1' },
      { text: 'Popular Restaurants', callback_data: 'food_restaurants', number: '2' },
      { text: 'Cafes & Snacks', callback_data: 'food_cafe', number: '3' },
      { text: 'Local Food Spots', callback_data: 'food_local', number: '4' },
      { text: '🔙 Back', callback_data: 'shopping', number: '0' },
    ],
  },
  shopping_grocery_stores: {
    text: '🛒 *GROCERY STORES*\n\nChoose an option:',
    buttons: [
      { text: 'Order Grocery Online', url: 'https://restaurant-ecom.vercel.app/', number: '1' },
      { text: 'Nearby Supermarkets', callback_data: 'grocery_supermarkets', number: '2' },
      { text: 'Vegetable & Fruit Shops', callback_data: 'grocery_vegetables', number: '3' },
      { text: 'Dairy & Milk Stores', callback_data: 'grocery_dairy', number: '4' },
      { text: '🔙 Back', callback_data: 'shopping', number: '0' },
    ],
  },
  education_schools: {
    text: '🎓 *SCHOOLS*\n\nAvailable schools:',
    buttons: [
      { text: 'Green Valley Public School', callback_data: 'school_greenvalley', number: '1' },
      { text: 'Al Noor Higher Secondary', callback_data: 'school_alnoor', number: '2' },
      { text: 'Bright Future International', callback_data: 'school_brightfuture', number: '3' },
      { text: 'Crescent English Medium', callback_data: 'school_crescent', number: '4' },
      { text: 'City Model High School', callback_data: 'school_citymodel', number: '5' },
      { text: '🔙 Back', callback_data: 'education', number: '0' },
    ],
  },
  education_collages: {
    text: '🏛️ *COLLEGES*\n\nAvailable colleges:',
    buttons: [
      { text: 'Crescent Arts & Science', callback_data: 'college_crescent', number: '1' },
      { text: 'Al Noor Degree College', callback_data: 'college_alnoor', number: '2' },
      { text: 'Green Valley Engineering', callback_data: 'college_greenvalley', number: '3' },
      { text: 'City Model Polytechnic', callback_data: 'college_citymodel', number: '4' },
      { text: 'Horizon Commerce College', callback_data: 'college_horizon', number: '5' },
      { text: '🔙 Back', callback_data: 'education', number: '0' },
    ],
  },
  'education_ madrasas_Islamic_education': {
    text: '🕌 *MADRASAS & ISLAMIC EDUCATION*\n\nAvailable institutions:',
    buttons: [
      { text: 'Darul Huda Islamic University', callback_data: 'madrasa_darulhuda', number: '1' },
      { text: 'Markazul Hidaya Madrasa', callback_data: 'madrasa_markaz', number: '2' },
      { text: 'Noorul Islam Arabic College', callback_data: 'madrasa_noorul', number: '3' },
      { text: 'Jamia Samastha Madrasa', callback_data: 'madrasa_samastha', number: '4' },
      { text: 'Al Falah Quran Academy', callback_data: 'madrasa_alfalah', number: '5' },
      { text: '🔙 Back', callback_data: 'education', number: '0' },
    ],
  },
  education_online_courses: {
    text: '🎓 *ONLINE COURSES*\n\nLearn Islamic knowledge online:',
    buttons: [
      { text: 'Samastha Online Channel', url: 'https://youtube.com/@samasthaonlineoffical?si=UcMF2f23rtNduaG7', number: '1' },
      { text: 'Islamic Online Classes', url: 'https://youtube.com/@samasthaonlineoffical?si=UcMF2f23rtNduaG7', number: '2' },
      { text: '🔙 Back', callback_data: 'education', number: '0' },
    ],
  },
};

export default function ChatbotUI() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMenu, setCurrentMenu] = useState('main_menu');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      const history = JSON.parse(saved);
      setMessages(history);
      if (history.length > 0) {
        const lastBotMsg = [...history].reverse().find(m => m.from === 'bot');
        if (lastBotMsg?.menuKey) {
          setCurrentMenu(lastBotMsg.menuKey);
        }
      }
    } else {
      setTimeout(() => handleBotResponse('main_menu'), 500);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      const menu = menus[currentMenu];
      if (!menu?.buttons) return;

      const key = e.key;
      const button = menu.buttons.find(b => b.number === key);
      
      if (button) {
        e.preventDefault();
        handleButtonClick(button);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentMenu]);

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleButtonClick = (button) => {
    if (button.url) {
      window.open(button.url, '_blank');
      return;
    }

    if (button.phone) {
      handleCall(button.phone);
      setMessages((prev) => [...prev, { 
        from: 'user', 
        text: `📞 Calling ${button.text}...`, 
        timestamp: Date.now() 
      }]);
      return;
    }

    setMessages((prev) => [...prev, { 
      from: 'user', 
      text: button.text, 
      timestamp: Date.now() 
    }]);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setCurrentMenu(button.callback_data);
      handleBotResponse(button.callback_data);
    }, 600);
  };

  const handleBotResponse = (menuKey) => {
    const menu = menus[menuKey];
    
    if (menu) {
      setMessages((prev) => [
        ...prev,
        { 
          from: 'bot', 
          text: menu.text, 
          buttons: menu.buttons || [], 
          timestamp: Date.now(),
          menuKey: menuKey
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { 
          from: 'bot', 
          text: 'Action completed! How else can I help you?', 
          timestamp: Date.now() 
        },
      ]);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
    setCurrentMenu('main_menu');
    setTimeout(() => handleBotResponse('main_menu'), 300);
  };

  const formatText = (text) => {
    return text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-0 sm:p-4">
      <div className="w-full h-screen sm:h-[700px] sm:max-w-md bg-gradient-to-b from-gray-900 to-black sm:rounded-3xl sm:shadow-2xl overflow-hidden flex flex-col border border-gray-800">
        
        {/* Header */}
        <header className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border-b border-emerald-500/30 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/50">
              🤖
            </div>
            <div>
              <h1 className="font-bold text-white text-base">Echo AI Assistant</h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <p className="text-xs text-emerald-300">Online</p>
              </div>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="w-10 h-10 rounded-full bg-gray-800/50 hover:bg-gray-700/50 flex items-center justify-center transition-all border border-gray-700"
            aria-label="Clear chat"
          >
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-black p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {messages.length === 0 && !isTyping && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-4xl shadow-2xl shadow-emerald-500/50 animate-bounce">
                🤖
              </div>
              <p className="text-sm text-center">Starting conversation...</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div className={`max-w-[85%] ${msg.from === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    msg.from === 'user'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-sm shadow-lg shadow-emerald-500/30'
                      : 'bg-gray-800/80 backdrop-blur-sm text-gray-100 rounded-bl-sm border border-gray-700/50'
                  }`}
                >
                  <p
                    className="text-sm leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                  />
                </div>

                {/* Buttons */}
                {msg.buttons && msg.buttons.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.buttons.map((btn, btnIndex) => (
                      <button
                        key={btnIndex}
                        onClick={() => handleButtonClick(btn)}
                        className="w-full group relative overflow-hidden bg-gradient-to-r from-gray-800/90 to-gray-700/90 hover:from-emerald-500/20 hover:to-teal-500/20 text-gray-100 border border-gray-700/50 hover:border-emerald-500/50 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] text-left flex items-center justify-between backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-3">
                          {btn.number && (
                            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                              {btn.number}
                            </span>
                          )}
                          <span className="flex-1">{btn.text}</span>
                        </div>
                        
                        {btn.phone ? (
                          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        ) : btn.url ? (
                          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      </button>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-600 mt-2 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fadeIn">
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl rounded-bl-sm px-5 py-4 border border-gray-700/50">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce shadow-lg shadow-emerald-400/50" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce shadow-lg shadow-emerald-400/50" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce shadow-lg shadow-emerald-400/50" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-gray-900 to-black border-t border-gray-800 px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 bg-gray-800/50 backdrop-blur-sm rounded-full px-4 py-2.5 border border-gray-700/50">
              <p className="text-xs text-gray-400 text-center">💡 Use number keys (1-9, 0) for quick selection</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 text-center">Powered by Echo AI • Smart City Assistant</p>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-bounce {
          animation: bounce 0.6s infinite;
        }

        /* Custom scrollbar */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thumb-gray-700::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 3px;
        }

        .scrollbar-thumb-gray-700::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
      `}</style>
    </div>
  );
}