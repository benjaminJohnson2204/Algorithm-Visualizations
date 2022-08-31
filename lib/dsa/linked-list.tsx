export class NodeColors {
  static DEFAULT = "white";
  static ACTIVE_1 = "red";
  static ACTIVE_2 = "yellow";
  static INTERSECTION = "orange";
}

export interface ListNode {
  key: number;
  value: number;
  nextKey: number;
}

export interface State {
  list: ListNode[];
  colors?: string[];
  message?: string;
}

const minNumVal = 1,
  maxNumVal = 10;

export const getRandomList = (
  length: number,
  canCycle: boolean | undefined
) => {
  const initiaList: ListNode[] = [];
  for (let i = 0; i < length; i++) {
    initiaList.push({
      key: i,
      value: minNumVal + Math.floor(Math.random() * (maxNumVal - minNumVal)),
      nextKey:
        i === length - 1
          ? canCycle && Math.random() > 0.25
            ? Math.floor(Math.random() * length)
            : -1
          : i + 1,
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

export const listHasCycle = (list: ListNode[]) => {
  if (list.length <= 1) return [];
  const states = [];
  let fastKey = 0,
    slowKey = 0;
  while (fastKey !== -1) {
    fastKey = list[fastKey].nextKey;
    states.push({
      list: list,
      colors: list.map((element, index) =>
        index === slowKey
          ? index === fastKey
            ? NodeColors.INTERSECTION
            : NodeColors.ACTIVE_1
          : index === fastKey
          ? NodeColors.ACTIVE_2
          : NodeColors.DEFAULT
      ),
    });

    fastKey = list[fastKey].nextKey;
    slowKey = list[slowKey].nextKey;
    states.push({
      list: list,
      colors: list.map((element, index) =>
        index === slowKey
          ? index === fastKey
            ? NodeColors.INTERSECTION
            : NodeColors.ACTIVE_1
          : index === fastKey
          ? NodeColors.ACTIVE_2
          : NodeColors.DEFAULT
      ),
    });
    states.push({
      list: list,
      colors: list.map((element, index) =>
        index === slowKey
          ? index === fastKey
            ? NodeColors.INTERSECTION
            : NodeColors.ACTIVE_1
          : index === fastKey
          ? NodeColors.ACTIVE_2
          : NodeColors.DEFAULT
      ),
    });
    if (fastKey === slowKey) {
      states.push({
        list: list,
        colors: list.map((element, index) =>
          index === slowKey
            ? index === fastKey
              ? NodeColors.INTERSECTION
              : NodeColors.ACTIVE_1
            : index === fastKey
            ? NodeColors.ACTIVE_2
            : NodeColors.DEFAULT
        ),
        message: "Fast pointer caught up: cycle detected",
      });
      return states;
    }
    if (fastKey === -1 || list[fastKey].nextKey === -1) break;
  }
  states.push({
    list: list,
    colors: list.map((element, index) =>
      index === slowKey
        ? index === fastKey
          ? NodeColors.INTERSECTION
          : NodeColors.ACTIVE_1
        : index === fastKey
        ? NodeColors.ACTIVE_2
        : NodeColors.DEFAULT
    ),
    message: "Fast pointer reached end: no cycle detected",
  });
  return states;
};
