export function formatPercent(
  value = 0,
  precision = 2,
  showSuffix = true
): string {
  return `${Number((value || 0) * 100).toFixed(precision)}${
    showSuffix ? "%" : ""
  }`;
}
