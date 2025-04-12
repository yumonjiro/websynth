
import { useAudioEngine } from "../useAudioEngine";
import { Grid, Button} from "@mui/material"

const noteFrequencies = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
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