// ==============================|| OVERRIDES - ALERT TITLE ||============================== //

export default function Accordion(theme) {
  return {
    MuiAccordion: {
      defaultProps: {
        disableGutters: true,
        square: false,
        elevation: 0
      },
      styleOverrides: {
        root: {
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: `${theme.shape?.borderRadius ?? 8}px !important`,
          overflow: 'hidden',
          '&:not(:last-child)': {
            marginBottom: 8,
            borderBottom: `1px solid ${theme.palette.divider}`
          },
          '&:before': {
            display: 'none'
          },
          '&.Mui-disabled': {
            backgroundColor: theme.palette.secondary.lighter
          }
        }
      }
    }
  };
}
