import { LinkedList, LinkedListAlgorithm, NodeColors } from '.';

export class DetectLinkedListCycleAlgorithm extends LinkedListAlgorithm {
  updateColors(fastKey: number, slowKey: number) {
    (this.dataStructure as LinkedList).cloneStateNewColors((element, index) =>
      index === slowKey
        ? index === fastKey
          ? NodeColors.INTERSECTION
          : NodeColors.ACTIVE_1
        : index === fastKey
        ? NodeColors.ACTIVE_2
        : NodeColors.DEFAULT
    );
  }

  run() {
    const list = this.dataStructure as LinkedList;
    if (list.state.nodes.length <= 1) return;
    let fastKey = 0,
      slowKey = 0;
    // Have a fast pointer walk through the list 2 nodes at a time, and a
    // slow pointer walk through 1 node at a time. If slow pointer ever catches up,
    // there is a cycle
    while (fastKey != -1) {
      // Step fast pointer 1 node ahead
      fastKey = list.state.nodes[fastKey].nextKey;

      this.updateColors(fastKey, slowKey);

      // Step fast and slow pointers ahead 1 node each
      fastKey = list.state.nodes[fastKey].nextKey;
      slowKey = list.state.nodes[slowKey].nextKey;
      this.updateColors(fastKey, slowKey);
      this.updateColors(fastKey, slowKey);

      // Check if slow pointer caught up and terminate if so (message: cycle)
      if (fastKey === slowKey) {
        this.updateColors(fastKey, slowKey);
        list.state.message = 'Fast pointer caught up: cycle detected';
        return;
      }

      // Check if fast pointer reached end and terminate if so
      if (fastKey === -1 || list.state.nodes[fastKey].nextKey === -1) {
        break;
      }
    }

    // Final message (no cycle)
    this.updateColors(fastKey, slowKey);
    list.state.message = 'Fast pointer reached end: no cycle detected';
  }
}
