import { create } from "zustand";

//export type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle';

interface OscillatorSettings {
  
  //オシレーターを識別するための番号
  id: number; 
  //
  enabled:boolean,
  //
  type:OscillatorType,
  // Amplitude
  gain: number,
  octaveOffset: number,
  detune: number,

}
export type VoicingType = 'mono' | 'poly';
interface SynthState {
  /*
    必要な状態：
    oscillatorType(waveFormのこと。WebAudioAPIの方の命名に準拠)
    octave
    */
  voicing: VoicingType,
  //OSC
  oscillators:OscillatorSettings[],

  //filter
  filterCutoff: number;
  filterResonance: number;

  //Envelope(ADSR)
  envAttack: number;
  envDecay: number;
  envSustain: number;
  envRelease: number;
  setVoicingType: (voicingType:VoicingType) => void;
  setOscillatorType: (id:number,oscType: OscillatorType) => void;
  setOscillatorGain: (id:number, value: number) => void;
  //setOscillatorOctave: (id:number, value: number) => void;

  setFilterCutoff: (value: number) => void;
  setFilterResonance: (value: number) => void;
  setEnvAttack: (value: number) => void;
  setEnvDecay: (value: number) => void;
  setEnvSustain: (value: number) => void;
  setEnvRelease: (value: number) => void;
}

const initialOscillators: OscillatorSettings[] = [
  {id:1, enabled: true, gain:0.5, type: "sine", octaveOffset: 0, detune: 0},
  {id:2, enabled: true, gain:0.5, type: "sine", octaveOffset: 0, detune: 0},
];
export const useSynthStore = create<SynthState>((set) => ({
  voicing: 'mono',
  oscillators: initialOscillators,
  filterCutoff: 5000,
  filterResonance: 1,
  envAttack: 0.01,
  envDecay: 0.5,
  envSustain: 0.9,
  envRelease: 1,
  setVoicingType: (voicingType) => set({voicing:voicingType}),
  setOscillatorType: (id, oscType) => set((state) => ({
    oscillators:state.oscillators.map(
      osc => 
        osc.id === id ? {...osc, type:oscType }  : osc )
  })),
  setOscillatorGain: (id, value) => set((state) => ({
    oscillators:state.oscillators.map(
      osc => osc.id === id ? {...osc, gain:value} : osc )
  })),
  setFilterCutoff: (value) => set({ filterCutoff: value }),
  setFilterResonance: (value) => set({ filterResonance: value }),
  setEnvAttack: (value) => set({ envAttack: value }),
  setEnvDecay: (value) => set({ envDecay: value }),
  setEnvSustain: (value) => set({ envSustain: value }),
  setEnvRelease: (value) => set({ envRelease: value }),
}));
