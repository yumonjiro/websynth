import { useAudioEngine } from "../useAudioEngine";
import {
  Box,
  Button,
  Drawer,
  Grid,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { Piano, KeyboardShortcuts, MidiNumbers } from "react-piano"; //https://github.com/kevinsqi/react-piano?tab=readme-ov-file
import "react-piano/dist/styles.css";
import "./custumPianoStyles.css";
import { useCallback, useEffect, useState } from "react";
const RANGEOFFSET = 12;

export default function KeyboardSection() {
  const [keyOctaveOffset, setOctaveOffset] = useState<number>(0);

  
  const [noteRange, setNoteRange] = useState({
    firstNote: MidiNumbers.fromNote("c4") + 12*keyOctaveOffset,
    lastNote: MidiNumbers.fromNote("e5") + 12*keyOctaveOffset,
  });
  const [noteRange2, setNoteRange2] = useState({
    firstNote: noteRange.firstNote + RANGEOFFSET,
    lastNote: noteRange.lastNote + RANGEOFFSET,
  });
  

  const sc1 = KeyboardShortcuts.create({
    ...noteRange,
    keyboardConfig: KeyboardShortcuts.QWERTY_ROW,
  });
  const sc2 = KeyboardShortcuts.create({
    ...noteRange2,
    keyboardConfig: KeyboardShortcuts.BOTTOM_ROW,
  });

  const [keyboardShortcuts, setShortCuts] = useState<Array<object>>([
    ...sc1,
    ...sc2,
  ]);

  // const handleOctaveUp = useCallback(() => {
  //   setOctaveOffset(keyOctaveOffset + 1);
  //   const newRange = noteRange;
  //   newRange.firstNote += 12;
  //   newRange.lastNote += 12;
  //   setNoteRange(newRange);
  //   setShortCuts(
  //     KeyboardShortcuts.create({
  //       ...newRange,
  //       keyboardConfig: KeyboardShortcuts.HOME_ROW,
  //     })
  //   );
  // }, [keyOctaveOffset]);

  // const handleOctaveDown = useCallback(() => {
  //   setOctaveOffset(keyOctaveOffset - 1);
  //   const newRange = noteRange;
  //   newRange.firstNote -= 12;
  //   newRange.lastNote -= 12;
  //   setNoteRange(newRange);
  //   setShortCuts(
  //     KeyboardShortcuts.create({
  //       ...newRange,
  //       keyboardConfig: KeyboardShortcuts.HOME_ROW,
  //     })
  //   );
  // }, [keyOctaveOffset, noteRange]);
  useEffect(() => {
    // const sc1:Array<object> = KeyboardShortcuts.create({
    //   ...noteRange,
    //   keyboardConfig: KeyboardShortcuts.QWERTY_ROW,
    // });
    // const range2 = noteRange;
    // range2.firstNote += sc1.length
    // range2.lastNote += sc1.length
    // const sc2:Array<object> = KeyboardShortcuts.create({
    //   ...range2,
    //   keyboardConfig: KeyboardShortcuts.BOTTOM_ROW,
    // })
    // setShortCuts([...sc1, ...sc2]);
  }, []);

  const { noteHold, noteRelease } = useAudioEngine();
  return (
    <Grid size={{ xs: 12, md: 6, lg: 9 }}>
      <Paper
        elevation={2}
        sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Stack
          display="flex"
          flexDirection="row"
          justifyContent="center"
          justifyItems="center"
          alignContent="center"
          alignItems="center"
        >
          <Button onClick={() => handleOctaveDown()}>Oct -</Button>
          <TextField
            variant="outlined"
            size="small"
            sx={{
              maxWidth: "50px",
            }}
            value={keyOctaveOffset}
          />
          <Button onClick={() => handleOctaveUp()}>Oct +</Button>
        </Stack>

        <Box height={"100%"} width={"100%"} >
          <Piano
            noteRange={{ first: noteRange.firstNote, last: noteRange.lastNote + 12 }}
            playNote={(midiNumber: number) => {
              noteHold(midiNumber);
            }}
            stopNote={(midiNumber: number) => {
              noteRelease(midiNumber);
            }}
            width={"1000"}
            keyboardShortcuts={keyboardShortcuts}
          />
        </Box>
      </Paper>
    </Grid>
  );
}
