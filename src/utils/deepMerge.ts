/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 *
 * @param {...object} objects - Objects to merge
 * @returns {object} New object with merged key/values
 */
export function mergeDeep(...objects: (Record<any, any> | undefined)[]) {
  const isObject = (obj: Record<any, any>) => obj && typeof obj === 'object';

  return objects.reduce((prev: Record<any, any>, obj: Record<any, any> = {}) => {
    Object.keys(obj).forEach((key) => {
      const pVal = prev[key];
      const oVal = obj[key];

      // !concatinating array leads to issues with overiding query key.
      // could just include the last few and the first 2 will be pressumed. Howver, this still limits ability to override defaults. Therefore, has been commented.
      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = [...oVal];
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal);
      } else {
        prev[key] = oVal;
      }
    });

    return prev;
  }, {});
}
