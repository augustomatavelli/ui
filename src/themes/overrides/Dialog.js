// material-ui
import { alpha } from '@mui/material/styles';

// ==============================|| OVERRIDES - DIALOG ||============================== //

export default function Dialog() {
  return {
    MuiDialog: {
      styleOverrides: {
        root: {
          '& .MuiBackdrop-root': {
            backgroundColor: alpha('#000', 0.5)
          }
        },
        paper: {
          borderRadius: 16,
          boxShadow: '0px 24px 48px rgba(0,0,0,0.14), 0px 8px 16px rgba(0,0,0,0.06)'
        }
      }
    }
  };
}
