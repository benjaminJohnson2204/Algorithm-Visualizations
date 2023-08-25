import { MyArray, ElementColors, ArrayState } from '..';
import { ArraySort } from '.';

export class QuickSort extends ArraySort {
  recursiveHelper(start: number, end: number) {
    if (start >= end - 1) return;
    const array = this.dataStructure as MyArray;
    let i = start;
    let partition = end - 1;
    for (let j = start; j < partition; j++) {
      array.cloneStateNewColors((element, index) =>
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
      );
      if (array.getElement(j).value < array.getElement(partition).value) {
        array.swap(i, j);
        array.state.elements.forEach((element, index) => {
          element.color =
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
              : ElementColors.UNSORTED;
        });
        i++;
      }
    }
    array.swap(i, partition);
    array.state.elements.forEach((element, index) => {
      element.color =
        index === partition
          ? ElementColors.ACTIVE_1
          : index === i
          ? ElementColors.ACTIVE_2
          : index < start
          ? ElementColors.SORTED
          : index < end
          ? ElementColors.ACTIVE_SECTION
          : ElementColors.UNSORTED;
    });
    this.recursiveHelper(start, i);
    this.recursiveHelper(i + 1, end);
  }

  run() {
    const array = this.dataStructure as MyArray;
    this.recursiveHelper(0, array.state.elements.length);
    array.addCompleteState();
  }
}
