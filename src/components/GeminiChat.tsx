import { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, X, Send, Mic, MapPin, Loader2, Volume2, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { PRICING_PACKAGES, ADD_ONS, CONTACT_INFO } from '@/lib/utils';
import { useLiveApi } from '@/hooks/useLiveApi';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: 'user' | 'model';
  text: string;
  groundingMetadata?: any;
}

const SYSTEM_INSTRUCTION = `You are a helpful and enthusiastic sales assistant for Aswad Creatives, a professional graphics design agency.
Your goal is to help customers choose the right branding package for their needs.

Here is our pricing information:
${JSON.stringify(PRICING_PACKAGES, null, 2)}

Add-ons:
${JSON.stringify(ADD_ONS, null, 2)}

Contact Info:
${JSON.stringify(CONTACT_INFO, null, 2)}

Guidelines:
- Be professional, creative, and friendly.
- Recommend packages based on the user's needs (e.g., startup -> Starter, established -> Business/Premium).
- If asked about location, use the googleMaps tool to find "graphics design" or "printing services" in Addis Ababa to show you are knowledgeable about the local area, or just explain you are based in Addis Ababa.
- Always mention prices in ETB.
- Keep responses concise and easy to read.
`;

export function GeminiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hi! I'm your Aswad Creatives assistant. How can I help you elevate your brand today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { connect, disconnect, isConnected, volume } = useLiveApi();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, mode]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Construct history for the API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          ...history,
          { role: 'user', parts: [{ text: input }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ googleMaps: {} }],
        }
      });

      const text = response.text || "I'm sorry, I couldn't generate a response.";
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

      setMessages(prev => [...prev, { role: 'model', text, groundingMetadata }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceMode = () => {
    if (mode === 'voice') {
      disconnect();
      setMode('text');
    } else {
      setMode('voice');
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300",
          isOpen ? "scale-0 opacity-0" : "bg-orange-500 text-white scale-100 opacity-100"
        )}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-zinc-800 flex items-center justify-between border-b border-zinc-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <h3 className="font-bold text-white">Aswad Assistant</h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleVoiceMode}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    mode === 'voice' ? "bg-orange-500 text-white" : "hover:bg-zinc-700 text-zinc-400"
                  )}
                  title={mode === 'voice' ? "Switch to Text" : "Switch to Voice"}
                >
                  {mode === 'voice' ? <MessageCircle className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => {
                    disconnect();
                    setIsOpen(false);
                  }}
                  className="p-2 hover:bg-zinc-700 rounded-full transition-colors text-zinc-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            {mode === 'text' ? (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={cn("flex flex-col max-w-[85%]", msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start")}>
                      <div className={cn(
                        "p-3 rounded-2xl text-sm",
                        msg.role === 'user' 
                          ? "bg-orange-500 text-white rounded-tr-none" 
                          : "bg-zinc-800 text-zinc-200 rounded-tl-none"
                      )}>
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                      
                      {/* Grounding Sources */}
                      {msg.groundingMetadata?.groundingChunks && (
                        <div className="mt-2 text-xs space-y-1">
                          {msg.groundingMetadata.groundingChunks.map((chunk: any, i: number) => (
                            chunk.web?.uri ? (
                              <a 
                                key={i} 
                                href={chunk.web.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-400 hover:underline bg-zinc-800/50 p-1 rounded"
                              >
                                <MapPin className="w-3 h-3" />
                                {chunk.web.title || "Source"}
                              </a>
                            ) : null
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-zinc-500 text-sm p-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-zinc-800 border-t border-zinc-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask about prices..."
                      className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <Button 
                      size="icon" 
                      onClick={handleSend} 
                      disabled={isLoading || !input.trim()}
                      className="rounded-full bg-orange-500 hover:bg-orange-600"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              /* Voice Mode UI */
              <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8 bg-zinc-900">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-white">Voice Assistant</h3>
                  <p className="text-zinc-400">Talk to us naturally about your branding needs.</p>
                </div>

                <div className="relative">
                  {/* Visualizer Rings */}
                  {isConnected && (
                    <>
                      <motion.div 
                        animate={{ scale: 1 + volume * 2, opacity: 0.5 - volume }}
                        className="absolute inset-0 bg-orange-500 rounded-full blur-xl"
                      />
                      <motion.div 
                        animate={{ scale: 1 + volume, opacity: 0.8 }}
                        className="absolute inset-0 bg-orange-500/30 rounded-full"
                      />
                    </>
                  )}
                  
                  <button
                    onClick={isConnected ? disconnect : connect}
                    className={cn(
                      "relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl",
                      isConnected 
                        ? "bg-red-500 hover:bg-red-600" 
                        : "bg-orange-500 hover:bg-orange-600"
                    )}
                  >
                    {isConnected ? (
                      <MicOff className="w-10 h-10 text-white" />
                    ) : (
                      <Mic className="w-10 h-10 text-white" />
                    )}
                  </button>
                </div>

                <div className="h-8 flex items-center justify-center gap-1">
                  {isConnected ? (
                    <div className="flex items-center gap-2 text-orange-400 animate-pulse">
                      <Volume2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Listening...</span>
                    </div>
                  ) : (
                    <span className="text-zinc-500 text-sm">Tap microphone to start</span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
