export function checkForConditions(
  conditions: string[],
  value: any,
  any = true
) {

  const matches = conditions.map(x => {
    return x.localeCompare(value) === 0 ? true : false;
  });


  if (any) {
    return areAnyTrue(matches);
  } else {
    return areAllTrue(matches);
  }
}

export function areAnyTrue(items: boolean[]) {
  return items.find(x => x === true);
}

export function areAllTrue(items: boolean[]) {
  let areTrue = true;
  items.forEach(item => {
    if (!item) {
      areTrue = false;
    }
  });
  return areTrue;
}
