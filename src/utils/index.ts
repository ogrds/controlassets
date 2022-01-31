type ObjFind = {
  id: number;
};

export function findFreeId(array: ObjFind[]) {
  const sortedArray = array
    .slice() // Make a copy of the array.
    .sort(function (a, b) {
      return a.id - b.id;
    }); // Sort it.
  let previousId = 0;
  for (let element of sortedArray) {
    if (element.id != previousId + 1) {
      // Found a gap.
      return previousId + 1;
    }
    previousId = element.id;
  }
  // Found no gaps.
  return previousId + 1;
}
