import { useCallback, useEffect, useRef } from "react";
import { useSynthStore } from "./store/synthstore";

let audioContext: AudioContext | null = null;
export const useAudioEngine = () => {
  const masterGainNodeRef = useRef<GainNode | null>(null);
  const isInitialized = useRef<boolean>(false);
  const isPlaying = useRef<boolean>(false);
  //id -> オシレーターのマップ
  const activeOscillatorNodes = useRef<Map<number, OscillatorNode>>(new Map());
  //id -> オシレーターのゲインのマップ
  const activeOscillatorGains = useRef<Map<number, GainNode>>(new Map());

  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  //const filterGainRef = useRef<GainNode | null>(null);

  const lfoNodeRef = useRef<OscillatorNode | null>(null);
  const lfoGainRef = useRef<GainNode | null>(null);
  const {
    oscillators,
    filterCutoff,
    filterResonance,
    filterLFOAmount,
    lfoType,
    lfoFreq,
    envAttack,
    envDecay,
    envSustain,
    envRelease,
  } = useSynthStore();

  const initializeAudioContext = useCallback(() => {
    console.log("Initialized")
    //audioContext・フィルター・マスターゲインノード・LFOノードの初期化を行う
    if (isInitialized.current) {
      return;
    }
    audioContext = new window.AudioContext();
    if (!audioContext) {
      console.log("Failed to initialize Audio");
    }
    //マスターゲインノード
    const masterGainNode = audioContext.createGain();
    masterGainNodeRef.current = masterGainNode;
    masterGainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    //フィルターの初期化
    const filter = audioContext.createBiquadFilter();
    filter.frequency.setValueAtTime(filterCutoff, audioContext.currentTime);
    filter.Q.setValueAtTime(filterResonance, audioContext.currentTime);
    filterNodeRef.current = filter;

    //LFOの初期化
    const lfo = audioContext.createOscillator();
    lfo.type = lfoType;
    lfo.frequency.setValueAtTime(lfoFreq, audioContext.currentTime);

    lfoNodeRef.current = lfo;
    lfoGainRef.current = audioContext.createGain();
    lfoGainRef.current.gain.setValueAtTime(1, audioContext.currentTime)

    lfo.connect(lfoGainRef.current);
    lfoGainRef.current.connect(filter);

    isInitialized.current = true;

    //マスターに接続
    filter.connect(masterGainNode);
    masterGainNode.connect(audioContext.destination);
    isInitialized.current = true;

    lfo.start();
  }, [filterCutoff, filterResonance, lfoFreq, lfoType]);

  useEffect(() => {
    if (audioContext && filterNodeRef.current) {
      filterNodeRef.current.frequency.setValueAtTime(
        filterCutoff,
        audioContext.currentTime
      );
      filterNodeRef.current.Q.setValueAtTime(
        filterResonance,
        audioContext.currentTime
      );
      console.debug(
        `new filterCutoff: ${filterCutoff} \n new filter Q: ${filterResonance}`
      );
    }
  }, [filterCutoff, filterResonance, filterLFOAmount]);

  useEffect(() => {
    console.log("LFO Update Function Called");
    if (audioContext && lfoNodeRef.current) {
      lfoNodeRef.current.frequency.setValueAtTime(
        lfoFreq,
        audioContext.currentTime
      );
      lfoNodeRef.current.type = lfoType;
      console.log(`new LFO Frequency:${lfoFreq}}`);
      console.log(`new LFO Type:${lfoType}}`);
      
    }
  }, [lfoFreq, lfoType]);

  const noteHold = useCallback(
    (freq: number) => {
      if (!isInitialized.current) {
        initializeAudioContext();
      }
      if (
        !audioContext ||
        !masterGainNodeRef.current ||
        !filterNodeRef.current
      ) {
        return;
      }
      if (activeOscillatorNodes.current.size > 0) {
        activeOscillatorNodes.current.forEach((osc) => {
          osc.stop();
          osc.disconnect();
        });
      }

      oscillators.forEach((oscSettings) => {
        if (
          !audioContext ||
          !masterGainNodeRef.current ||
          !filterNodeRef.current
        )
          return;
        const now = audioContext.currentTime;
        const frequency = freq * Math.pow(2, oscSettings.octaveOffset);
        const osc = audioContext.createOscillator();
        osc.frequency.setValueAtTime(frequency, now);
        osc.type = oscSettings.type;
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(oscSettings.gain, now);

        //接続
        osc.connect(gainNode);
        gainNode.connect(filterNodeRef.current);

        activeOscillatorGains.current.set(oscSettings.id, gainNode);
        activeOscillatorNodes.current.set(oscSettings.id, osc);
      });

      //エンベロープを一旦リセット
      const masterGain = masterGainNodeRef.current;
      masterGain.gain.cancelScheduledValues(0);
      masterGain.gain.setValueAtTime(0, audioContext.currentTime);
      masterGain.gain.linearRampToValueAtTime(
        1,
        audioContext.currentTime + envAttack
      );
      masterGain.gain.setTargetAtTime(
        envSustain,
        audioContext.currentTime + envAttack,
        envDecay / 5
      ); // (envAttack + envDecay秒後に対象とする値の99%まで近づく)

      activeOscillatorNodes.current.forEach((osc) => {
        osc.start();
      });
      isPlaying.current = true;
    },
    [oscillators, initializeAudioContext, envAttack, envDecay, envSustain]
  );

  const noteRelease = useCallback(() => {
    if (!isPlaying.current) {
      return;
    }
    if (!masterGainNodeRef.current || !audioContext) {
      return;
    }
    const gainNode = masterGainNodeRef.current;
    gainNode.gain.cancelScheduledValues(0);
    gainNode.gain.linearRampToValueAtTime(
      0,
      audioContext.currentTime + envRelease
    );
  }, [envRelease]);
  return { initializeAudioContext, noteHold, noteRelease };
};
