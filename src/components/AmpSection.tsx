import { useSynthStore } from "../store/synthstore";
import { Grid, Box, Typography, Slider, Stack, Paper } from "@mui/material"; // Paperを追加

export default function AmpSection() {
  const {
    envAttack, envDecay, envSustain, envRelease,
    setEnvAttack, setEnvDecay, setEnvSustain, setEnvRelease,
  } = useSynthStore(); // TODO: セレクタを最適化する

  return (
    // Grid item として定義 (xs: スマホ, md: 中画面以上)
    <Grid size={{ xs:12, md:6, lg:3}}> {/* lg={3} で 4列レイアウトに対応 */}
      {/* 各セクションを Paper で囲み、高さを100%に */}
      <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Amplitude Envelope
        </Typography>
        <Stack spacing={1.5} sx={{ flexGrow: 1 }}> {/* spacingを調整, flexGrowで高さいっぱいに広げる */}
          {/* Attack */}
          <Box>
            <Typography variant="caption" id="amp-attack-label">Attack: {envAttack.toFixed(2)}s</Typography>
            <Slider
              value={envAttack}
              onChange={(_, value) => setEnvAttack(value as number)}
              min={0.001} max={5} step={0.01}
              size="small"
              aria-labelledby="amp-attack-label"
              valueLabelDisplay="auto" // 値ラベル表示
            />
          </Box>
          {/* Decay */}
          <Box>
            <Typography variant="caption" id="amp-decay-label">Decay: {envDecay.toFixed(2)}s</Typography>
            <Slider
              value={envDecay}
              onChange={(_, value) => setEnvDecay(value as number)}
              min={0.001} max={5} step={0.01}
              size="small"
              aria-labelledby="amp-decay-label"
              valueLabelDisplay="auto"
            />
          </Box>
          {/* Sustain */}
          <Box>
            <Typography variant="caption" id="amp-sustain-label">Sustain: {envSustain.toFixed(2)}</Typography>
            <Slider
              value={envSustain}
              onChange={(_, value) => setEnvSustain(value as number)}
              min={0.0} max={1.0} step={0.01}
              size="small"
              aria-labelledby="amp-sustain-label"
              valueLabelDisplay="auto"
            />
          </Box>
          {/* Release */}
          <Box>
            <Typography variant="caption" id="amp-release-label">Release: {envRelease.toFixed(2)}s</Typography>
            <Slider
              value={envRelease}
              onChange={(_, value) => setEnvRelease(value as number)}
              min={0.001} max={10} step={0.01}
              size="small"
              aria-labelledby="amp-release-label"
              valueLabelDisplay="auto"
            />
          </Box>
        </Stack>
      </Paper>
    </Grid>
  );
}