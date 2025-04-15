import { useCallback, useEffect, useState } from "react";
import {
  useSynthStore,
  getSettingsFromState,
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
  Box,
  Stack,
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
  const [isInitialized, setIsInitialized] = useState(false);
  const { loadPresetSettings } = useSynthStore();
  const [Presets, setPresets] = useState<Preset[]>([]);
  const [filteredPresets, setFilteredPresets] = useState<Preset[]>([]);
  // const [fetchedPresets, setFetchedPresets] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  //サーバーにプリセットを保存するときのコールバック関数
  const savePresetToServer = useCallback(() => {
    const url = ServerUrl + "/presets";
    // const header = {method: "GET"}
    const preset: Preset = {
      name: searchQuery,
      synthSettings: getSettingsFromState(useSynthStore.getState()),
      isBuiltin: false,
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
      console.log(`Saved Presets To Server`);
      //この時点でセーブは完了
      // もう一度fetch
      fetchPresetsFromServer();
    });
  }, [searchQuery]);

  const fetchPresetsFromServer = useCallback(async () => {
    const url = ServerUrl + "/presets";
    await fetch(url, { method: "GET" })
      .then((response) => {
        console.log(`response: ${response}`);
        return response.json();
      })
      .then((data) => {
        setPresets(data);
        console.log("Preset downloaded");
      });
  }, []);

  const requestDeletePreset = useCallback(
    (id: number | undefined) => {
      if (!id) {
        console.log("Invalid Preset Id");
        return;
      }
      const url = ServerUrl + "/presets/" + id.toString();
      fetch(url, { method: "DELETE" }).then((response) => {
        console.log(response.body);
        fetchPresetsFromServer();
      });
    },
    [fetchPresetsFromServer]
  );

  useEffect(() => {
    setFilteredPresets(
      Presets.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [Presets, searchQuery]);

  useEffect(() => {
    fetchPresetsFromServer();
  }, []);
  useEffect(() => {
    if (!isInitialized && Presets.length > 0) {
      loadPresetSettings(Presets[0].synthSettings);
      setIsInitialized(true);
    }
  }, [Presets]);

  return (
    <Grid sx={{ ml: 0, mb: 3 }} size={{ xs: 12, md: 12 }}>
      <Paper
        elevation={2}
        sx={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Typography variant="h6">Presets</Typography>
        <Box sx={{ p: 1.5, borderBottom: 1, borderColor: "divider" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") savePresetToServer();
              }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={savePresetToServer}
              disabled={!searchQuery.trim()} // 名前が空(空白のみ含む)なら無効
              sx={{ flexShrink: 0 }} // ボタンが縮まないように
            >
              Save
            </Button>
          </Stack>
        </Box>
        <Box sx={{ overflowY: "auto", flexGrow: 1, p: 1 }}>
          <List>
            {filteredPresets.map((preset) => (
              <ListItem key={preset.id}>
                <ListItemButton
                  onClick={() => loadPresetSettings(preset.synthSettings)}
                >
                  <ListItemText>
                    {preset.id}:{preset.name}
                  </ListItemText>
                </ListItemButton>
                {preset.isBuiltin ? (
                  <></>
                ) : (
                  <Button onClick={() => requestDeletePreset(preset.id)}>
                    delete
                  </Button>
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>
    </Grid>
  );
}
