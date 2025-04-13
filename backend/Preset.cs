using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

class Preset
{
  private static OscillatorSettings initOsc1 = new OscillatorSettings
  {
    Id = 1,
    OscillatorType = "sine",
    Gain = 0.5f,
    Detune = 0.0f,
    Enabled = true,
  };
  private static OscillatorSettings initOsc2 = new OscillatorSettings
  {
    Id = 2,
    OscillatorType = "sine",
    Gain = 0.5f,
    Detune = 0.0f,
    Enabled = true,
  };

  private static SynthSettings initSynth = new SynthSettings
  {
    VoicingType = "poly",
    Oscillators = [initOsc1, initOsc2],
    FilterCutoff = 500f,
    FilterResonance = 1f,
    FilterLFOAmount = 100f,
    EnvAttack = 0.2f,
    EnvDecay = 0.3f,
    EnvSustain = 0.85f,
    EnvRelease = 1.0f,
    LFOFreq = 1.0f,
    LfoType = "sine",
    LfoEnvAmount = 0f
  };
  public static readonly Preset init = new Preset
  {
    Id = 1,
    Name = "init",
    SynthSettings = initSynth
  };

  public int Id { get; set; }
  public string? Name { get; set; }

  public required SynthSettings SynthSettings { get; set; }
}

class OscillatorSettings
{
  public int Id { get; set; }
  public Boolean Enabled { get; set; }
  public required string OscillatorType
  {
    get;
    set;
  }
  public float Gain { get; set; }
  public float Detune { get; set; }
}
class SynthSettings
{

  public required string VoicingType { get; set; }
  public required List<OscillatorSettings> Oscillators { get; set; }
  public float FilterCutoff { get; set; }
  public float FilterResonance { get; set; }
  public float FilterLFOAmount { get; set; }
  public float EnvAttack { get; set; }
  public float EnvDecay { get; set; }
  public float EnvSustain { get; set; }
  public float EnvRelease { get; set; }
  public float LFOFreq { get; set; }
  public required string LfoType { get; set; }
  public float LfoEnvAmount { get; set; }
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