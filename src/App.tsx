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
  const { initializeAudioContext, noteOn, noteOff } = useAudioEngine();
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
    oscillatorType,
    filterCutoff,
    // TODO filterResonance,
    envAttack,
    envDecay,
    envSustain,
    envRelease,
    setOscillatorType,
    setFilterCutoff,
    // TODO setFilterResonance,
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
            <Typography>Oscillator</Typography>
            <Select
              value={oscillatorType}
              onChange={(e) =>
                setOscillatorType(e.target.value as OscillatorType)
              }
            >
              <MenuItem value="sine">Sine</MenuItem>
              <MenuItem value="square">Square</MenuItem>
              <MenuItem value="sawtooth">Sawtooth</MenuItem>
              <MenuItem value="triangle">Triangle</MenuItem>
            </Select>
          </Grid>

          {/* Filter Section */}
          <Grid>
            <Typography>Filter</Typography>
            <Box>
              <Slider
                min={50}
                max={10000}
                value={filterCutoff}
                onChange={(_, newValue) => setFilterCutoff(newValue)}
              />
            </Box>
          </Grid>

          {/* Amp Section */}
          <Grid>
            <Typography>ADSR</Typography>
            <Grid>
              <Grid>
                <Typography>Attack</Typography>
                <Slider
                  value={envAttack}
                  onChange={(_, value) => setEnvAttack(value)}
                />
              </Grid>
              <Grid>
                <Typography>Decay</Typography>
                <Slider
                  value={envDecay}
                  onChange={(_, value) => setEnvDecay(value)}
                />
              </Grid>
              <Grid>
                <Typography>Sustain</Typography>
                <Slider
                  value={envSustain}
                  onChange={(_, value) => setEnvSustain(value)}
                />
              </Grid>
              <Grid>
                <Typography>Release</Typography>
                <Slider
                  value={envRelease}
                  onChange={(_, value) => setEnvRelease(value)}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* keyboard section */}
        <Grid>
          <Button onClick={noteOn}>Start</Button>
          <Button onClick={noteOff}>Stop</Button>
        </Grid>
      </Paper>
    </Container>
  );
}

export default App;
