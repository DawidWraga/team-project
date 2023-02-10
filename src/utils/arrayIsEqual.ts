export function arrayIsEqual<T>(a: T[], b: T[]) {
  const aSorted = a.sort();
  const bSorted = b.sort();
  return a.length === b.length && aSorted.every((v, i) => v === bSorted[i]);
}
