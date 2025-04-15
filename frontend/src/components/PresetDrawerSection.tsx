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
  Drawer,
} from "@mui/material"; // Paper, Divider を追加
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';

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
export default function PresetDrawerSection() {
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

  const fetchPresetsFromServer = useCallback(() => {
    const url = ServerUrl + "/presets";
    fetch(url, { method: "GET" })
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

  //コンポーネント初期化時に一回プリセットをダウンロード
  useEffect(() => {
    fetchPresetsFromServer();
  }, []);

  return (
    <Drawer variant="persistent" open>
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
              {preset.isBuiltin ? 
              <></> :
              <Button onClick={() => requestDeletePreset(preset.id)}>
                Delete
              </Button>
              } 
            </ListItem>
          ))}
        </List>
      </Paper>
    </Drawer>
  );
}
