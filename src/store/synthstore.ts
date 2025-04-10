import { create } from "zustand";

//export type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle';

interface SynthState {
  /*
    必要な状態：
    oscillatorType(waveFormのこと。WebAudioAPIの方の命名に準拠)
    octave
    */

  //OSC
  oscillatorType: OscillatorType;

  //filter
  filterCutoff: number;
  filterResonance: number;

  //Envelope(ADSR)
  envAttack: number;
  envDecay: number;
  envSustain: number;
  envRelease: number;

  setOscillatorType: (oscType: OscillatorType) => void;
  setFilterCutoff: (value: number) => void;
  setFilterResonance: (value: number) => void;
  setEnvAttack: (value: number) => void;
  setEnvDecay: (value: number) => void;
  setEnvSustain: (value: number) => void;
  setEnvRelease: (value: number) => void;
}

export const useSynthStore = create<SynthState>((set) => ({
  oscillatorType: "sine",
  filterCutoff: 5000,
  filterResonance: 1,
  envAttack: 0.01,
  envDecay: 0.5,
  envSustain: 0.9,
  envRelease: 1,

  setOscillatorType: (oscType) => set({ oscillatorType: oscType }),
  setFilterCutoff: (value) => set({ filterCutoff: value }),
  setFilterResonance: (value) => set({ filterResonance: value }),
  setEnvAttack: (value) => set({ envAttack: value }),
  setEnvDecay: (value) => set({ envDecay: value }),
  setEnvSustain: (value) => set({ envSustain: value }),
  setEnvRelease: (value) => set({ envRelease: value }),
}));
