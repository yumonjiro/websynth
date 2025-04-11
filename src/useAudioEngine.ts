import { useCallback, useRef } from "react";
import { useSynthStore } from "./store/synthstore";

export const useAudioEngine = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isInitialized = useRef<boolean>(false);
  const isPlaying = useRef<boolean>(false);
  const oscNodeRef = useRef<OscillatorNode | null>(null);

  const { oscillatorType } = useSynthStore();

  const initializeAudioContext = useCallback(() => {
    if (isInitialized.current) {
      return;
    }
    audioCtxRef.current = new window.AudioContext();
    const gainNode = audioCtxRef.current.createGain();
    gainNodeRef.current = gainNode;
    gainNode.gain.setValueAtTime(0.5, audioCtxRef.current.currentTime);
    gainNode.connect(audioCtxRef.current.destination);

    isInitialized.current = true;
  }, []);

  const noteOn = useCallback(() => {
    if (!isInitialized) {
      initializeAudioContext();
    }
    if (!audioCtxRef.current || !gainNodeRef.current) {
      return;
    }
    const ctx = audioCtxRef.current;
    if(oscNodeRef.current != null)
    {
        oscNodeRef.current.stop();
    }
    const osc = ctx.createOscillator();
    oscNodeRef.current = osc;
    osc.connect(gainNodeRef.current);
    osc.type = oscillatorType;
    osc.start();
    isPlaying.current = true;
  }, [oscillatorType, initializeAudioContext]);

  const noteOff = useCallback(() => {
    if (!isPlaying.current) {
      return;
    }
    if (oscNodeRef.current) {
      const osc = oscNodeRef.current;
      osc.stop();
      oscNodeRef.current = null;
    }
  }, []);
  return {initializeAudioContext, noteOn, noteOff};
};
