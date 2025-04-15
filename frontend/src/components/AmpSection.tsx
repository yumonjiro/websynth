import { useSynthStore } from "../store/synthstore";
import { Grid, Box, Typography, Slider, Stack, Paper } from "@mui/material"; // Paperを追加

export default function AmpSection() {
  const {
    envAttack, envDecay, envSustain, envRelease,
    setEnvAttack, setEnvDecay, setEnvSustain, setEnvRelease,
  } = useSynthStore(); 

  return (
    <Grid size={{ xs:12, md:6, lg:3}}> 
      <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Amplitude Envelope
        </Typography>
        <Stack spacing={1.5} sx={{ flexGrow: 1 }}> 
          {/* Attack */}
          <Box>
            <Typography variant="caption">Attack: {envAttack.toFixed(2)}s</Typography>
            <Slider
              value={envAttack}
              onChange={(_, value) => setEnvAttack(value as number)}
              min={0.001} max={5} step={0.01}
              size="small"
            />
          </Box>
          {/* Decay */}
          <Box>
            <Typography variant="caption">Decay: {envDecay.toFixed(2)}s</Typography>
            <Slider
              value={envDecay}
              onChange={(_, value) => setEnvDecay(value as number)}
              min={0.001} max={5} step={0.01}
              size="small"
            />
          </Box>
          {/* Sustain */}
          <Box>
            <Typography variant="caption">Sustain: {envSustain.toFixed(2)}</Typography>
            <Slider
              value={envSustain}
              onChange={(_, value) => setEnvSustain(value as number)}
              min={0.0} max={1.0} step={0.01}
              size="small"
            />
          </Box>
          {/* Release */}
          <Box>
            <Typography variant="caption">Release: {envRelease.toFixed(2)}s</Typography>
            <Slider
              value={envRelease}
              onChange={(_, value) => setEnvRelease(value as number)}
              min={0.001} max={10} step={0.01}
              size="small"
            />
          </Box>
        </Stack>
      </Paper>
    </Grid>
  );
}