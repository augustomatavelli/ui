// material-ui
// ==============================|| OVERRIDES - TOOLTIP ||============================== //

export default function Tooltip(theme) {
  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          color: theme.palette.background.paper,
          borderRadius: 6,
          fontSize: '0.75rem',
          padding: '6px 10px',
          fontWeight: 500
        },
        arrow: {
          color: theme.palette.grey[800]
        }
      }
    }
  };
}
