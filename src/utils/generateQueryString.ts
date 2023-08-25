function generateQueryString(params: Record<string, string | number | boolean> | any): string {
  const queryString = Object.keys(params)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key].toString())}`)
    .join("&");

  return `?${queryString}`;
}

export default generateQueryString;
