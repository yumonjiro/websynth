import { create } from "zustand";

//export type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle';

interface OscillatorSettings {
  //オシレーターを識別するための番号
  id: number;
  //
  enabled: boolean;
  //
  oscillatorType: OscillatorType;
  // Amplitude
  gain: number;
  octaveOffset: number;
  detune: number;
}
export type VoicingType = "mono" | "poly";

export interface SynthSettings {
  voicingType: VoicingType;
  masterGain: number;
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
}

interface SynthState extends SynthSettings {
  setMasterGain: (value: number) => void;
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

  setLFOType: (type: OscillatorType) => void;
  setLFOFreq: (value: number) => void;
  setLFOEnvAmount: (value: number) => void;
  loadPresetSettings: (setting: SynthSettings) => void;
}

const initialOscillators: OscillatorSettings[] = [
  {
    id: 1,
    enabled: true,
    gain: 0.5,
    oscillatorType: "sine",
    octaveOffset: 0,
    detune: 0,
  },
  {
    id: 2,
    enabled: true,
    gain: 0.5,
    oscillatorType: "sine",
    octaveOffset: 0,
    detune: 0,
  },
];

export const defaultSetings: SynthSettings = {
  masterGain: 0.5,
  voicingType: "poly",
  oscillators: initialOscillators,
  filterCutoff: 400,
  filterResonance: 1,
  filterLFOAmount: 100,
  envAttack: 0.01,
  envDecay: 0.5,
  envSustain: 0.9,
  envRelease: 1,
  lfoType: "triangle",
  lfoFreq: 1,
  lfoEnvAmount: 0,
};

export interface Preset {
  id?: number;
  name: string;
  isBuiltin: boolean;
  synthSettings: SynthSettings;
}

export const useSynthStore = create<SynthState>((set) => ({
  ...defaultSetings,
  setMasterGain: (value) => set({ masterGain: value }),
  setVoicingType: (voicingType) => set({ voicingType: voicingType }),
  setOscillatorType: (id, oscType) =>
    set((state) => ({
      oscillators: state.oscillators.map((osc) =>
        osc.id === id ? { ...osc, oscillatorType: oscType } : osc
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
  setLFOType: (type) => set({ lfoType: type }),

  setLFOFreq: (value) => set({ lfoFreq: value }),
  setLFOEnvAmount: (value) => set({ lfoEnvAmount: value }),
  loadPresetSettings: (settings) => set(settings),
}));

export const getSettingsFromState = (state: SynthState) => {
  const {
    voicingType: voicing,
    oscillators,
    filterCutoff,
    filterResonance,
    filterLFOAmount,
    envAttack,
    envDecay,
    envSustain,
    envRelease,
    lfoType,
    lfoFreq,
    lfoEnvAmount,
  } = state;
  const settings: SynthSettings = {
    voicingType: voicing,
    oscillators,
    filterCutoff,
    filterResonance,
    filterLFOAmount,
    envAttack,
    envDecay,
    envSustain,
    envRelease,
    lfoType,
    lfoFreq,
    lfoEnvAmount,
  };
  return settings;
};
