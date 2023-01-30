import { AnyZodObject } from 'zod';
import { useState } from 'react';
import { objectMap } from 'utils/objectMap';

interface SchemaIdData {
  objectName: string;
  property: string;
  index: string;
}

/**
 *
 * Hook for creating and updating zod schema.
 * Supports adding / removing arrays of objects
 * schemaName = entire string used to identify schema
 * eg objectName=string&property=string&index=stringNum
 *
 * @param schema
 * @returns
 */
export function useDynamicSchema(schema) {
  const [dynamicSchema, setDynamicSchema] = useState(schema);

  const updateSchema = {
    set: setDynamicSchema,
    addObj: (objectName: string, schema: AnyZodObject | Record<any, any>) => {
      setDynamicSchema((prev: any) => {
        let newSchema: Record<any, any> = schema.shape ? schema.shape : schema;
        if (!prev) {
          return schemaObjectToSchemaNames(newSchema, objectName, '0');
        }

        const prevSchemaNames = Object.keys(prev.shape);
        const relatedSchemaNames = getRelatedSchemaNames(
          prevSchemaNames,
          'objectName',
          objectName
        );

        let index: string | number = '0';
        if (relatedSchemaNames.length) {
          const relatedIndexes = relatedSchemaNames.map((name) =>
            Number(parseSchemaName(name).index)
          );
          const maxId = Math.max(...relatedIndexes);
          index = (maxId + 1).toString();
        }
        newSchema = schemaObjectToSchemaNames(newSchema, objectName, index);
        const extended = prev.extend(newSchema);
        return extended;
      });
    },
    remove: (schemaNames: string | string[]) => {
      const names = typeof schemaNames === 'string' ? [schemaNames] : schemaNames;

      setDynamicSchema((prev) => {
        const mask = Object.fromEntries(names.map((schemaName) => [schemaName, true]));
        return prev.omit(mask);
      });
    },
  };

  return [dynamicSchema, updateSchema] as const;
}

export function parseSchemaName(schemaName: string): SchemaIdData {
  const props = schemaName.split('&');
  const entries = props.map((prop) => prop.split('='));
  return Object.fromEntries(entries);
}

export function getSchemaName(props: SchemaIdData) {
  return Object.entries(props)
    .map((prop) => prop.join('='))
    .join('&');
}

export function schemaObjectToSchemaNames(
  schema: Record<any, any>,
  objectName: string,
  index: string
) {
  return Object.fromEntries(
    Object.entries(schema).map(([property, schema]) => [
      getSchemaName({ objectName, property, index }),
      schema,
    ])
  );
}

export function getRelatedSchemas(
  schemas: Record<string, any>[],
  targetKey: keyof SchemaIdData,
  targetValue: string | number
) {
  return schemas.filter((schema) => schema[targetKey] === targetValue);
}
export function getRelatedSchemaNames(
  schemaNames: string[],
  targetKey: keyof SchemaIdData,
  targetValue: string | number
) {
  return schemaNames.filter(
    (schema) => parseSchemaName(schema)[targetKey] === targetValue
  );
}

export function formatDynamicSchemaData(
  schemaNameToData: Record<string, any>,
  dynamicSchemaObjectNames: string[]
) {
  // for each dynamic schema, format data into array of objects
  const formattedData = dynamicSchemaObjectNames.reduce((acc, objectName) => {
    const relevantSchemaNames = getRelatedSchemaNames(
      Object.keys(schemaNameToData),
      'objectName',
      objectName
    );

    if (!relevantSchemaNames || !relevantSchemaNames.length) {
      acc[objectName] = [];
      return acc;
    }

    const groupedSchemaNames = groupSchemaNames(relevantSchemaNames);

    const formattedDynamicData = groupedSchemaNames.map((obj) =>
      objectMap(obj, (schemaName) => schemaNameToData[schemaName])
    );
    acc[objectName] = formattedDynamicData;
    return acc;
  }, {} as Record<any, any>);

  const staticData = Object.fromEntries(
    Object.entries(schemaNameToData).filter(
      ([schema]) =>
        !dynamicSchemaObjectNames.some((schemaName) => schema.includes(schemaName))
    )
  );

  return { ...staticData, ...formattedData };
}

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

export function groupSchemaNames(schemaNames: string[]): Record<string, string>[] {
  const arr = schemaNames.reduce((acc, currentName) => {
    const { index, property } = parseSchemaName(currentName);
    acc[index] = {
      ...(acc[index] && acc[index]),
      [property]: currentName,
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
