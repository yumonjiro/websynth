import { create } from "zustand";

//export type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle';

interface OscillatorSettings {
  //オシレーターを識別するための番号
  id: number;
  //
  enabled: boolean;
  //
  type: OscillatorType;
  // Amplitude
  gain: number;
  octaveOffset: number;
  detune: number;
}
export type VoicingType = "mono" | "poly";

interface SynthState {
  /*
    必要な状態：
    oscillatorType(waveFormのこと。WebAudioAPIの方の命名に準拠)
    octave
    */
  voicing: VoicingType;
  //OSC
  oscillators: OscillatorSettings[];

  //filter
  filterCutoff: number;
  filterResonance: number;
  filterLFOAmount: number;

  //Amp Envelope(ADSR)
  envAttack: number;
  envDecay: number;
  envSustain: number;
  envRelease: number;

  // LFO
  lfoFreq: number;
  lfoEnvAmount: number;
  lfoType: OscillatorType;

  setVoicingType: (voicingType: VoicingType) => void;
  setOscillatorType: (id: number, oscType: OscillatorType) => void;
  setOscillatorGain: (id: number, value: number) => void;
  //setOscillatorOctave: (id:number, value: number) => void;

  setFilterCutoff: (value: number) => void;
  setFilterResonance: (value: number) => void;
  setFilterLFOAmount: (value: number) => void;
  setEnvAttack: (value: number) => void;
  setEnvDecay: (value: number) => void;
  setEnvSustain: (value: number) => void;
  setEnvRelease: (value: number) => void;

  setLFOType: (type:OscillatorType) => void;
  setLFOFreq: (value: number) => void;
  setLFOEnvAmount: (value: number) => void;
}

const initialOscillators: OscillatorSettings[] = [
  { id: 1, enabled: true, gain: 0.5, type: "sine", octaveOffset: 0, detune: 0 },
  { id: 2, enabled: true, gain: 0.5, type: "sine", octaveOffset: 0, detune: 0 },
];
export const useSynthStore = create<SynthState>((set) => ({
  voicing: "mono",
  oscillators: initialOscillators,
  filterCutoff: 400,
  filterResonance: 1,
  filterLFOAmount: 0,
  envAttack: 0.01,
  envDecay: 0.5,
  envSustain: 0.9,
  envRelease: 1,
  lfoType: "triangle",
  lfoFreq: 1,
  lfoEnvAmount: 0,
  setVoicingType: (voicingType) => set({ voicing: voicingType }),
  setOscillatorType: (id, oscType) =>
    set((state) => ({
      oscillators: state.oscillators.map((osc) =>
        osc.id === id ? { ...osc, type: oscType } : osc
      ),
    })),
  setOscillatorGain: (id, value) =>
    set((state) => ({
      oscillators: state.oscillators.map((osc) =>
        osc.id === id ? { ...osc, gain: value } : osc
      ),
    })),
  setFilterCutoff: (value) => set({ filterCutoff: value }),
  setFilterResonance: (value) => set({ filterResonance: value }),
  setFilterLFOAmount: (value) => set({ filterLFOAmount: value }),
  setEnvAttack: (value) => set({ envAttack: value }),
  setEnvDecay: (value) => set({ envDecay: value }),
  setEnvSustain: (value) => set({ envSustain: value }),
  setEnvRelease: (value) => set({ envRelease: value }),
  setLFOType: (type) => set({ lfoType:type }),

  setLFOFreq: (value) => set({ lfoFreq:value}),
  setLFOEnvAmount: (value) => set({lfoEnvAmount:value}),
}));
