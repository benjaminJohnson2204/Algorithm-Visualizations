import { MyArray, ElementColors, ArrayState } from '..';
import { ArraySort } from '.';

export class SelectionSort extends ArraySort {
  run() {
    const array = this.dataStructure as MyArray;
    for (let i = 0; i < array.state.elements.length; i++) {
      let smallestIndex = i;
      for (let j = i; j < array.state.elements.length; j++) {
        array.cloneStateNewColors((element, index) =>
          index === j
            ? ElementColors.ACTIVE_1
            : index === smallestIndex
            ? ElementColors.ACTIVE_2
            : index < i
            ? ElementColors.SORTED
            : index < j
            ? ElementColors.ACTIVE_SECTION
            : ElementColors.UNSORTED
        );

        if (array.getElement(j).value < array.getElement(smallestIndex).value) {
          smallestIndex = j;
        }
      }
      array.swap(i, smallestIndex);
      array.state.elements.forEach(
        (element, index) =>
          (element.color =
            index === smallestIndex
              ? ElementColors.ACTIVE_2
              : index < i
              ? ElementColors.SORTED
              : ElementColors.ACTIVE_SECTION)
      );
    }
    array.addCompleteState();
  }
}
