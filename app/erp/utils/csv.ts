/**
 * Sanitize a CSV cell value to prevent CSV Formula Injection (CWE-1236).
 * Prepends a single quote if the string begins with =, +, -, @, \t, \r
 */
export const sanitizeCsvValue = (val: string | number | undefined | null): string => {
  if (val === undefined || val === null) return '""';
  const str = String(val).replace(/"/g, '""');
  if (/^[=+\-@\t\r]/.test(str)) {
    return `"'${str}"`;
  }
  return `"${str}"`;
};
