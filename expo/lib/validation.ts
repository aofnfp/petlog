/**
 * Validates a date string in YYYY-MM-DD format.
 * Returns true if the string represents a real calendar date.
 */
export function isValidDateString(value: string): boolean {
  if (!value) return false;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;
  const [, yearStr, monthStr, dayStr] = match;
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  const d = new Date(year, month - 1, day);
  return (
    d.getFullYear() === year &&
    d.getMonth() === month - 1 &&
    d.getDate() === day
  );
}

/**
 * Parses a numeric string safely, returning null if the result is NaN
 * or the input is empty/whitespace.
 */
export function safeParseFloat(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const num = parseFloat(trimmed);
  if (isNaN(num) || !isFinite(num)) return null;
  return num;
}

/**
 * Filters a text input to only allow numeric characters and at most one decimal point.
 * Useful as an onChangeText filter for numeric fields.
 */
export function filterNumericInput(text: string): string {
  let result = '';
  let hasDecimal = false;
  for (const ch of text) {
    if (ch >= '0' && ch <= '9') {
      result += ch;
    } else if (ch === '.' && !hasDecimal) {
      hasDecimal = true;
      result += ch;
    }
  }
  return result;
}
