import { useCallback, useEffect, useRef } from "react";
import { useSynthStore } from "./store/synthstore";

let audioContext: AudioContext | null = null;

// MIDIノート番号を周波数に変換。a_n/a_n-1 = 2^(1/12)
const midiNoteToFrequency = (midiNote: number) => {
  const semitone = midiNote - 69;
  return 440 * Math.pow(2, semitone / 12);
};

interface ActiveNoteNodes {
  oscillators: OscillatorNode[];
  oscGains: GainNode[];
  envelopeGain: GainNode;
}
// const maxVoice = 8;

export const useAudioEngine = () => {
  const masterGainNodeRef = useRef<GainNode | null>(null);
  const isInitialized = useRef<boolean>(false);
  const isPlaying = useRef<boolean>(false);
  //id -> オシレーターのマップ
  const activeOscillatorNodes = useRef<Map<number, OscillatorNode>>(new Map());
  //id -> オシレーターのゲインのマップ
  const activeOscillatorGains = useRef<Map<number, GainNode>>(new Map());

  // MIDIノート番号に対して、オシレーターとゲインノード群を作成する
  const activeNoteRef = useRef<Map<number, ActiveNoteNodes>>(new Map());

  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  //const filterGainRef = useRef<GainNode | null>(null);

  const lfoNodeRef = useRef<OscillatorNode | null>(null);
  const filterLFOGainRef = useRef<GainNode | null>(null);
  const {
    voicing,
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
    console.log("Initialized");
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
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(filterCutoff, audioContext.currentTime);
    filter.Q.setValueAtTime(filterResonance, audioContext.currentTime);
    filterNodeRef.current = filter;

    //LFOの初期化
    const lfo = audioContext.createOscillator();
    lfo.type = lfoType;
    lfo.frequency.setValueAtTime(lfoFreq, audioContext.currentTime);

    lfoNodeRef.current = lfo;

    filterLFOGainRef.current = audioContext.createGain();
    filterLFOGainRef.current.gain.setValueAtTime(
      filterLFOAmount,
      audioContext.currentTime
    );

    lfo.connect(filterLFOGainRef.current);
    filterLFOGainRef.current.connect(filter.frequency);

    isInitialized.current = true;

    //マスターに接続
    filter.connect(masterGainNode);
    masterGainNode.connect(audioContext.destination);
    isInitialized.current = true;

    lfo.start();
  }, [filterCutoff, filterResonance, lfoFreq, lfoType]);

  useEffect(() => {
    if (audioContext && filterNodeRef.current && filterLFOGainRef.current) {
      filterNodeRef.current.frequency.setValueAtTime(
        filterCutoff,
        audioContext.currentTime
      );
      filterNodeRef.current.Q.setValueAtTime(
        filterResonance,
        audioContext.currentTime
      );
      filterLFOGainRef.current.gain.setValueAtTime(
        filterLFOAmount,
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
    (midiNote: number) => {
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

      // モノフォニックかポリフォニックかで分岐
      if (voicing == "mono") {
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
          const frequency =
            midiNoteToFrequency(midiNote) *
            Math.pow(2, oscSettings.octaveOffset);
          // const frequency = freq * Math.pow(2, oscSettings.octaveOffset);
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
      } else {
        // ポリフォニックの場合

        const activeNotes = activeNoteRef.current;
        //同じ音が鳴っていないか
        if (activeNotes.has(midiNote)) {
          forceNoteRelease(midiNote);
        }
        // //発音数確認
        // if (activeNotes.size >= maxVoice) {
        //   const iter = activeNotes.entries();
        //   const oldestNote = iter.next();
        //   const oldNodes = oldestNote.value?.[1];
        //   if (oldNodes) {
        //     oldNodes.envelopeGains.disconnect();
        //     oldNodes.oscillators.forEach((osc) => {
        //       osc.stop();
        //       osc.disconnect();
        //     });
        //   }
        // }

        const adsrGain = audioContext.createGain();
        const newOscs: OscillatorNode[] = [];
        const newOscGains: GainNode[] = [];
        //新しいノート作成
        oscillators.forEach((oscSettings) => {
          if (!audioContext || !filterNodeRef.current) return;
          const now = audioContext.currentTime;
          const frequency =
            midiNoteToFrequency(midiNote) *
            Math.pow(2, oscSettings.octaveOffset);
          const osc = audioContext.createOscillator();
          osc.frequency.setValueAtTime(frequency, now);
          osc.type = oscSettings.type;
          const oscGain = audioContext.createGain();
          oscGain.gain.setValueAtTime(oscSettings.gain, now);
          osc.connect(oscGain);
          oscGain.connect(adsrGain);
          newOscs.push(osc);
          newOscGains.push(oscGain);
        });
        const newNodes: ActiveNoteNodes = {
          oscillators: newOscs,
          oscGains: newOscGains,
          envelopeGain: adsrGain,
        };
        const now = audioContext.currentTime;
        adsrGain.gain.setValueAtTime(0, now);
        adsrGain.gain.linearRampToValueAtTime(1, now + envAttack);
        adsrGain.gain.setTargetAtTime(
          envSustain,
          now + envAttack,
          envDecay / 5
        );

        newOscs.forEach((osc) => {
          osc.start();
        });
        adsrGain.connect(filterNodeRef.current)
        activeNotes.set(midiNote, newNodes);
        activeNoteRef.current = activeNotes;
        isPlaying.current = true;
      }
    },
    [oscillators, initializeAudioContext, envAttack, envDecay, envSustain]
  );

  const noteRelease = useCallback(
    (midiNote: number) => {
      if (!isPlaying.current) {
        return;
      }

      if (!masterGainNodeRef.current || !audioContext) {
        return;
      }
      const now = audioContext.currentTime;
      if (voicing == "mono") {
        const gainNode = masterGainNodeRef.current;
        gainNode.gain.cancelScheduledValues(0);
        gainNode.gain.linearRampToValueAtTime(0, now + envRelease);
      } else {
        const activeNotes = activeNoteRef.current;
        const nodes = activeNotes.get(midiNote);
        if (nodes) {
          nodes.envelopeGain.gain.cancelScheduledValues(0);
          nodes.envelopeGain.gain.linearRampToValueAtTime(0, now + envRelease);
          const stopTime = now + envRelease + 0.1;
          nodes.oscillators.forEach((osc) => {
            osc.stop(stopTime);
          });
          setTimeout(() => {
            nodes.oscillators.forEach((osc) => osc.disconnect());
            nodes.envelopeGain.disconnect();
            nodes.oscGains.forEach((gain) => gain.disconnect());
            activeNoteRef.current.delete(midiNote);
          }, (stopTime - now) * 1000);
        }
      }
    },
    [envRelease]
  );
  const forceNoteRelease = useCallback(
    (midiNote: number) => {
      if (!isPlaying.current) {
        return;
      }

      if (!masterGainNodeRef.current || !audioContext) {
        return;
      }

      const activeNotes = activeNoteRef.current;
      const nodes = activeNotes.get(midiNote);
      if (nodes) {
        nodes.envelopeGain.gain.cancelScheduledValues(0);
        nodes.oscillators.forEach((osc) => {
          osc.stop();
        });
        nodes.oscillators.forEach((osc) => osc.disconnect());
        nodes.envelopeGain.disconnect();
        nodes.oscGains.forEach((gain) => gain.disconnect());
        activeNoteRef.current.delete(midiNote);
      }
    },
    [envRelease]
  );
  return { initializeAudioContext, noteHold, noteRelease };
};
