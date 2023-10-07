export function isValidDate(dateString: string | number) {
  if (dateString.toString().length < 12) {
    return false;
  }
  return !isNaN(Date.parse(dateString.toString()));
}
