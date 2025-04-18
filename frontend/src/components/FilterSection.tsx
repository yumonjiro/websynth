import { useSynthStore } from "../store/synthstore";
import { Grid, Box, Typography, Slider, Paper, Stack } from "@mui/material"; // Paper, Stack を追加

export default function FilterSection() {
  const {
    filterCutoff,
    filterResonance,
    filterLFOAmount,
    setFilterCutoff,
    setFilterResonance,
    setFilterLFOAmount,
  } = useSynthStore();

  // カットオフ周波数を対数に変換したい
  const getLogValue = (value: number) => Math.log10(value);
  const getExpValue = (logValue: number) => Math.pow(10, logValue);

  return (
    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
      {" "}
      {/* lg={3} で 4列レイアウトに対応 */}
      <Paper
        elevation={2}
        sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}
      >
        {/* TODO: Filterのタイプを選べるように */}
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Filter
        </Typography>
        <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
          {/* Cutoff */}
          <Box>
            <Typography variant="caption">
              Cutoff: {filterCutoff.toFixed(0)} Hz
            </Typography>
            <Slider
              min={getLogValue(20)} // 20Hz
              max={getLogValue(20000)} // 20kHz
              step={0.01} // 対数スケールなので細かいステップ
              value={getLogValue(filterCutoff)}
              onChange={(_, newValue) =>
                setFilterCutoff(getExpValue(newValue as number))
              }
              size="small"
            />
          </Box>
          {/* Resonance (Q) */}
          <Box>
            <Typography variant="caption">
              Resonance: {filterResonance.toFixed(1)}
            </Typography>
            <Slider
              min={0.1}
              max={20}
              step={0.1} // Q値の範囲を調整 (30くらいでもかなり強烈)
              value={filterResonance}
              onChange={(_, newValue) => setFilterResonance(newValue as number)}
              size="small"
            />
          </Box>
          {/* LFO Amount*/}
          <Box>
            <Typography variant="caption">
              LFO Amount: {filterLFOAmount.toFixed(1)}
            </Typography>
            <Slider
              min={-500}
              max={500}
              step={0.1}
              value={filterLFOAmount}
              onChange={(_, newValue) => setFilterLFOAmount(newValue)}
              size="small"
            />
          </Box>
        </Stack>
      </Paper>
    </Grid>
  );
}
