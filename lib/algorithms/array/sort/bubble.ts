import { MyArray, ElementColors, ArrayState } from '..';
import { ArraySort } from '.';

export class BubbleSort extends ArraySort {
  run() {
    const array = this.dataStructure as MyArray;
    for (let i = 0; i < array.state.elements.length; i++) {
      let swapped = false;
      for (let j = 0; j < array.state.elements.length - i - 1; j++) {
        array.cloneStateNewColors((element, index) =>
          index > array.state.elements.length - i - 1
            ? ElementColors.SORTED
            : index === j + 1
            ? ElementColors.ACTIVE_1
            : index === j
            ? ElementColors.ACTIVE_2
            : index > j
            ? ElementColors.UNSORTED
            : ElementColors.ACTIVE_SECTION
        );
        if (array.getElement(j).value > array.getElement(j + 1).value) {
          array.swap(j, j + 1);
          array.state.elements.forEach((element, index) => {
            element.color =
              index > array.state.elements.length - i - 1
                ? ElementColors.SORTED
                : index === j + 1
                ? ElementColors.ACTIVE_2
                : index === j
                ? ElementColors.ACTIVE_1
                : index > j
                ? ElementColors.UNSORTED
                : ElementColors.ACTIVE_SECTION;
          });
          swapped = true;
        }
      }
      if (!swapped) break;
    }
    array.addCompleteState();
  }
}
