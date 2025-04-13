import { useSynthStore } from "../store/synthstore"; // OscillatorType をインポート
import {
  Grid,
  Stack,
  Box,
  Typography,
  FormControl,
  Slider,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
} from "@mui/material"; // Paper, Divider を追加

export default function OscillatorSection() {
  const { oscillators, setOscillatorGain, setOscillatorType } = useSynthStore(); // TODO: セレクタを最適化する

  return (
    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
      {" "}
      {/* lg={3} で 4列レイアウトに対応 */}
      <Paper
        elevation={2}
        sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
          Oscillators
        </Typography>
        <Stack
          spacing={2}
          divider={<Divider flexItem />}
          sx={{ flexGrow: 1 }}
        >
          {" "}
          {/* オシレーターが増えた時用にスクロール */}
          {oscillators.map((oscSettings, index) => (
            <Box key={oscSettings.id} sx={{ pt: index > 0 ? 2 : 0 }}>
              {" "}
              {/* 2つ目以降のOSCの上に少しpadding */}
              <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1.5 }}>
                Oscillator {oscSettings.id}
              </Typography>
              <Grid container spacing={2} alignItems="center">
                {/* Type Select */}
                <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
                  <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth size="small">
                      {/* InputLabelは常に表示されるように variant="standard" or shrink */}
                      <InputLabel
                        shrink={false}
                        sx={{
                          position: "static",
                          transform: "none",
                          mb: 0.5,
                          fontSize: "0.8rem",
                        }}
                      >
                      </InputLabel>
                      <Select
                        labelId={`osc-type-label-${oscSettings.id}`}
                        // label="Type" // labelを使うとスペース取るのでInputLabelを外に出す
                        value={oscSettings.oscillatorType}
                        onChange={(e) =>
                          setOscillatorType(
                            oscSettings.id,
                            e.target.value as OscillatorType
                          )
                        }
                        // variant="outlined" // デフォルト
                      >
                        <MenuItem value="sine">Sine</MenuItem>
                        <MenuItem value="square">Square</MenuItem>
                        <MenuItem value="sawtooth">Sawtooth</MenuItem>
                        <MenuItem value="triangle">Triangle</MenuItem>
                        {/* <MenuItem value="noise">Noise</MenuItem> */}
                      </Select>
                    </FormControl>
                  </Grid>
                  {/* Gain Slider */}
                  <Grid size={{ xs: 12 }}>
                    <Typography
                      variant="caption"
                    >
                      Level: {(oscSettings.gain * 100).toFixed(0)}%
                    </Typography>
                    <Slider
                      min={0}
                      max={1.0}
                      step={0.01}
                      value={oscSettings.gain}
                      onChange={(_, value) =>
                        setOscillatorGain(oscSettings.id, value as number)
                      }
                      size="small"
                    />
                  </Grid>
                </Stack>
                {/* TODO: オクターブと */}
              </Grid>
            </Box>
          ))}
          {/* TODO: オシレーターさらに追加できるようにする？ */}
        </Stack>
      </Paper>
    </Grid>
  );
}
