import { MyAlgorithm, DataStructure } from 'lib/dataStructure';
import { MyArray, ArrayElement } from '..';

export class ArraySort implements MyAlgorithm {
  dataStructure: DataStructure;

  constructor(elements?: ArrayElement[]) {
    this.dataStructure = new MyArray(elements);
  }

  run() {}

  getStateHistory() {
    return (this.dataStructure as MyArray).stateHistory;
  }
}
