export class ElementColors {
  static UNSORTED = "cyan";
  static SORTED = "blue";
  static ACTIVE_1 = "red";
  static ACTIVE_2 = "green";
  static ACTIVE_3 = "orange";
  static ACTIVE_SECTION = "purple";
}

export interface ArrayElement {
  key: number;
  value: number;
}

export interface Auxilary {
  startIndex: number;
  elements: ArrayElement[];
}

// State of array at a given step
export interface State {
  nums: ArrayElement[];
  colors?: string[];
  aside?: number;
  auxilary?: Auxilary;
}

export const mergeSort = (
  start: number,
  end: number,
  newArray: ArrayElement[]
): State[] => {
  if (start >= end - 1) return [];
  const mid = Math.floor((start + end) / 2);
  const sortedLeft = mergeSort(start, mid, newArray);
  const sortedRight = mergeSort(mid, end, newArray);
  const states: State[] = sortedLeft.concat(sortedRight);
  const auxilaryElements: ArrayElement[] = [];
  let leftPointer = start,
    rightPointer = mid;
  states.push({
    nums: [...newArray],
    colors: newArray.map((element, index) =>
      start <= index && index < end
        ? index === leftPointer
          ? ElementColors.ACTIVE_1
          : index === rightPointer
          ? ElementColors.ACTIVE_2
          : ElementColors.ACTIVE_SECTION
        : ElementColors.UNSORTED
    ),
  });
  while (leftPointer < mid || rightPointer < end) {
    if (
      rightPointer >= end ||
      (leftPointer < mid &&
        newArray[leftPointer].value <= newArray[rightPointer].value)
    ) {
      auxilaryElements.push(newArray[leftPointer]);
      leftPointer++;
    } else {
      auxilaryElements.push(newArray[rightPointer]);
      rightPointer++;
    }
    states.push({
      nums: [...newArray],
      auxilary: { startIndex: start, elements: [...auxilaryElements] },
      colors: newArray.map((element, index) =>
        start <= index && index < end
          ? index === leftPointer && index < mid
            ? ElementColors.ACTIVE_1
            : index === rightPointer
            ? ElementColors.ACTIVE_2
            : ElementColors.ACTIVE_SECTION
          : ElementColors.UNSORTED
      ),
    });
  }
  for (let i = start; i < end; i++) {
    newArray[i] = auxilaryElements[i - start];
  }
  states.push({
    nums: [...newArray],
    colors:
      start === 0 && end === newArray.length
        ? newArray.map((element) => ElementColors.SORTED)
        : newArray.map((element) => ElementColors.UNSORTED),
  });
  return states;
};

export const quickSort = (
  start: number,
  end: number,
  newArray: ArrayElement[]
): State[] => {
  if (start >= end - 1) return [];
  const states: State[] = [];
  let i = start;
  let partition = end - 1;
  for (let j = start; j < partition; j++) {
    states.push({
      nums: [...newArray],
      colors: newArray.map((element, index) =>
        index === partition
          ? ElementColors.ACTIVE_2
          : index === i
          ? ElementColors.ACTIVE_3
          : index === j
          ? ElementColors.ACTIVE_1
          : index < start
          ? ElementColors.SORTED
          : index < end
          ? ElementColors.ACTIVE_SECTION
          : ElementColors.UNSORTED
      ),
    });
    if (newArray[j].value < newArray[partition].value) {
      swap(newArray, i, j);
      states.push({
        nums: [...newArray],
        colors: newArray.map((element, index) =>
          index === partition
            ? ElementColors.ACTIVE_2
            : index === i
            ? ElementColors.ACTIVE_1
            : index === j
            ? ElementColors.ACTIVE_3
            : index < start
            ? ElementColors.SORTED
            : index < end
            ? ElementColors.ACTIVE_SECTION
            : ElementColors.UNSORTED
        ),
      });
      i += 1;
    }
  }
  swap(newArray, i, partition);
  states.push({
    nums: [...newArray],
    colors: newArray.map((element, index) =>
      index === partition
        ? ElementColors.ACTIVE_1
        : index === i
        ? ElementColors.ACTIVE_2
        : index < start
        ? ElementColors.SORTED
        : index < end
        ? ElementColors.ACTIVE_SECTION
        : ElementColors.UNSORTED
    ),
  });
  return states
    .concat(quickSort(start, i, newArray))
    .concat(quickSort(i + 1, end, newArray))
    .concat(
      start === 0 && end === newArray.length
        ? [
            {
              nums: [...newArray],
              colors: newArray.map((element, index) => ElementColors.SORTED),
            },
          ]
        : []
    );
};

