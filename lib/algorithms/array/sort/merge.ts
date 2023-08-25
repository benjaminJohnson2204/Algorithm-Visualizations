import { MyArray, ElementColors, ArrayState } from '..';
import { ArraySort } from '.';

export class MergeSort extends ArraySort {
  recursiveHelper(start: number, end: number) {
    if (start >= end - 1) return;

    const mid = Math.floor((start + end) / 2);
    this.recursiveHelper(start, mid);
    this.recursiveHelper(mid, end);

    const array = this.dataStructure as MyArray;

    let leftPointer = start,
      rightPointer = mid;
    array.cloneStateNewColors((element, index) =>
      start <= index && index < end
        ? index === leftPointer
          ? ElementColors.ACTIVE_1
          : index === rightPointer
          ? ElementColors.ACTIVE_2
          : ElementColors.ACTIVE_SECTION
        : ElementColors.UNSORTED
    );

    while (leftPointer < mid || rightPointer < end) {
      if (
        rightPointer >= end ||
        (leftPointer < mid &&
          array.getElement(leftPointer).value <=
            array.getElement(rightPointer).value)
      ) {
        array.state.auxilary?.elements.push(array.getElement(leftPointer));
        leftPointer++;
      } else {
        array.state.auxilary?.elements.push(array.getElement(rightPointer));
        rightPointer++;
      }

      array.cloneStateNewColors(
        (element, index) =>
          start <= index && index < end
            ? index === leftPointer && index < mid
              ? ElementColors.ACTIVE_1
              : index === rightPointer
              ? ElementColors.ACTIVE_2
              : ElementColors.ACTIVE_SECTION
            : ElementColors.UNSORTED,
        undefined,
        {
          startIndex: start,
          elements: [...(array.state.auxilary?.elements ?? [])],
        }
      );
    }

    const newState = new ArrayState(
      array.state.elements.map((element, index) => {
        if (index < start || index >= end) {
          return element.clone();
        }
        const newElement =
          array.state.auxilary!.elements[index - start].clone();
        if (index < start || index >= end) {
          return newElement;
        }
        newElement.color =
          start === 0 && end === array.state.elements.length
            ? ElementColors.SORTED
            : ElementColors.UNSORTED;
        return newElement;
      })
    );
    array.addState(newState);
  }

  run() {
    this.recursiveHelper(
      0,
      (this.dataStructure as MyArray).state.elements.length
    );
  }
}
