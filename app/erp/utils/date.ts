/**
 * Format a Date object or timestamp into standard British English packaging docket date (DD Mon YYYY).
 * e.g., "19 Aug 2026"
 */
export const formatDocketDate = (date: Date = new Date()): string => {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/**
 * Add days to current date and format as DD Mon YYYY
 */
export const addDaysAndFormat = (days: number): string => {
  return formatDocketDate(new Date(Date.now() + days * 24 * 60 * 60 * 1000));
};
