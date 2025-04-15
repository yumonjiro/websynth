import { useAudioEngine } from "../useAudioEngine";
import { Box, Button, Drawer, Stack, TextField, Typography } from "@mui/material";
import { Piano, KeyboardShortcuts, MidiNumbers } from "react-piano"; //https://github.com/kevinsqi/react-piano?tab=readme-ov-file 
import "react-piano/dist/styles.css";
import "./custumPianoStyles.css";
import { useCallback, useEffect, useState } from "react";
export default function KeyboardSection() {

  const [noteRange, setNoteRange] = useState({
    firstNote: MidiNumbers.fromNote("c3"),
    lastNote: MidiNumbers.fromNote("c5"),
  });

  const [keyboardShortcuts, setShortCuts] = useState(KeyboardShortcuts.create({
    ...noteRange,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  }
  ));
  const [keyOctaveOffset, setOctaveOffset] = useState<number>(0);

  const [open, setOpen] = useState<boolean>(true);
  const handleOctaveUp = useCallback(() => {
    setOctaveOffset(keyOctaveOffset + 1);
    const newRange = noteRange;
    newRange.firstNote += 12;
    newRange.lastNote += 12;
    setNoteRange(newRange)
    setShortCuts(
      KeyboardShortcuts.create({
        ...newRange,
        keyboardConfig: KeyboardShortcuts.HOME_ROW,
      }))
  }, [keyOctaveOffset, noteRange]);

  const handleOctaveDown = useCallback(() => {
    setOctaveOffset(keyOctaveOffset - 1);
    const newRange = noteRange;
    newRange.firstNote -= 12;
    newRange.lastNote -= 12;
    setNoteRange(newRange)
    setShortCuts(
      KeyboardShortcuts.create({
        ...newRange,
        keyboardConfig: KeyboardShortcuts.HOME_ROW,
      }))
  }, [keyOctaveOffset, noteRange]);
  useEffect(() => {
  }, [])

  const { noteHold, noteRelease } = useAudioEngine();
  return (
    <Box sx={{
    }}>
    <Drawer anchor="bottom" open={false} variant="persistent" sx={{
      height:"40vh"
    }}>
      <Stack display="flex" flexDirection="row"
      justifyContent="center"
      justifyItems="center"
      alignContent="center"
      alignItems="center"
      >
      <Button  onClick={() => handleOctaveDown()}>Oct -</Button>
      <TextField 
      
      variant="outlined"
      size="small"
      sx={{
        maxWidth:"50px"
      }}
      value={keyOctaveOffset}/>
      <Button onClick={() => handleOctaveUp()}>Oct +</Button> 
      </Stack>
      
      <Box height={"100%"} width={"100%"}>
      <Piano
        
        noteRange={{ first: noteRange.firstNote, last: noteRange.lastNote }}
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
    </Drawer>
    </Box>
  );
}
