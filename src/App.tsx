import { useState } from "react";
import "./App.css";
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

function App() {
  const [waveform, setWaveform] = useState("Sine");
  const [cutoff, setCutoff] = useState(50);
  return (
    <Container>
      <Paper>
        <Grid>
          {/* Oscillator Section */}
          <Grid>
            <Typography>Oscillator</Typography>
            <Select
              value={waveform}
              onChange={(e) => setWaveform(e.target.value)}
            >
              <MenuItem value="Sine">Sine</MenuItem>
            </Select>
          </Grid>

          {/* Filter Section */}
          <Grid>
            <Typography>Filter</Typography>
            <Box>
              <Slider
                min={50}
                max={10000}
                value={cutoff}
                onChange={(_, newValue) => setCutoff(newValue)}
              />
            </Box>
          </Grid>

          {/* Amp Section */}
          <Grid>
            <Typography>ADSR</Typography>
            <Grid>
              <Grid>
                <Typography>Attack</Typography>
                <Slider/>
              </Grid>
              <Grid>
                <Typography>Decay</Typography>
                <Slider/>
              </Grid>
              <Grid>
                <Typography>Sustain</Typography>
                <Slider/>
              </Grid>
              <Grid>
                <Typography>Release</Typography>
                <Slider/>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default App;
