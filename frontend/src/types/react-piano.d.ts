declare module 'react-piano' {
  import { ComponentType } from 'react';

  export interface PianoProps {
    noteRange: {
      first: number;
      last: number;
    };
    playNote?: (midiNumber: number) => void;
    stopNote?: (midiNumber: number) => void;
    width?: number | string;
    keyboardShortcuts?: Array<{
      key: string;
      midiNumber: number;
    }>;
  }

  export const Piano: ComponentType<PianoProps>;

  export const KeyboardShortcuts: {
    create: (config: {
      firstNote: number;
      lastNote: number;
      keyboardConfig: Array<{
        natural: string;
        flat?: string;
        sharp?: string;
      }>;
    }) => Array<{
      key: string;
      midiNumber: number;
    }>;
    HOME_ROW: Array<{
      natural: string;
      flat?: string;
      sharp?: string;
    }>;
    QWERTY_ROW: Array<{
      natural: string;
      flat?: string;
      sharp?: string;
    }>;
    BOTTOM_ROW: Array<{
      natural: string;
      flat?: string;
      sharp?: string;
    }>;
  };

  export const MidiNumbers: {
    fromNote: (note: string) => number;
  };
}

declare module 'react-piano/dist/styles.css' {
  const content: string;
  export default content;
}