export const bubbleSort = (array: ArrayElement[]) => {
  const newArray = [...array];
  const states: State[] = [];

  for (let i = 0; i < newArray.length; i++) {
    let swapped = false;
    for (let j = 0; j < newArray.length - i - 1; j++) {
      states.push({
        nums: [...newArray],
        colors: newArray.map((element, index) =>
          index > newArray.length - i - 1
            ? ElementColors.SORTED
            : index === j + 1
            ? ElementColors.ACTIVE_1
            : index === j
            ? ElementColors.ACTIVE_2
            : index > j
            ? ElementColors.UNSORTED
            : ElementColors.ACTIVE_SECTION
        ),
      });
      if (newArray[j].value > newArray[j + 1].value) {
        swap(newArray, j, j + 1);
        states.push({
          nums: [...newArray],
          colors: newArray.map((element, index) =>
            index > newArray.length - i - 1
              ? ElementColors.SORTED
              : index === j + 1
              ? ElementColors.ACTIVE_2
              : index === j
              ? ElementColors.ACTIVE_1
              : index > j
              ? ElementColors.UNSORTED
              : ElementColors.ACTIVE_SECTION
          ),
        });
        swapped = true;
      }
    }
    if (!swapped) break;
  }

  states.push({
    nums: [...newArray],
    colors: newArray.map((element) => ElementColors.SORTED),
  });
  return states;
};

export const insertionSort = (array: ArrayElement[]) => {
  const newArray = [...array];
  const states: State[] = [];
  for (let i = 1; i < newArray.length; i++) {
    states.push({
      nums: [...newArray],
      aside: newArray[i].key,
      colors: newArray.map((element, index) =>
        index === i
          ? ElementColors.ACTIVE_1
          : index < i
          ? ElementColors.ACTIVE_SECTION
          : ElementColors.UNSORTED
      ),
    });
    let j = i - 1;
    for (; j >= 0 && newArray[j].value > newArray[j + 1].value; j--) {
      swap(newArray, j, j + 1);
      states.push({
        nums: [...newArray],
        aside: newArray[j].key,
        colors: newArray.map((element, index) =>
          index === j
            ? ElementColors.ACTIVE_1
            : index === j + 1
            ? ElementColors.ACTIVE_2
            : index <= i
            ? ElementColors.ACTIVE_SECTION
            : ElementColors.UNSORTED
        ),
      });
    }
  }
  states.push({
    nums: [...newArray],
    colors: newArray.map((element) => ElementColors.SORTED),
  });
  return states;
};

export const selectionSort = (array: ArrayElement[]) => {
  const newArray = [...array];
  const states: State[] = [];
  for (let i = 0; i < newArray.length; i++) {
    let smallestIndex = i;
    for (let j = i; j < newArray.length; j++) {
      states.push({
        nums: [...newArray],
        colors: newArray.map((element, index) =>
          index === j
            ? ElementColors.ACTIVE_1
            : index === smallestIndex
            ? ElementColors.ACTIVE_2
            : index < i
            ? ElementColors.SORTED
            : index < j
            ? ElementColors.ACTIVE_SECTION
            : ElementColors.UNSORTED
        ),
      });
      if (newArray[j].value < newArray[smallestIndex].value) {
        smallestIndex = j;
      }
    }
    swap(newArray, i, smallestIndex);
    states.push({
      nums: [...newArray],
      colors: newArray.map((element, index) =>
        index === smallestIndex
          ? ElementColors.ACTIVE_2
          : index < i
          ? ElementColors.SORTED
          : ElementColors.ACTIVE_SECTION
      ),
    });
  }
  states.push({
    nums: [...newArray],
    colors: newArray.map((element) => ElementColors.SORTED),
  });
  return states;
};

const swap = (arr: ArrayElement[], i: number, j: number) => {
  const temp = arr[j];
  arr[j] = arr[i];
  arr[i] = temp;
};
