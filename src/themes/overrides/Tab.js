// ==============================|| OVERRIDES - TAB ||============================== //

export default function Tab(theme) {
  return {
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 44,
          color: theme.palette.text.secondary,
          fontWeight: 500,
          fontSize: '0.875rem',
          borderRadius: theme.shape?.borderRadius ?? 8,
          transition: 'color 0.2s ease, background-color 0.2s ease',
          '&:hover': {
            backgroundColor: theme.palette.primary.lighter,
            color: theme.palette.primary.main
          },
          '&.Mui-selected': {
            color: theme.palette.primary.main,
            fontWeight: 600
          },
          '&:focus-visible': {
            borderRadius: theme.shape?.borderRadius ?? 8,
            outline: `2px solid ${theme.palette.secondary.dark}`,
            outlineOffset: -3
          }
        }
      }
    }
  };
}
