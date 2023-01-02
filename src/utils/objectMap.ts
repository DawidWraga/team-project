export const objectMap = <T>(
  obj: { [key: string]: T },
  fn: (v: T, k: string, i: number) => any
) => Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));
