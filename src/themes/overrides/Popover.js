// ==============================|| OVERRIDES - DIALOG CONTENT TEXT ||============================== //

export default function Popover(theme) {
  return {
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: theme.shape?.borderRadius ?? 8,
          boxShadow: '0px 4px 16px rgba(0,0,0,0.10), 0px 1px 4px rgba(0,0,0,0.06)'
        }
      }
    }
  };
}
