// src/theme.ts
import { createTheme } from '@mui/material/styles';
import { grey, blue } from '@mui/material/colors';

// ダークテーマを定義
const theme = createTheme({
  palette: {
    mode: 'dark', // ダークモードを基本にする
    primary: {
      main: blue[400], // アクセントカラー (青系)
    },
    secondary: {
      main: grey[500], // セカンダリカラー (グレー系)
    },
    background: {
      default: '#121212', // 全体の背景色 (非常に暗いグレー)
      paper: '#1E1E1E',   // Paperコンポーネントの背景色 (少し明るいグレー)
    },
    text: {
      primary: grey[100],  // メインの文字色 (白に近いグレー)
      secondary: grey[400], // サブの文字色 (少し暗いグレー)
    },
    divider:  'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h6: {
      fontWeight: 600,
      letterSpacing: '0.5px',
      color: grey[300], // セクションタイトルを少し目立たせる
    },
    caption: {
      color: grey[500], // ラベルの色を抑えめに
      fontWeight: 500,
    }
  },
  components: {
    // スライダーのデフォルトスタイルを少し調整
    MuiSlider: {
      styleOverrides: {
        root: {
          color: blue[400], // スライダーの色をプライマリカラーに
        },
        thumb: {
          '&:hover, &.Mui-focusVisible': {
            boxShadow: `0px 0px 0px 8px ${blue[400]}30`, // フォーカス時の影
          },
          '&.Mui-active': {
            boxShadow: `0px 0px 0px 14px ${blue[400]}30`, // ドラッグ時の影
          },
        },
        valueLabel: { // 値ラベルのスタイル
          backgroundColor: grey[700],
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Paperのグラデーションなどを無効化
        }
      }
    },
    MuiButton: {
        styleOverrides: {
            root: {
                textTransform: 'none', // ボタンの文字を大文字にしない
            }
        }
    }
  }
});

export default theme;