import {
  Grid,
  Paper,
  Stack,
  Select,
  MenuItem,
  Slider,
  Typography,
  Box,
} from "@mui/material";
import { useSynthStore } from "../store/synthstore";
export default function LFOSection() {
  const {
    lfoType,
    lfoFreq,
    lfoEnvAmount,
    setLFOType,
    setLFOFreq,
    setLFOEnvAmount,
  } = useSynthStore();
  return (
    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
      {/* lg={3} で 4列レイアウトに対応 */}
      <Paper
        elevation={2}
        sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          LFO
        </Typography>
        <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
          <Select
            value={lfoType}
            onChange={(e) => setLFOType(e.target.value as OscillatorType)}
          >
            <MenuItem value="sine">Sine</MenuItem>
            <MenuItem value="square">Square</MenuItem>
            <MenuItem value="sawtooth">Sawtooth</MenuItem>
            <MenuItem value="triangle">Triangle</MenuItem>
          </Select>
          <Box>
            <Typography variant="caption">
              Frequency: {lfoFreq.toFixed(2)}
            </Typography>
            <Slider
              size="small"
              min={0.1}
              max={100}
              step={0.1}
              onChange={(_, value) => setLFOFreq(value)}
            />
          </Box>
          <Box>
            <Typography variant="caption">
              Env Amount:{lfoEnvAmount.toFixed(2)}
            </Typography>
            <Slider
              size="small"
              defaultValue={0.0}
              min={-1.0}
              max={1.0}
              step={0.01}
              onChange={(_, value) => setLFOEnvAmount(value)}
            />
          </Box>
        </Stack>
      </Paper>
    </Grid>
  );
}
