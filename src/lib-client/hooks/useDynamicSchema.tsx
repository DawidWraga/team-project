import { AnyZodObject } from 'zod';
import { useState } from 'react';
import { objectMap } from 'utils/objectMap';

export const addPrefixToObject = (obj: Record<any, any>, prefix: string) => {
  const entries = Object.entries(obj);
  const mapped = entries.map(([k, v]) => [`${prefix}_${k}`, v]);
  return Object.fromEntries(mapped);
};
export const addSuffixToObject = (obj: Record<any, any>, suffix: string | number) => {
  const entries = Object.entries(obj);
  const mapped = entries.map(([k, v]) => [`${k.split('-')[0]}-${suffix}`, v]);
  return Object.fromEntries(mapped);
};

// whole = schemaName
// objectName=string&property=string&index=stringNum

/**
 *
 * Hook for creating and updating zod schema.
 * Supports adding / removing arrays of objects
 *
 * @param schema
 * @returns
 */
export function useDynamicSchema(schema) {
  const [dynamicSchema, setDynamicSchema] = useState(schema);

  const updateSchema = {
    set: setDynamicSchema,
    addObj: (key: string, schema: AnyZodObject | Record<any, any>) => {
      let newSchema: Record<any, any> = schema.shape ? schema.shape : schema;

      newSchema = addPrefixToObject(newSchema, key);

      setDynamicSchema((prev: any) => {
        const prevKeys = Object.keys(prev.shape);
        const relatedKeys = prevKeys.filter((k) => k.split('_')[0].includes(key));

        let id: string | number = '0';
        if (relatedKeys.length) {
          const relatedIds = relatedKeys.map((k) => {
            return Number(k.split('-')[1]);
          });
          const maxId = Math.max(...relatedIds);
          id = maxId + 1;
        }
        newSchema = addSuffixToObject(newSchema, id);
        const extended = prev.extend(newSchema);
        return extended;
      });
      return newSchema;
    },
    remove: (keys: string[]) => {
      setDynamicSchema((prev) => {
        // const sch = z.object({ test: z.string() });
        const mask = Object.fromEntries(keys.map((k) => [k, true]));
        // sch.omit(m);
        return prev.omit(mask);

        // prev.
      });
    },
  };

  return [dynamicSchema, updateSchema] as const;
}

export function stringifiedToDataArray(
  stringifiedData: Record<string, any>,
  dynamicSchemaNames: string[]
) {
  // separate dynamic and nondynamic data
  const [dynamicData, restData] = [{}, {}] as any;
  for (const [k, v] of Object.entries(stringifiedData)) {
    if (dynamicSchemaNames.some((schemaName) => k.includes(schemaName))) {
      dynamicData[k] = v;
    } else {
      restData[k] = v;
    }
  }

  // for each dynamic schema, format data into array of objects
  dynamicSchemaNames.forEach((schemaName) => {
    const keys = Object.keys(dynamicData);
    const relevantkeys = keys.filter((key) => key.includes(schemaName));
    const aliasKeyToRealKey = formatObjectKeys(relevantkeys);

    const formattedDynamicData = aliasKeyToRealKey.map((obj) =>
      objectMap(obj, (realKey) => dynamicData[realKey])
    );
    restData[schemaName] = formattedDynamicData;
  });

  return restData;

  // const processedData = Object.entries(stringifiedData).reduce((acc, [k, v]) => {
  //   //if key is not dynamic, do not process value
  //   if (!dynamicSchemaNames.some((schemaName) => k.includes(schemaName))) return acc[k]=v;

  //   // process dynamic values into k=name, v=array
  //     const name = getNameFromObjectKey(k);
  //     const id = k.split('-')[1];
  //     const entity = k.split('_')[0];

  //   acc[name] = [
  //   ...(acc[name]&&acc[name]),
  //   v

  // ]
  //   {
  //     ...(acc[id] && acc[id]),
  //     [name]: currentKey,
  //   };

  //   return acc;
  // }, {} as Record<string, any>);

  // const data = {...stringifiedData}
  // const dynamicSchemaData = dynamicSchemaNames.map((schemaName) => {
  //   // const dataEnteries = Object.entries(stringifiedData).filter(
  //   //   ([k, v]) => getNameFromObjectKey(k) === schemaName
  //   // );

  //   // const dataO

  //   for (const [k,v] of Object.entries(data)){
  //     if(!k.includes(schemaName)) continue
  //   }

  // });
}

// stringifiedToName
export const getNameFromObjectKey = (objectKey: string) =>
  objectKey.split('-')[0].split('_')[1];

// stringifiedToNames
/**
 *
 * @example
 * ```ts
 * const formattedKeys = formatObjectKeys(
 * [entity_propA-1,entity_propB-1,entity_propA-2,entity_propB-2,]
 * )
 * console.log(formattedKeys)
 * ///[
 * ///   {propA: entity_propA-1, propB: entity_propB-1},
 * ///   {propA: entity_propA-2, propB: entity_propB-2},
 * ///]
 * ```
 */
export function formatObjectKeys(objectKeys: string[]): Record<string, string>[] {
  const arr = objectKeys.reduce((acc, currentKey) => {
    const id = currentKey.split('-')[1];
    const name = getNameFromObjectKey(currentKey);
    acc[id] = {
      ...(acc[id] && acc[id]),
      [name]: currentKey,
    };

    return acc;
  }, {} as Record<string, any>);
  return Object.values(arr);
}

// export function focusOnSchema(schema: Record<any, any>, target: string) {
//   const keys = Object.keys(schema);
//   const key = keys.find((key) => key.includes(target));

//   setTimeoutPromise(100).then(() => {
//     const ele: HTMLInputElement = document.querySelector(`[name=${key}]`);

//     const previewElem = ele.querySelector('.chakra-editable__preview');
//     const inputElem = ele.querySelector('.chakra-editable__input');

//     previewElem.setAttribute('hidden', '');
//     // ele.focus();
//     inputElem.classList.add('focus-visible');
//     inputElem.removeAttribute('hidden');
//     // ele.outerHTML += 'testing';
//   });
// }
