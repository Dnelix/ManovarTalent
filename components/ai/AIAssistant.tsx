import React, { useState } from 'react';
import { X, Send, Bot, Sparkles, BrainCircuit, Activity } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface AIAssistantProps {
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hello! I am your performance context assistant. I can help you analyze trends, suggest objectives, or summarize team health. How can I assist you today?',
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Implement handleSend with Gemini 3 API following @google/genai guidelines
  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;
    
    const userPrompt = inputValue;
    setMessages(prev => [...prev, { role: 'user', content: userPrompt, type: 'text' }]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      // Use the injected API_KEY from environment variables
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userPrompt,
        config: {
          systemInstruction: 'You are Manovar AI, a world-class performance context assistant. Help users analyze performance trends, suggest OKRs/KPIs, and provide organizational insights. Be professional, data-driven, and concise. If you suggest a specific goal, offer to help draft it.',
        }
      });

      const text = response.text || "I apologize, but I'm unable to provide an analysis right now.";
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: text,
        type: text.toLowerCase().includes('suggest') || text.toLowerCase().includes('objective') ? 'insight' : 'text'
      }]);
    } catch (error) {
      console.error('Gemini API Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I encountered an error connecting to the intelligence engine. Please try again shortly.',
        type: 'text'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed top-16 right-0 bottom-0 w-96 bg-white shadow-2xl border-l border-slate-200 flex flex-col z-40 animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-primary/5">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 leading-none">Manovar AI</h3>
            <div className="flex items-center mt-1">
              <span className={`w-1.5 h-1.5 ${isTyping ? 'bg-amber-500 animate-pulse' : 'bg-green-500'} rounded-full mr-1.5`}></span>
              <span className="text-[10px] text-slate-500 font-medium">
                {isTyping ? 'Analyzing Context...' : 'Contextual Engine Active'}
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-md transition-all"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/30">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[85%] rounded-2xl p-3 text-sm shadow-sm
              ${msg.role === 'user' 
                ? 'bg-primary text-white' 
                : 'bg-white border border-slate-200 text-slate-700'}
            `}>
              <div className="flex items-center mb-1">
                {msg.role === 'assistant' && (
                   <span className="text-[10px] uppercase font-bold text-primary mr-2 flex items-center tracking-wider">
                     <Sparkles size={10} className="mr-1" /> Assistant
                   </span>
                )}
              </div>
              <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              {msg.type === 'insight' && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
                  <button className="bg-primary/10 text-primary text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-all">
                    Draft Objective
                  </button>
                  <button className="bg-slate-100 text-slate-600 text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-all">
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex items-center space-x-2">
               <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
               <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></div>
               <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center space-x-2 mb-3">
          <div className="px-2 py-1 bg-secondary/10 rounded text-[10px] font-bold text-secondary-600 flex items-center">
            <Activity size={12} className="mr-1" /> Real-time context: Engineering
          </div>
          <div className="px-2 py-1 bg-purple-50 rounded text-[10px] font-bold text-purple-600 flex items-center">
            <BrainCircuit size={12} className="mr-1" /> Strategy Pillar 1
          </div>
        </div>
        <div className="relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Ask anything about performance..."
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none resize-none transition-all pr-12 min-h-[80px]"
            disabled={isTyping}
          />
          <button 
            onClick={handleSend}
            className="absolute right-3 bottom-3 p-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-all disabled:opacity-50"
            disabled={!inputValue.trim() || isTyping}
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-center">
          AI generated content may contain errors. Please verify before finalizing.
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;
