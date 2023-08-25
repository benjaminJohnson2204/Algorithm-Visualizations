import {
  AlgorithmStep,
  DataStructure,
  DataStructureState,
  MyAlgorithm,
} from 'lib/dataStructure';

export enum NodeColors {
  DEFAULT = 'white',
  ACTIVE_1 = 'red',
  ACTIVE_2 = 'yellow',
  INTERSECTION = 'orange',
}

const MIN_LIST_VAL = 1,
  MAX_LIST_VAL = 10;

export const getRandomList = (
  length: number,
  canCycle: boolean | undefined
) => {
  const initiaList: ListNode[] = [];
  for (let i = 0; i < length; i++) {
    initiaList.push(
      new ListNode(
        i,
        MIN_LIST_VAL +
          Math.floor(Math.random() * (MAX_LIST_VAL - MIN_LIST_VAL)),

        i === length - 1
          ? canCycle && Math.random() > 0.25
            ? Math.floor(Math.random() * length)
            : -1
          : i + 1
      )
    );
  }
  return initiaList;
};

export const getRandomExtraParams = (
  list: ListNode[],
  numExtraParams: number | undefined
) => {
  const result: number[] = [];
  if (!numExtraParams) return result;
  for (let i = 0; i < numExtraParams; i++) {
    result.push(Math.floor(Math.random() * (list.length - 1) + 1));
  }
  return result;
};

export type ListColorGenerator = (element: ListNode, index: number) => string;

export class ListNode {
  key: number;
  value: number;
  nextKey: number;
  color: string;

  constructor(key: number, value: number, nextKey: number, color?: string) {
    this.key = key;
    this.value = value;
    this.nextKey = nextKey;
    this.color = color ?? NodeColors.DEFAULT;
  }

  clone() {
    return new ListNode(this.key, this.value, this.nextKey, this.color);
  }
}

export class LinkedListState implements DataStructureState {
  nodes: ListNode[];
  message?: string;

  constructor(nodes: ListNode[], message?: string) {
    this.nodes = nodes.map((node) => node.clone());
    this.message = message;
  }

  clone() {
    return new LinkedListState(this.nodes, this.message);
  }
}

export class LinkedList implements DataStructure {
  state: LinkedListState;
  stateHistory: DataStructureState[];

  constructor(nodes?: ListNode[]) {
    this.state = new LinkedListState(nodes ?? []);
    this.stateHistory = [this.state];
  }

  addState(newState: DataStructureState) {
    this.stateHistory.push(newState);
    this.state = newState as LinkedListState;
  }

  cloneStateNewColors(colorGenerator: ListColorGenerator) {
    this.addState(
      new LinkedListState(
        this.state.nodes.map((element, index) => {
          const newElement = element.clone();
          newElement.color = colorGenerator(element, index);
          return newElement;
        })
      )
    );
  }
}

export class LinkedListAlgorithm implements MyAlgorithm {
  dataStructure: DataStructure;

  constructor(nodes?: ListNode[], ...extra: any[]) {
    this.dataStructure = new LinkedList(nodes);
  }

  run() {}

  getStateHistory() {
    return (this.dataStructure as LinkedList).stateHistory;
  }
}
