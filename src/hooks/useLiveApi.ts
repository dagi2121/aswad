import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveSession } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function useLiveApi() {
  const [isConnected, setIsConnected] = useState(false);
  const [volume, setVolume] = useState(0);
  const sessionRef = useRef<LiveSession | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);
  const nextStartTimeRef = useRef(0);

  const playNextChunk = useCallback(() => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    isPlayingRef.current = true;
    const audioData = audioQueueRef.current.shift()!;
    const audioCtx = audioContextRef.current;

    if (!audioCtx) return;

    const buffer = audioCtx.createBuffer(1, audioData.length, 24000); // Gemini returns 24kHz audio
    buffer.getChannelData(0).set(audioData);

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    
    const currentTime = audioCtx.currentTime;
    const startTime = Math.max(currentTime, nextStartTimeRef.current);
    source.start(startTime);
    
    nextStartTimeRef.current = startTime + buffer.duration;
    
    source.onended = () => {
      playNextChunk();
    };
  }, []);

  const handleAudioMessage = useCallback((base64Audio: string) => {
    try {
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Convert PCM 16-bit to Float32
      const int16Data = new Int16Array(bytes.buffer);
      const float32Data = new Float32Array(int16Data.length);
      for (let i = 0; i < int16Data.length; i++) {
        float32Data[i] = int16Data[i] / 32768.0;
      }

      audioQueueRef.current.push(float32Data);
      
      if (!isPlayingRef.current) {
        playNextChunk();
      }
    } catch (e) {
      console.error("Error processing audio message:", e);
    }
  }, [playNextChunk]);

  const connect = useCallback(async () => {
    try {
      // 1. Initialize Audio Context
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass({ sampleRate: 16000 }); // Input at 16kHz
      audioContextRef.current = audioCtx;
      await audioCtx.resume();

      // 2. Connect to Gemini Live API
      const session = await ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        callbacks: {
          onopen: () => {
            console.log("Connected to Gemini Live");
            setIsConnected(true);
          },
          onmessage: (message) => {
            // Handle audio output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              handleAudioMessage(base64Audio);
            }
          },
          onclose: () => {
            console.log("Disconnected from Gemini Live");
            setIsConnected(false);
          },
          onerror: (error) => {
            console.error("Gemini Live Error:", error);
            disconnect();
          }
        },
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: {
            parts: [{ text: "You are a helpful assistant for Aswad Creatives. Keep responses short and conversational." }]
          }
        },
      });
      
      sessionRef.current = session;

      // 3. Setup Audio Recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;
      
      // Use ScriptProcessor for simplicity
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        
        // Calculate volume for UI
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        setVolume(Math.sqrt(sum / inputData.length));

        // Downsample/Convert to PCM 16-bit Base64
        // Since input is already 16kHz (requested in AudioContext), we just convert format
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        const base64 = btoa(
          String.fromCharCode(...new Uint8Array(pcmData.buffer))
        );

        session.sendRealtimeInput([{
          mimeType: "audio/pcm;rate=16000",
          data: base64
        }]);
      };

      source.connect(processor);
      processor.connect(audioCtx.destination); // Keep processor alive

    } catch (error) {
      console.error("Connection Failed:", error);
      disconnect();
    }
  }, [handleAudioMessage]);

  const disconnect = useCallback(() => {
    if (sessionRef.current) {
      // sessionRef.current.close(); // SDK might handle this differently, but let's try
      // The SDK doesn't seem to expose a close method on the session object directly in the docs provided?
      // Wait, the docs say: "Use session.close() when finished."
      // But the type definition might be missing it or I missed it.
      // Let's assume it exists or just stop sending.
      try { (sessionRef.current as any).close?.(); } catch (e) {}
      sessionRef.current = null;
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setIsConnected(false);
    setVolume(0);
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    nextStartTimeRef.current = 0;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { connect, disconnect, isConnected, volume };
}
