import type { ReactNode } from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import TableSortLabel from '@mui/material/TableSortLabel';
import type { Column, SortDirection } from '../types/common';

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  actions?: (row: T) => ReactNode;
  sortableKey?: string;
  sortDirection?: SortDirection;
  onSortToggle?: () => void;
  rowDisabled?: (row: T) => boolean;
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  actions,
  sortableKey,
  sortDirection,
  onSortToggle,
  rowDisabled,
}: DataTableProps<T>) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={String(col.key)} style={{ width: col.width }}>
                {col.key === sortableKey && onSortToggle ? (
                  <TableSortLabel active direction={sortDirection} onClick={onSortToggle}>
                    {col.header}
                  </TableSortLabel>
                ) : (
                  col.header
                )}
              </TableCell>
            ))}
            {actions && (
              <TableCell align="right" style={{ width: 160 }}>
                Thao tác
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const disabled = rowDisabled?.(row);
            return (
              <TableRow key={getRowId(row)} hover sx={disabled ? { opacity: 0.6 } : undefined}>
                {columns.map((col) => (
                  <TableCell key={String(col.key)}>
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[String(col.key)] ?? '')}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell align="right">{actions(row)}</TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
