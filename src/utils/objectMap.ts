// objectMap takes an object and a callback function, and returns a new object with the same keys, but the values are mapped using the callback function.

export const objectMap = <T>(
  obj: { [key: string]: T },
  fn: (v: T, k: string, i: number) => any
) => {
  // 1. Get object entries
  const entries = Object.entries(obj);
  // 2. Map entries to new value
  const mappedEntries = entries.map(([k, v], i) => [k, fn(v, k, i)]);
  // 3. Turn entries back into an object
  const newObj = Object.fromEntries(mappedEntries);

  return newObj;
};
