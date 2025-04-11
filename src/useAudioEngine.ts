import { useCallback, useEffect, useRef } from "react";
import { useSynthStore } from "./store/synthstore";

export const useAudioEngine = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isInitialized = useRef<boolean>(false);
  const isPlaying = useRef<boolean>(false);
  const oscNodeRef = useRef<OscillatorNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const {
    oscillatorType,
    filterCutoff,
    envAttack,
    envDecay,
    envSustain,
    envRelease,
  } = useSynthStore();

  const initializeAudioContext = useCallback(() => {
    if (isInitialized.current) {
      return;
    }
    audioCtxRef.current = new window.AudioContext();
    const gainNode = audioCtxRef.current.createGain();
    gainNodeRef.current = gainNode;
    gainNode.gain.setValueAtTime(0.5, audioCtxRef.current.currentTime);

    const filter = audioCtxRef.current.createBiquadFilter();
    gainNode.connect(filter);
    filter.connect(audioCtxRef.current.destination);
    filter.frequency.setValueAtTime(
      filterCutoff,
      audioCtxRef.current.currentTime
    );
    filterNodeRef.current = filter;
    isInitialized.current = true;
  }, [filterCutoff]);

  useEffect(() => {
    if (audioCtxRef.current && filterNodeRef.current) {
      filterNodeRef.current.frequency.setValueAtTime(
        filterCutoff,
        audioCtxRef.current.currentTime
      );
      console.debug(`new filterCutoff: ${filterCutoff}`);
    }
  }, [filterCutoff]);
  const noteOn = useCallback(() => {
    if (!isInitialized.current) {
      initializeAudioContext();
    }
    if (!audioCtxRef.current || !gainNodeRef.current) {
      return;
    }
    const ctx = audioCtxRef.current;
    if (oscNodeRef.current != null) {
      oscNodeRef.current.stop();
      oscNodeRef.current.disconnect();
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
      osc.disconnect();
      oscNodeRef.current = null;
    }
  }, []);

  const noteHold = useCallback(() => {
    if (!isInitialized.current) {
      initializeAudioContext();
    }
    if (!audioCtxRef.current || !gainNodeRef.current) {
      return;
    }
    const ctx = audioCtxRef.current;
    if (oscNodeRef.current != null) {
      oscNodeRef.current.stop();
      oscNodeRef.current.disconnect();
    }
    const osc = ctx.createOscillator();
    oscNodeRef.current = osc;
    osc.connect(gainNodeRef.current);
    const gainNode = gainNodeRef.current;
    gainNode.gain.linearRampToValueAtTime(1, audioCtxRef.current.currentTime + envAttack);
    gainNode.gain.setTargetAtTime(envSustain, audioCtxRef.current.currentTime + envAttack, envDecay/ 5); // (5秒後に対象とする値の99%まで近づく)
    gainNode.gain.setValueAtTime(1, envAttack)
    osc.type = oscillatorType;
    osc.start();
    isPlaying.current = true;
  }, [oscillatorType, initializeAudioContext, envAttack, envDecay, envSustain]);

  const noteRelease = useCallback(() => {
    if(!gainNodeRef.current || !audioCtxRef.current)
    {
      return;
    }
    const gainNode = gainNodeRef.current;
    gainNode.gain.cancelScheduledValues(0);
    gainNode.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + envRelease)
  }, [])
  return { initializeAudioContext, noteHold, noteRelease, noteOn, noteOff };
};
