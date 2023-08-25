import {
  LinkedList,
  LinkedListAlgorithm,
  LinkedListState,
  ListNode,
  NodeColors,
} from '.';

export class RemoveNthFromEndLinkedListAlgorithm extends LinkedListAlgorithm {
  n: number;

  constructor(nodes: ListNode[], n: number) {
    super(nodes);
    this.n = n;
  }

  updateColors(startIndex: number, key1: number, key2: number) {
    const list = this.dataStructure as LinkedList;
    list.addState(
      new LinkedListState(
        list.state.nodes.slice(startIndex).map((element, index) => {
          const newElement = element.clone();
          newElement.color =
            index === key1
              ? index === key2
                ? NodeColors.INTERSECTION
                : NodeColors.ACTIVE_1
              : index === key2
              ? NodeColors.ACTIVE_2
              : NodeColors.DEFAULT;
          return newElement;
        }),
        list.state.message
      )
    );
  }

  run() {
    const list = this.dataStructure as LinkedList;
    if (this.n > list.state.nodes.length) return;
    let key1 = 0,
      key2 = 0;

    for (let i = 0; i < this.n; i++) {
      this.updateColors(0, key1, key2);
      key2 = list.state.nodes[key2].nextKey;
    }

    if (key2 === -1) {
      this.updateColors(1, key1, key2);
      return;
    }

    while (list.state.nodes[key2].nextKey !== -1) {
      this.updateColors(0, key1, key2);
      key2 = list.state.nodes[key2].nextKey;
      key1 = list.state.nodes[key1].nextKey;
    }
    this.updateColors(0, key1, key2);

    if (key1 === 0) {
      this.updateColors(1, key1, key2);
      return;
    }

    const nthKey = list.state.nodes[key1].nextKey;
    list.state.nodes[key1].nextKey = list.state.nodes[nthKey].nextKey;
    this.updateColors(0, key1, key2);

    list.state.nodes[nthKey].nextKey = -1;
    this.updateColors(0, key1, key2);
  }
}
