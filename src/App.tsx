import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  Select,
  Slider,
  Typography,
} from "@mui/material";
import "./App.css";
import { useEffect, useState } from "react";
import { useSynthStore } from "./store/synthstore";
import { useAudioEngine } from "./useAudioEngine";

function App() {
  const { initializeAudioContext, noteHold, noteRelease, noteOn, noteOff } =
    useAudioEngine();
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
    oscillators,
    filterCutoff,
    filterResonance,
    envAttack,
    envDecay,
    envSustain,
    envRelease,
    setOscillatorType,
    setOscillatorGain,
    setFilterCutoff,
    setFilterResonance,
    setEnvAttack,
    setEnvDecay,
    setEnvRelease,
    setEnvSustain,
  } = useSynthStore();

  return (
    <Container>
      <Paper>
        <Grid>
          <Button onClick={handleInitialize}>Initialize Audio Engine</Button>
        </Grid>
        {/* Synth Control Section */}
        <Grid>
          {/* Oscillator Section */}
          <Grid>
            {
              oscillators.map((oscSettings) => {
                return (
                  <Grid key={oscSettings.id}>
                  <Typography>Oscillator {oscSettings.id}</Typography>
                  <Select
                    value={oscSettings.type}
                    onChange={(e) =>
                      setOscillatorType(oscSettings.id, e.target.value as OscillatorType)
                    }
                  >
                    <MenuItem value="sine">Sine</MenuItem>
                    <MenuItem value="square">Square</MenuItem>
                    <MenuItem value="sawtooth">Sawtooth</MenuItem>
                    <MenuItem value="triangle">Triangle</MenuItem>
                  </Select>
                  <Slider min={0} max={1.0} step={0.01} value={oscSettings.gain} onChange={(_, value) => setOscillatorGain(oscSettings.id, value)}/>
                </Grid>)
            })

            }
            
          </Grid>

          {/* Filter Section */}
          <Grid>
            <Typography>Filter : {filterCutoff}</Typography>
            <Box>
              <Slider
                min={20}
                max={20000}
                value={filterCutoff}
                onChange={(_, newValue) => setFilterCutoff(newValue)}
              />
              <Slider
                min={0.1}
                max={100}
                step={0.1}
                value={filterResonance}
                onChange={(_, newValue) => setFilterResonance(newValue)}
              />
            </Box>
          </Grid>

          {/* Amp Section */}
          <Grid>
            <Typography>ADSR</Typography>
            <Grid>
              <Grid>
                <Typography>Attack: {envAttack}</Typography>
                <Slider
                  value={envAttack}
                  onChange={(_, value) => setEnvAttack(value)}
                  min={0.01}
                  max={10.0}
                  step={0.1}
                />
              </Grid>
              <Grid>
                <Typography>Decay:{envDecay}</Typography>
                <Slider
                  value={envDecay}
                  onChange={(_, value) => setEnvDecay(value)}
                  min={0}
                  max={10}
                  step={0.1}
                />
              </Grid>
              <Grid>
                <Typography>Sustain:{envSustain}</Typography>
                <Slider
                  value={envSustain}
                  onChange={(_, value) => setEnvSustain(value)}
                  min={0.0}
                  max={1.0}
                  step={0.01}
                />
              </Grid>
              <Grid>
                <Typography>Release:{envRelease}</Typography>
                <Slider
                  value={envRelease}
                  onChange={(_, value) => setEnvRelease(value)}
                  min={0}
                  max={10}
                  step={0.1}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* keyboard section */}
        <Grid>
          <Button onClick={() => noteOn(440)}>Start</Button>
          <Button onMouseDown={() => noteHold(440)} onMouseUp={noteRelease}>
            Hold to play note
          </Button>
          <Button onClick={noteOff}>Stop</Button>
        </Grid>
      </Paper>
    </Container>
  );
}

export default App;
