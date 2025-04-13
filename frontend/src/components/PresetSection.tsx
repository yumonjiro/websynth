import { useCallback,useState } from "react";
import {
  defaultSetings,
  useSynthStore,
  SynthSettings,
  getSettingsFromState
} from "../store/synthstore"; // OscillatorType をインポート
import { Grid, Typography, Paper, Button, TextField } from "@mui/material"; // Paper, Divider を追加


const isDevMode = import.meta.env.DEV;

const ServerUrl = isDevMode ? "http://localhost:5193" : "";

const setPreset = (name: string, settings: SynthSettings) => {

  const preset = JSON.stringify(settings);
  localStorage.setItem(name, preset);
  console.log("Saved preset string to local strage:" + preset);
}

const loadPreset = 
  (name: string):string | null => {
    const presetStr = localStorage.getItem(name);
    if (presetStr != null) {
      return presetStr;
      
    }
    console.log("Preset not Found");
    return null;
  }
export default function PresetSection() {
  
  const { loadPresetSettings } = useSynthStore();
  
  const handleSetPreset = useCallback((name: string) => {
    // get current settings from store
    const settings = getSettingsFromState(useSynthStore.getState());
    setPreset(name, settings);
  }, []);

  const handleLoadPreset = useCallback(
    (name: string) => {
      const presetStr = loadPreset(name);
      if(presetStr != null) {
        loadPresetSettings(JSON.parse(presetStr) as SynthSettings);
      }
    },
    [loadPresetSettings]
  );
  const handleLoadpresetFromServerTest = useCallback(() => {
     fetch(ServerUrl+ "/presets/1", {method: "GET"})
    .then(response =>  {
      console.log(response)
      return response.json()}
    )
    .then(data => {
      console.log(data);
      // dataはjsonObject
      const settings:SynthSettings = data["synthSettings"] as SynthSettings;

      loadPresetSettings(settings)
      })
    }, [])

  const [presetName, setPresetName] = useState("");

  // useEffect(() => {
  //   fetch(ServerUrl + "presets")
  //   return;
  // }, []);
  


  return (
    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
      {" "}
      {/* lg={3} で 4列レイアウトに対応 */}
      <Paper
        elevation={2}
        sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
          Presets
        </Typography>
        <Button onClick={() => loadPresetSettings(defaultSetings)}></Button>
        <TextField
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
        />
        <Button onClick={() => handleSetPreset(presetName)}>
          Save
        </Button>
        <Button onClick={() => handleLoadPreset(presetName)}>Load</Button>
        <Button onClick={() => handleLoadpresetFromServerTest()}>Load From Server</Button>
      </Paper>
    </Grid>
  );
}
