// ==============================|| OVERRIDES - TABLE CELL ||============================== //

export default function TableCell(theme) {
  return {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          padding: '12px 16px',
          borderColor: theme.palette.divider
        },
        sizeSmall: {
          padding: '8px 12px'
        },
        head: {
          fontSize: '0.72rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: theme.palette.text.secondary,
          padding: '10px 16px'
        },
        footer: {
          fontSize: '0.75rem',
          textTransform: 'uppercase'
        }
      }
    }
  };
}
