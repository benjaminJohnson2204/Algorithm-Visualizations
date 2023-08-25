import {
  MyAlgorithm,
  DataStructure,
  DataStructureState,
} from 'lib/dataStructure';

export enum ElementColors {
  UNSORTED = 'cyan',
  SORTED = 'blue',
  ACTIVE_1 = 'red',
  ACTIVE_2 = 'green',
  ACTIVE_3 = 'orange',
  ACTIVE_SECTION = 'purple',
}

const MIN_ARRAY_VAL = 1,
  MAX_ARRAY_VAL = 10;

export const getRandomArrayElements = (length: number) => {
  const elements: ArrayElement[] = [];
  for (let i = 0; i < length; i++) {
    elements.push(
      new ArrayElement(
        i,
        MIN_ARRAY_VAL +
          Math.floor(Math.random() * (MAX_ARRAY_VAL - MIN_ARRAY_VAL))
      )
    );
  }
  return elements;
};

export class ArrayElement {
  key: number;
  value: number;
  color?: string;

  constructor(key: number, value: number, color?: string) {
    this.key = key;
    this.value = value;
    this.color = color ?? ElementColors.UNSORTED;
  }

  clone() {
    return new ArrayElement(this.key, this.value, this.color);
  }
}

export type ArrayColorGenerator = (
  element: ArrayElement,
  index: number
) => string;

export interface Auxilary {
  startIndex: number;
  elements: ArrayElement[];
}

export class ArrayState implements DataStructureState {
  elements: ArrayElement[];
  aside?: number;
  auxilary?: Auxilary;

  constructor(elements: ArrayElement[], aside?: number, auxilary?: Auxilary) {
    this.elements = elements.map((element) => element.clone());
    this.aside = aside;
    this.auxilary = auxilary ?? {
      startIndex: 0,
      elements: [],
    };
  }

  clone() {
    return new ArrayState(
      this.elements,
      this.aside,
      this.auxilary && {
        startIndex: this.auxilary.startIndex,
        elements: this.auxilary.elements.map((element) => element.clone()),
      }
    );
  }

  /**
   * Maps the state's elements to colors based on their indices. This mutates
   * the elements. For example, if we have 4 elements, then
   * mapColors(['red', 'green', 'blue'], [2]) would map the colors to
   * ['red', 'red', 'green', 'blue'], since 'red' goes before the boundary, 'green' at it,
   * and 'blue' afterward.
   * @param colors the colors to use, in order from start to finish
   * @param boundaries indices of boundaries at which to change colors (different color before,
   * at, and after)
   */
  mapColors(colors: string[], boundaries: number[]) {
    if (colors.length === 0) return;
    if (boundaries.length === 0) {
      // No boundaries = all elements are first color
      this.elements.forEach((element) => {
        element.color = colors[0];
      });
    }
    let currentColorIndex = 0;
    let nextBoundaryIndex = 0;
    this.elements.forEach((element, index) => {
      if (
        nextBoundaryIndex >= boundaries.length ||
        index === boundaries[nextBoundaryIndex]
      ) {
        element.color = colors[++currentColorIndex];
        currentColorIndex++;
        nextBoundaryIndex++;
      } else {
        element.color = colors[currentColorIndex];
      }
    });
  }
}

export class MyArray implements DataStructure {
  state: ArrayState;
  stateHistory: DataStructureState[];

  constructor(elements?: ArrayElement[]) {
    this.state = new ArrayState(elements ?? []);
    this.stateHistory = [this.state];
  }

  addState(newState: DataStructureState) {
    this.stateHistory.push(newState);
    this.state = newState as ArrayState;
  }

  getElement(index: number) {
    return this.state.elements[index];
  }

  setElement(index: number, element: ArrayElement) {
    this.state.elements[index] = element;
  }

  cloneStateNewColors(
    colorGenerator: ArrayColorGenerator,
    aside?: number,
    newAuxilary?: Auxilary
  ) {
    this.addState(
      new ArrayState(
        this.state.elements.map((element, index) => {
          const newElement = element.clone();
          newElement.color = colorGenerator(element, index);
          return newElement;
        }),
        aside,
        newAuxilary ??
          (this.state.auxilary && {
            startIndex: this.state.auxilary.startIndex,
            elements: this.state.auxilary.elements.map((element) =>
              element.clone()
            ),
          })
      )
    );
  }

  /**
   * Clones the array's state and swaps two elements in the new state
   * @param i index of first element to swap
   * @param j index of second element to swap
   */
  swap(i: number, j: number) {
    this.addState(this.state.clone());
    const temp = this.getElement(i);
    this.setElement(i, this.getElement(j));
    this.setElement(j, temp);
  }

  addCompleteState() {
    this.cloneStateNewColors((element, index) => ElementColors.SORTED);
  }
}
