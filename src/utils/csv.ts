// Reusable CSV export helpers (RFC 4180-style escaping + UTF-8 BOM for Excel).

// Microsoft Excel (Vietnamese locale) does not assume CSV files are UTF-8 by
// default — without a hint, it reopens them using the legacy Windows-1258
// code page and every Vietnamese diacritic turns into mojibake. Prepending
// the UTF-8 byte-order mark (U+FEFF) to the file content tells Excel "this
// file is UTF-8", so Vietnamese text renders correctly when the .csv is
// double-clicked or opened directly, with no manual import wizard needed.
const UTF8_BOM = '\uFEFF';

// Excel expects CRLF line endings in CSV files.
const CSV_LINE_BREAK = '\r\n';

/**
 * Escapes a single CSV field per RFC 4180: values containing a comma, a
 * double quote, or a line break are wrapped in double quotes, and any quote
 * characters inside the value are doubled up.
 */
export function escapeCsvField(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Builds a complete CSV document (one header row followed by data rows) as a
 * single string, with the UTF-8 BOM prepended so Excel opens it correctly.
 */
export function buildCsv(headers: string[], rows: string[][]): string {
  const lines = [headers, ...rows].map((row) => row.map(escapeCsvField).join(','));
  return UTF8_BOM + lines.join(CSV_LINE_BREAK);
}

/**
 * Triggers a browser download of CSV content built by buildCsv(). The Blob
 * is tagged as UTF-8 CSV; combined with the embedded BOM, this is what makes
 * Vietnamese characters display correctly when the file is opened in Excel.
 */
export function downloadCsv(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Turns a display name into a filesystem-safe filename segment. */
export function sanitizeFilenamePart(value: string): string {
  return value.trim().replace(/\s+/g, '_').replace(/[\\/:*?"<>|]/g, '');
}
