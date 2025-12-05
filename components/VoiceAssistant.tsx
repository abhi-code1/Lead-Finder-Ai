import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, Volume2, X } from 'lucide-react';
import { createPcmBlob, decodeAudioData, base64ToUint8Array } from '../services/audioUtils';

interface VoiceAssistantProps {
  onClose: () => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  const [volume, setVolume] = useState(0);

  // Audio Contexts
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const sessionRef = useRef<any>(null); 
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const apiKey = process.env.API_KEY;

  const stopAudio = () => {
    // Close session if active
    if (sessionRef.current) {
        try { 
            sessionRef.current.close(); 
            console.log("Live session closed manually");
        } catch(e) {
            console.warn("Error closing session", e);
        }
        sessionRef.current = null;
    }

    if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current = null;
    }
    if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
    }
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    if (inputContextRef.current) {
        inputContextRef.current.close();
        inputContextRef.current = null;
    }
    if (outputContextRef.current) {
        outputContextRef.current.close();
        outputContextRef.current = null;
    }
    
    // Stop all playing audio
    audioSourcesRef.current.forEach(source => {
        try { source.stop(); } catch(e) {}
    });
    audioSourcesRef.current.clear();
    
    setIsActive(false);
    setStatus('idle');
    setVolume(0);
  };

  const startSession = async () => {
    if (!apiKey) {
      alert("API Key missing");
      return;
    }
    
    // Cleanup any previous session first
    stopAudio();
    
    setStatus('connecting');
    setIsActive(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      // Initialize Audio
      inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            console.log("Live API Connected");
            setStatus('listening');

            // Setup Input Processing
            if (!inputContextRef.current) return;
            const source = inputContextRef.current.createMediaStreamSource(stream);
            sourceRef.current = source;
            
            const processor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              // Calculate volume for visualizer
              let sum = 0;
              for (let i = 0; i < inputData.length; i++) {
                sum += inputData[i] * inputData[i];
              }
              const rms = Math.sqrt(sum / inputData.length);
              setVolume(rms);

              const pcmBlob = createPcmBlob(inputData);
              
              sessionPromise.then(session => {
                  session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            processor.connect(inputContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
             // Handle Audio Output
             const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
             if (base64Audio && outputContextRef.current) {
                setStatus('speaking');
                const audioCtx = outputContextRef.current;
                
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtx.currentTime);
                
                const audioBuffer = await decodeAudioData(
                    base64ToUint8Array(base64Audio),
                    audioCtx
                );
                
                const source = audioCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioCtx.destination);
                
                source.addEventListener('ended', () => {
                    audioSourcesRef.current.delete(source);
                    if (audioSourcesRef.current.size === 0) {
                        setStatus('listening');
                    }
                });
                
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                audioSourcesRef.current.add(source);
             }

             if (message.serverContent?.turnComplete) {
                // Turn complete logic if needed
             }
          },
          onclose: () => {
             console.log("Live API Closed");
             stopAudio();
          },
          onerror: (err) => {
              console.error("Live API Error", err);
              stopAudio();
          }
        },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
            },
            systemInstruction: "You are an expert sales assistant for the 'Lead Finder AI' platform. Help the user define their ideal customer profile, suggest industries to target, and offer tips on outreach strategies. Keep answers concise, energetic, and spoken naturally."
        }
      });
      
      // Store session for cleanup
      sessionPromise.then(sess => {
          sessionRef.current = sess;
      });

    } catch (error) {
      console.error("Failed to start session:", error);
      setStatus('idle');
      setIsActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
        {!isActive ? (
            <button 
                onClick={startSession}
                className="bg-royal-600 hover:bg-royal-500 text-white rounded-full p-4 shadow-lg flex items-center gap-2 transition-all hover:scale-105"
            >
                <div className="relative">
                    <Mic className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-500"></span>
                    </span>
                </div>
                <span className="font-semibold pr-1">AI Assistant</span>
            </button>
        ) : (
             <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 border border-royal-100 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-royal-900 flex items-center gap-2">
                        <Volume2 className={status === 'speaking' ? "text-neon-500 animate-pulse" : "text-gray-400"} />
                        Live Assistant
                    </h3>
                    <button onClick={stopAudio} className="text-gray-400 hover:text-red-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="flex flex-col items-center justify-center h-32 bg-royal-50 rounded-xl mb-4 relative overflow-hidden transition-all">
                    {/* Visualizer Simulation */}
                    <div className="flex items-center gap-1 h-full">
                        {[...Array(5)].map((_, i) => (
                             <div 
                                key={i}
                                className={`w-3 bg-royal-500 rounded-full transition-all duration-75`}
                                style={{ 
                                    height: status === 'listening' ? `${Math.max(10, volume * 400 * (Math.random() + 0.5))}%` : 
                                            status === 'speaking' ? `${20 + Math.random() * 60}%` : '10%',
                                    opacity: status === 'idle' ? 0.3 : 1
                                }}
                             />
                        ))}
                    </div>
                    <div className="absolute bottom-2 text-xs font-medium text-royal-600 uppercase tracking-wider">
                        {status}
                    </div>
                </div>

                <div className="text-center text-sm text-gray-500">
                    {status === 'listening' ? "Listening..." : status === 'speaking' ? "Speaking..." : "Connecting..."}
                </div>
             </div>
        )}
    </div>
  );
};

export default VoiceAssistant;