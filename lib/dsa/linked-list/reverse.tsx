export class NodeColors {
  static DEFAULT = "white";
  static ACTIVE_1 = "green";
  static ACTIVE_2 = "blue";
}

export interface ListNode {
  key: number;
  value: number;
  nextKey: number;
}

export interface State {
  list: ListNode[];
  colors?: string[];
}

const minNumVal = 1,
  maxNumVal = 10;

export const getRandomList = (length: number) => {
  const initiaList: ListNode[] = [];
  for (let i = 0; i < length; i++) {
    initiaList.push({
      key: i,
      value: minNumVal + Math.floor(Math.random() * (maxNumVal - minNumVal)),
      nextKey: i === length - 1 ? -1 : i + 1,
    });
  }
  return initiaList;
};

export const reverseLinkedList = (list: ListNode[]) => {
  if (list.length <= 1) return [];
  const states = [];
  let originalHead = { ...list[0] };
  let nextIndex = list[0].nextKey;
  while (originalHead.nextKey !== -1) {
    list = list.map((node) => ({
      ...node,
      nextKey:
        node.key === originalHead.key ? list[nextIndex].nextKey : node.nextKey,
    }));
    originalHead.nextKey = list[nextIndex].nextKey;
    states.push({
      list: list.map((node) => ({ ...node })),
      colors: list.map((node, index) =>
        index === nextIndex
          ? NodeColors.ACTIVE_1
          : index === 0
          ? NodeColors.ACTIVE_2
          : NodeColors.DEFAULT
      ),
    });

    list[nextIndex].nextKey = list[0].key;
    states.push({
      list: list.map((node) => ({ ...node })),
      colors: list.map((node, index) =>
        index === nextIndex
          ? NodeColors.ACTIVE_1
          : index === 0
          ? NodeColors.ACTIVE_2
          : NodeColors.DEFAULT
      ),
    });

    list.splice(0, 0, list[nextIndex]);
    list.splice(nextIndex + 1, 1);
    states.push({
      list: list.map((node) => ({ ...node })),
      colors: list.map((node, index) =>
        index === nextIndex
          ? NodeColors.ACTIVE_1
          : index === 0
          ? NodeColors.ACTIVE_2
          : NodeColors.DEFAULT
      ),
    });

    for (let j = 0; j < list.length; j++) {
      if (list[j].key === originalHead.nextKey) {
        nextIndex = j;
      }
    }
  }
  return states;
};
