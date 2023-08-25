import {
  LinkedList,
  LinkedListAlgorithm,
  LinkedListState,
  ListNode,
  NodeColors,
} from '.';

export class ReverseLinkedListAlgorithm extends LinkedListAlgorithm {
  run() {
    const list = this.dataStructure as LinkedList;
    if (list.state.nodes.length <= 1) return;
    let originalHead = list.state.nodes[0].clone();
    let nextIndex = originalHead.nextKey;

    // Loop over all nodes in list, moving each to beginning of list
    while (originalHead.nextKey != -1) {
      list.addState(
        new LinkedListState(
          list.state.nodes.map(
            (node) =>
              new ListNode(
                node.key,
                node.value,
                node.key === originalHead.key
                  ? list.state.nodes[nextIndex].nextKey
                  : node.nextKey,
                node.color
              )
          )
        )
      );
      // Update original head's next to point to nextIndex node's next
      originalHead.nextKey = list.state.nodes[nextIndex].nextKey;
      list.state.nodes.forEach((node, index) => {
        node.color =
          index === nextIndex
            ? NodeColors.ACTIVE_1
            : index === 0
            ? NodeColors.ACTIVE_2
            : NodeColors.DEFAULT;
      });

      // Update nextIndex node's next to point to new first node (inserting it at beginning)
      list.state.nodes[nextIndex].nextKey = list.state.nodes[0].key;
      list.cloneStateNewColors((element, index) =>
        index === nextIndex
          ? NodeColors.ACTIVE_1
          : index === 0
          ? NodeColors.ACTIVE_2
          : NodeColors.DEFAULT
      );

      // Remove first node, replace with node at nextIndex
      list.state.nodes.splice(0, 0, list.state.nodes[nextIndex]);
      // Remove node at next index
      list.state.nodes.splice(nextIndex + 1, 1);

      list.cloneStateNewColors((element, index) =>
        index === nextIndex
          ? NodeColors.ACTIVE_1
          : index === 0
          ? NodeColors.ACTIVE_2
          : NodeColors.DEFAULT
      );

      // Update nextIndex to next after the original head)=
      for (let j = 0; j < list.state.nodes.length; j++) {
        if (list.state.nodes[j].key === originalHead.nextKey) {
          nextIndex = j;
        }
      }
    }
  }
}
