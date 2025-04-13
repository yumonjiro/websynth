using Microsoft.AspNetCore.SignalR;

class Preset {
    public int Id {get; set;}
    public string? Name { get; set;}
    
    public required SynthSettings SynthSettings {get; set;}
}

class OscillatorSettings {
    public int Id {get; set;}
    public Boolean Enabled {get; set; }
    public required string OscillatorType {
        get;
        set;
    }
    public int Gain {get; set;}
    public float Detune {get; set;}
}

class SynthSettings {
    public required string VoicingType {get; set;}
    public required OscillatorSettings[] Oscillators {get; set;}
    public float FilterCutoff {get; set;}
    public float FilterResonance {get; set;}
    public float filterLFOAmount {get; set;}
    public float EnvAttack {get; set;}
    public float EnvDecay {get; set;}
    public float EnvSustain {get; set;}
    public float EnvRelease {get; set;}
    public float LFOFreq {get; set; }
    public required string LfoType {get; set;}
    public float LfoEnvAmount {get; set;}
}
/*
TypeScriptでの定義
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

export interface SynthSettings {
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
}
*/ 