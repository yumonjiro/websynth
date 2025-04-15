import { Box, Grid, Typography } from "@mui/material"; // Box, Typography をインポート
import "./App.css";
import OscillatorSection from "./components/OscillatorSection";
import FilterSection from "./components/FilterSection";
import AmpSection from "./components/AmpSection";
import LFOSection from "./components/LFOSection";
import KeyboardSection from "./components/KeyboardSection";
import PresetSection from "./components/PresetSection";
import GlobalSettingsSection from "./components/GlobalSettingsSection";

function App() {
  return (
    <Box
      sx={{
        minWidth: "90vw",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Typography variant="h3" /* ... */>Web Synthesizer</Typography>
      <Grid container spacing={2} sx={{ flexGrow: 1, display: "flex", p: 3 }}>
        {/* Preset Section */}
        <Grid
          size={{ xs: 12, md: 3, lg: 2.4 }}
          sx={{
            mb: 3
          }}
        >
          <PresetSection />
        </Grid>
        {/* Synth Section */}
        <Grid
          size={{ xs: 12, md: 9, lg: 9.6 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            overflowY: "auto",
          }}
        >
          {/* Synth Control Sections */}
          <Grid container spacing={2} sx={{ mb: 3, flexShrink: 0 }}>
            <OscillatorSection />
            <FilterSection />
            <AmpSection />
            <LFOSection />
            <KeyboardSection />
            <GlobalSettingsSection />

          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
