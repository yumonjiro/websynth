import { useSynthStore, VoicingType } from "../store/synthstore";
import {
  Grid,
  Box,
  Typography,
  Slider,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material"; // Paper, Stack を追加

export default function GlobalSettingsSection() {
  const { masterGain, setMasterGain, voicingType, setVoicingType } =
    useSynthStore();

  return (
    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
      {" "}
      {/* lg={3} で 4列レイアウトに対応 */}
      <Paper
        elevation={2}
        sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Global Settings
        </Typography>
        <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
          {/* Master Gain */}
          <Box>
            <Typography variant="caption">
              Master Volume: {masterGain.toFixed(1)}
            </Typography>
            <Slider
              min={0.0}
              max={1}
              step={0.01}
              value={masterGain}
              onChange={(_, newValue) => setMasterGain(newValue as number)}
              size="small"
            />
          </Box>
          <Box>
            <Typography variant="caption">Voicing</Typography>
            <FormControl fullWidth size="small">
              <InputLabel
                shrink={false}
                sx={{
                  position: "static",
                  transform: "none",
                  mb: 0.5,
                  fontSize: "0.8rem",
                }}
              ></InputLabel>
              <Select
                value={voicingType}
                onChange={(e) => setVoicingType(e.target.value as VoicingType)}
              >
                <MenuItem value="poly">Polyphonic</MenuItem>
                <MenuItem value="mono">Monophonic</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </Paper>
    </Grid>
  );
}
