function generateQueryString(params: Record<string, string | number | boolean>): string {
  const queryString = Object.keys(params)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key].toString())}`)
    .join("&");

  return `?${queryString}`;
}

export default generateQueryString;
