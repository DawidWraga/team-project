export function keepFloatingLabelActive(childElement: HTMLElement, keepActiveCondition) {
  const controlElem = getInputControlElement(childElement);

  if (keepActiveCondition) {
    controlElem.setAttribute('data-floating-label', '');
  } else {
    if (controlElem.hasAttribute('data-floating-label')) {
      controlElem.removeAttribute('data-floating-label');
    }
  }
}

const getInputControlElement = (childElement: HTMLElement) => {
  let elem = childElement;
  let i = 0;
  while (i < 10 && !elem.classList.contains('chakra-form-control')) {
    elem = elem.parentNode as any;
    i++;
  }

  return elem.classList.contains('chakra-form-control') ? elem : undefined;
};
