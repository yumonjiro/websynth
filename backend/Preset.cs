using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

class Preset
{ 
  public int Id { get; set; }
  public string? Name { get; set; }

  [DefaultValue(false)]
  public bool IsBuiltin {get; set;}
  public SynthSettings SynthSettings { get; set; }
}

enum WaveForm
{
  Sine,
  Square,
  Sawtooth,
  Triangle
}
class OscillatorSettings
{
  [JsonIgnore]
  public SynthSettings SynthSettings {get; set;}
  public int Id { get; set; }
  public bool Enabled { get; set; }
  public required string OscillatorType
  {
    get { return _OscillatorType.ToString().ToLower(); }
    set
    {
      Enum.TryParse<WaveForm>(value, true, out WaveForm form);
      _OscillatorType = form;
    }
  }
  private WaveForm _OscillatorType;

  public float Gain { get; set; }
  public float Detune { get; set; }
  public int OctaveOffset {get; set;}
}
class SynthSettings
{
  [JsonIgnore]
  public Preset Preset {get; set; }
  public float MasterGain {get; set;}
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
  public required string LfoType { get { return _LFOType.ToString().ToLower(); } 
  set {
    Enum.TryParse<WaveForm>(value, true, out WaveForm result);
    _LFOType = result;
  } }
  private WaveForm _LFOType; 
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