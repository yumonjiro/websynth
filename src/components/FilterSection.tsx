import { useSynthStore } from "../store/synthstore";
import { Grid, Box, Typography, Slider, Paper, Stack } from "@mui/material"; // Paper, Stack を追加

export default function FilterSection() {
  const {
    filterCutoff, filterResonance, filterLFOAmount,
    setFilterCutoff, setFilterResonance, setFilterLFOAmount
  } = useSynthStore(); // TODO: セレクタを最適化する

  // カットオフ周波数を対数的に表示/操作するためのヘルパー (オプション)
  const getLogValue = (value: number) => Math.log10(value);
  const getExpValue = (logValue: number) => Math.pow(10, logValue);

  return (
    <Grid size={{ xs:12, md:6, lg:3}}> {/* lg={3} で 4列レイアウトに対応 */}
      <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Filter
        </Typography>
        <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
          {/* Cutoff */}
          <Box>
            <Typography variant="caption" id="filter-cutoff-label">Cutoff: {filterCutoff.toFixed(0)} Hz</Typography>
            <Slider
              min={getLogValue(20)} // 20Hz
              max={getLogValue(20000)} // 20kHz
              step={0.01} // 対数スケールなので細かいステップ
              value={getLogValue(filterCutoff)}
              onChange={(_, newValue) => setFilterCutoff(getExpValue(newValue as number))}
              size="small"
              aria-labelledby="filter-cutoff-label"
              valueLabelFormat={(value) => `${getExpValue(value).toFixed(0)} Hz`} // ラベル表示をHzに
              valueLabelDisplay="auto"
            />
          </Box>
          {/* Resonance (Q) */}
          <Box>
            <Typography variant="caption" id="filter-resonance-label">Resonance: {filterResonance.toFixed(1)}</Typography>
            <Slider
              min={0.1} max={30} step={0.1} // Q値の範囲を調整 (30くらいでもかなり強烈)
              value={filterResonance}
              onChange={(_, newValue) => setFilterResonance(newValue as number)}
              size="small"
              aria-labelledby="filter-resonance-label"
              valueLabelDisplay="auto"
            />
          </Box>
          {/* LFO */}
          <Box>
            <Typography variant="caption" id="filter-resonance-label">LFO Amount: {filterLFOAmount.toFixed(1)}</Typography>
            <Slider
              min={-500} max={500} step={0.1} // Q値の範囲を調整 (30くらいでもかなり強烈)
              value={filterLFOAmount}
              onChange={(_, newValue) => setFilterLFOAmount(newValue)}
              size="small"
              aria-labelledby="filter-lfo-label"
              valueLabelDisplay="auto"
            />
          </Box>
          {/* TODO: Filter Type Select */}
        </Stack>
      </Paper>
    </Grid>
  );
}