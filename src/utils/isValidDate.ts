export function isValidDate(dateString: string) {
  return !isNaN(Date.parse(dateString));
}
