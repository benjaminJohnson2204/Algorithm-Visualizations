import { MyArray, ElementColors, ArrayState } from '..';
import { ArraySort } from '.';

export class InsertionSort extends ArraySort {
  run() {
    const array = this.dataStructure as MyArray;
    for (let i = 1; i < array.state.elements.length; i++) {
      array.cloneStateNewColors(
        (element, index) =>
          index === i
            ? ElementColors.ACTIVE_1
            : index < i
            ? ElementColors.ACTIVE_SECTION
            : ElementColors.UNSORTED,
        array.getElement(i).key
      );
      let j = i - 1;
      while (
        j >= 0 &&
        array.getElement(j).value > array.getElement(j + 1).value
      ) {
        array.swap(j, j + 1);
        array.state.elements.forEach((element, index) => {
          element.color =
            index === j
              ? ElementColors.ACTIVE_1
              : index === j + 1
              ? ElementColors.ACTIVE_2
              : index <= i
              ? ElementColors.ACTIVE_SECTION
              : ElementColors.UNSORTED;
        });
        array.state.aside = array.getElement(j).key;
        j--;
      }
    }
    array.addCompleteState();
  }
}
