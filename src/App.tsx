import {
  Box,
  Container,
  Grid,
  MenuItem,
  Paper,
  Select,
  Slider,
  Typography,
} from "@mui/material";
import "./App.css";
import { OscillatorType, useSynthStore } from "./store/synthstore";

function App() {
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
              <MenuItem value="square">Sine</MenuItem>
              <MenuItem value="sawtooth">Sine</MenuItem>
              <MenuItem value="triangle">Sine</MenuItem>
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
      </Paper>
    </Container>
  );
}

export default App;
