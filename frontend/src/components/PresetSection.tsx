import { useCallback,useState } from "react";
import {
  useSynthStore,
  getSettingsFromState,
  usePresetStore,
  Preset
} from "../store/synthstore"; // OscillatorType をインポート
import { Grid, Typography, Paper, Button, TextField, List, ListItem, ListItemText, ListItemButton } from "@mui/material"; // Paper, Divider を追加


const isDevMode = import.meta.env.DEV;

const ServerUrl = isDevMode ? "http://localhost:5193" : "";

// const setPreset = (name: string, settings: SynthSettings) => {
//   const preset = JSON.stringify(settings);
//   localStorage.setItem(name, preset);
//   console.log("Saved preset string to local strage:" + preset);
// }

// const loadPreset = 
//   (name: string):string | null => {
//     const presetStr = localStorage.getItem(name);
//     if (presetStr != null) {
//       return presetStr;
      
//     }
//     console.log("Preset not Found");
//     return null;
//   }
export default function PresetSection() {

  const { loadPresetSettings } = useSynthStore();
  const { 
    Presets,
    setPresets,
  } = usePresetStore()
  // const [fetchedPresets, setFetchedPresets] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const savePresetToServer = useCallback(() => {
    const url = ServerUrl + "/presets"
    // const header = {method: "GET"}
    const preset: Preset = {
      name: searchQuery,
      synthSettings: getSettingsFromState(useSynthStore.getState())
    }
    const body = JSON.stringify(preset);
    console.log(`Posting preset: ${body}`)
    fetch(url, {method:"POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body:body })
    .then(response => {
      console.log(`response: ${response.body}`)
    })

    console.log(`Saved Presets To Server`);
    // もう一度fetch
    fetchPresetsFromServer();
    }, [searchQuery]);

    const fetchPresetsFromServer = useCallback(() => {
      const url = ServerUrl + "/presets"
      // const header = {method: "GET"}
      fetch(url, {method:"GET"})
      .then(response => {
        console.log(`response: ${response}`)
        return response.json();
      })
      .then(data => setPresets(data));
      console.log("Preset downloaded");
      }, []);

  // const handleSetPreset = useCallback((name: string) => {
  //   // get current settings from store
  //   const settings = getSettingsFromState(useSynthStore.getState());
  //   setPreset(name, settings);
  // }, []);

  // const handleLoadPreset = useCallback(
  //   (name: string) => {
  //     const presetStr = loadPreset(name);
  //     if(presetStr != null) {
  //       loadPresetSettings(JSON.parse(presetStr) as SynthSettings);
  //     }
  //   },
  //   [loadPresetSettings]
  // );


  // useEffect(() => {
  //   fetch(ServerUrl + "presets")
  //   return;
  // }, []);
  const filteredPresets = useCallback(() => {
    return Presets.filter(preset => preset.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [Presets, searchQuery])

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
        <TextField value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}></TextField>
        <List sx={{ overflow: "scroll"}}>
          {
            filteredPresets().map((preset) =>  
            (
            <ListItem key={preset.id}>
              <ListItemButton onClick={() => loadPresetSettings(preset.synthSettings)}>
              <ListItemText>{preset.id}:{preset.name}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))
          }
        </List>
        {filteredPresets().length > 0 || searchQuery.length == 0 ?
        <Button onClick={() => fetchPresetsFromServer()}>fetch presets from Server</Button>
          : 
          <Button onClick={() => savePresetToServer()}>save presets To Server</Button>
      }
        
      </Paper>
    </Grid>
  );
}
