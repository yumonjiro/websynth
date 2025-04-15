import { useCallback, useEffect, useState } from "react";
import {
  useSynthStore,
  getSettingsFromState,
  usePresetStore,
  Preset,
} from "../store/synthstore"; // OscillatorType をインポート
import {
  Grid,
  Typography,
  Paper,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material"; // Paper, Divider を追加

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
  const [ Presets, setPresets ] = useState<Preset[]>([]);
  const [ filteredPresets, setFilteredPresets ] = useState<Preset[]>([]);
  // const [fetchedPresets, setFetchedPresets] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const savePresetToServer = useCallback(() => {
    const url = ServerUrl + "/presets";
    // const header = {method: "GET"}
    const preset: Preset = {
      name: searchQuery,
      synthSettings: getSettingsFromState(useSynthStore.getState()),
    };
    const body = JSON.stringify(preset);
    console.log(`Posting preset: ${body}`);
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    }).then((response) => {
      console.log(`response: ${response.body}`);
    });

    console.log(`Saved Presets To Server`);
    //この時点でセーブは完了
    // もう一度fetch
    fetchPresetsFromServer();

  }, [searchQuery]);

  const fetchPresetsFromServer = useCallback(() => {
    const url = ServerUrl + "/presets";
    fetch(url, { method: "GET" })
      .then((response) => {
        console.log(`response: ${response}`);
        return response.json();
      })
      .then((data) => setPresets(data));
    console.log("Preset downloaded");
  }, []);

  const requestDeletePreset = useCallback((id:number | undefined) => {
    if (!id) {
      console.log("Invalid Preset Id");
      return;
    }
    const url = ServerUrl + "/" + id.toString();
    fetch(url, { method:"DELETE",})
    .then((response) => 
      console.log(response.body))
    fetchPresetsFromServer();
  }, [fetchPresetsFromServer])

  useEffect(() => {
    setFilteredPresets(Presets.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())));
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
        <TextField
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        ></TextField>
        <List sx={{ overflow: "scroll" }}>
          {filteredPresets.map((preset) => (
            <ListItem key={preset.id}>
              <ListItemButton
                onClick={() => loadPresetSettings(preset.synthSettings)}
              >
                <ListItemText>
                  {preset.id}:{preset.name}
                </ListItemText>
              </ListItemButton>
              <Button onClick={() => requestDeletePreset(preset.id)}>Delete</Button>
            </ListItem>
          ))}
        </List>
        {filteredPresets.length > 0 || searchQuery.length == 0 ? (
          <Button onClick={() => fetchPresetsFromServer()}>
            fetch presets from Server
          </Button>
        ) : (
          <Button onClick={() => savePresetToServer()}>
            save presets To Server
          </Button>
        )}
      </Paper>
    </Grid>
  );
}
