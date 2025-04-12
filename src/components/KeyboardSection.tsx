
import { useAudioEngine } from "../useAudioEngine";
import { Grid, Button} from "@mui/material"

const noteFrequencies = {
  C4: 60,
  Cs4:61,
  D4: 62,
  Ds4:63,
  E4: 64,
  F4: 65,
  Fs4:66,
  G4: 67,
  Gs4:68,
  A4: 69,
  As4:70,
  B4: 71,
  C5: 72,
};

export default function KeyboardSection() {

  const {noteHold, noteRelease} = useAudioEngine()
  return (
    <Grid size={12}>
    {Object.entries(noteFrequencies).map(([noteName, notefreq]) => {
      return (
        
          <Button key={noteName}
            onMouseDown={() => noteHold(notefreq)}
            onMouseUp={noteRelease}
          >
            {noteName}
          </Button>
        
      );
    })}
    <Button onMouseDown={() => noteHold(440)} onMouseUp={noteRelease}>
      Hold to play note
    </Button>
  </Grid>
  )
}