function objectToString(obj: any) {
  const keyValuePairs = [];

  for (const key in obj) {
    keyValuePairs.push(`${key}:${obj[key]}`);
  }

  return "keys=" + keyValuePairs.join(",");
}

export default objectToString;
