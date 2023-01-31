export function keepFloatingLabelActive(
  childElement: HTMLElement,
  keepActiveCondition: boolean
) {
  const controlElem = getInputControlElement(childElement);

  if (keepActiveCondition) {
    controlElem.setAttribute('data-floating-label', '');
  } else {
    if (controlElem.hasAttribute('data-floating-label')) {
      controlElem.removeAttribute('data-floating-label');
    }
  }
}

/**
 * Returns the closest parent element with class 'chakra-form-control'.
 * If class 'chakra-form-control' was not found, returns undefined.
 * @param childElement - A child element of the form control element.
 * @param limit - The maximum number of parents to search.
 */
const getInputControlElement = (childElement: HTMLElement, limit = 10) => {
  let elem = childElement;
  let i = 0;
  while (i < limit && !elem.classList.contains('chakra-form-control')) {
    elem = elem.parentNode as any;
    i++;
  }

  return elem.classList.contains('chakra-form-control') ? elem : undefined;
};
