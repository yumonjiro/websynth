import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import "./App.css";
import { useEffect, useState } from "react";
import { useSynthStore, VoicingType } from "./store/synthstore";
import { useAudioEngine } from "./useAudioEngine";

const noteFrequencies = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
};
// const keys = [
//   "keyC",
//   "keyD",
//   "keyE",
//   "keyF",
//   "keyG",
//   "keyA",
//   "keyB",
// ]

function App() {
  const { initializeAudioContext, noteHold, noteRelease } = useAudioEngine();
  const [isInitialized, setIsInitialized] = useState(false);
  const handleInitialize = () => {
    if (isInitialized) {
      return;
    }
    initializeAudioContext();
    setIsInitialized(true);
  };
  useEffect(() => {
    return;
  }, []);
  const {
    voicing,
    oscillators,
    filterCutoff,
    filterResonance,
    envAttack,
    envDecay,
    envSustain,
    envRelease,
    setVoicingType,
    setOscillatorType,
    setOscillatorGain,
    setFilterCutoff,
    setFilterResonance,
    setEnvAttack,
    setEnvDecay,
    setEnvRelease,
    setEnvSustain,
  } = useSynthStore();

  // useEffect(() => {
  //   document.addEventListener("keydown", (e) => {
  //     const key = keys.find((element) => element == e.code)
  //     if(key != null)
  //     {}
  //   })
  // }, [])
  return (
    <Container maxWidth="lg" sx={{ mb: 4}}>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Grid container>
          <Grid size={12}>
            <Button onClick={handleInitialize}>Initialize Audio Engine</Button>
            <Select
              value={voicing}
              onChange={(e) => setVoicingType(e.target.value as VoicingType)}
            >
              <MenuItem value="mono">Monophonic</MenuItem>
              <MenuItem value="poly">Polyphonic</MenuItem>
            </Select>
          </Grid>

          {/* Synth Control Section */}
          <Grid container size={12} spacing={4} >
            {/* Oscillator Section */}
            <Grid size={{md:4}}>
              <Stack spacing={3}>
                {oscillators.map((oscSettings) => {
                  return (
                    <Box key={oscSettings.id}>
                      <Typography>Oscillator {oscSettings.id}</Typography>
                      <Grid container spacing={2}>
                        <Grid size={5}>
                        <FormControl fullWidth size="small">
                                <InputLabel id={`osc-type-label-${oscSettings.id}`}>Type</InputLabel>
                                <Select
                                labelId={`osc-type-label-${oscSettings.id}`}
                                value={oscSettings.type}
                                label="Type"
                                onChange={(e) => setOscillatorType(oscSettings.id, e.target.value as OscillatorType)}
                                >
                                <MenuItem value="sine">Sine</MenuItem>
                                <MenuItem value="square">Square</MenuItem>
                                <MenuItem value="sawtooth">Sawtooth</MenuItem>
                                <MenuItem value="triangle">Triangle</MenuItem>
                                {/* TODO: Add more types? Noise? */}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={7}>
                          <Slider
                            min={0}
                            max={1.0}
                            step={0.01}
                            value={oscSettings.gain}
                            onChange={(_, value) =>
                              setOscillatorGain(oscSettings.id, value)
                            }
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  );
                })}
              </Stack>
            </Grid>

            {/* Filter Section */}
            <Grid size={{md:3}}>
              <Typography>Cutoff:{filterCutoff}</Typography>
              <Box>
                <Slider
                  min={20}
                  max={20000}
                  value={filterCutoff}
                  onChange={(_, newValue) => setFilterCutoff(newValue)}
                  size="small"
                />
              <Typography>Q:{filterResonance}</Typography>

                <Slider
                  min={0.1}
                  max={100}
                  step={0.1}
                  value={filterResonance}
                  onChange={(_, newValue) => setFilterResonance(newValue)}
                  size="small"
                />
              </Box>
            </Grid>

            {/* Amp Section */}
            <Grid size={{md:5}}>
              <Typography>ADSR</Typography>
              <Grid container spacing={2}>
                <Grid size={{md:6}}>
                  <Typography>Attack: {envAttack}</Typography>
                  <Slider
                    value={envAttack}
                    onChange={(_, value) => setEnvAttack(value)}
                    min={0.01}
                    max={10.0}
                    step={0.1}
                    size="small"
                  />
                </Grid>
                <Grid size={{md:6}}>
                  <Typography>Decay:{envDecay}</Typography>
                  <Slider
                    value={envDecay}
                    onChange={(_, value) => setEnvDecay(value)}
                    min={0}
                    max={10}
                    step={0.1}
                    size="small"

                  />
                </Grid>
                <Grid size={{md:6}}>
                  <Typography>Sustain:{envSustain}</Typography>
                  <Slider
                    value={envSustain}
                    onChange={(_, value) => setEnvSustain(value)}
                    min={0.0}
                    max={1.0}
                    step={0.01}
                    size="small"

                  />
                </Grid>
                <Grid size={{md:6}}>
                  <Typography>Release:{envRelease}</Typography>
                  <Slider
                    value={envRelease}
                    onChange={(_, value) => setEnvRelease(value)}
                    min={0}
                    max={10}
                    step={0.1}
                    size="small"

                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* keyboard section */}
          <Grid size={12}>
            {Object.entries(noteFrequencies).map(([noteName, notefreq]) => {
              return (
                
                  <Button key={noteName}
                    onMouseDown={() => noteHold(notefreq)}
                    onMouseUp={noteRelease}
                  >
                    {noteName}
                  </Button>
                
              );
            })}
            <Button onMouseDown={() => noteHold(440)} onMouseUp={noteRelease}>
              Hold to play note
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default App;
