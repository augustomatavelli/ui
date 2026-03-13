// ==============================|| OVERRIDES - TABLE CELL ||============================== //

export default function TableHead(theme) {
  return {
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.grey[50],
          borderBottom: `1px solid ${theme.palette.divider}`
        }
      }
    }
  };
}
