import LinkedList from '@/components/LinkedList';
import { ListNode } from 'lib/algorithms/linkedList';
import { RemoveNthFromEndLinkedListAlgorithm } from 'lib/algorithms/linkedList/removeNthFromEnd';
import { NextPage } from 'next';

const RemoveNthFromEnd: NextPage = () => {
  return (
    <LinkedList
      title={'Remove Nth Node from End of Linked List'}
      numExtraParams={1}
      algoirthmGenerator={(nodes: ListNode[], ...extraParams) =>
        new RemoveNthFromEndLinkedListAlgorithm(nodes, extraParams[0])
      }
      cleanup={false}
    />
  );
};

export default RemoveNthFromEnd;
