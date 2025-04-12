import { Container, Grid, Typography } from "@mui/material"; // Box, Typography をインポート
import "./App.css";
// import { useAudioEngine } from "./useAudioEngine"; // 必要ならコメント解除
import OscillatorSection from "./components/OscillatorSection";
import FilterSection from "./components/FilterSection";
import AmpSection from "./components/AmpSection";
import LFOSection from "./components/LFOSection"; // LFOSectionも同様に修正が必要
import KeyboardSection from "./components/KeyboardSection"; // KeyboardSectionも同様に修正が必要
// import { PresetManager } from "./components/PresetManager"; // PresetManagerも同様に修正が必要
// import InitializationButton from "./components/InitializationButton"; // 必要ならコメント解除
// import VoicingControl from "./components/VoicingControl"; // 必要なら作成・コメント解除

function App() {
  // const { initializeAudioContext } = useAudioEngine(); // 必要に応じて
  // const [isInitialized, setIsInitialized] = useState(false); // 必要に応じて
  // const handleInitialize = () => { ... }; // 必要に応じて

  return (
    // ContainerのmaxWidthを調整 (xl など広めにするかはお好みで)
    <Container maxWidth="xl" sx={{ py: 4 }}> {/* 上下にpaddingを追加 */}
        <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 4}}>
             Web Synthesizer
        </Typography>

      {/* TODO: Add Initialization Button and Voicing controls here if needed */}
      {/* <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
           <InitializationButton isInitialized={isInitialized} onInitialize={handleInitialize} />
           <VoicingControl />
         </Box>
      */}

      {/* シンセコントロールセクション */}
      {/* spacingを調整 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* 各セクションコンポーネントを配置 */}
        <OscillatorSection />
        <FilterSection />
        <AmpSection />
        <LFOSection /> {/* このコンポーネントも同様のスタイル修正が必要 */}
      </Grid>

      {/* プリセットマネージャーとキーボードセクション */}
      <Grid container spacing={3}>
          <Grid size={{ xs:12, md:5, lg:4}}> {/* PresetManager用のGrid */}
             {/*  <PresetManager /> このコンポーネントも同様のスタイル修正が必要 */}
          </Grid>
          <Grid size={{ xs:12, md:5, lg:4}}> {/* Keyboard用のGrid */}
             <KeyboardSection/> {/* このコンポーネントも同様のスタイル修正が必要 */}
          </Grid>
      </Grid>

    </Container>
  );
}

export default App;