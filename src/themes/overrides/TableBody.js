// ==============================|| OVERRIDES - TABLE ROW ||============================== //

export default function TableBody(theme) {
  const hoverStyle = {
    '&:hover': {
      backgroundColor: theme.palette.primary.lighter,
      transition: 'background-color 0.15s ease'
    }
  };

  return {
    MuiTableBody: {
      styleOverrides: {
        root: {
          '&.striped .MuiTableRow-root': {
            '&:nth-of-type(even)': {
              backgroundColor: theme.palette.grey[50]
            },
            ...hoverStyle
          },
          '& .MuiTableRow-root': {
            ...hoverStyle
          }
        }
      }
    }
  };
}
