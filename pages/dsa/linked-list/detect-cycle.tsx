import LinkedList from '@/components/LinkedList';
import { DetectLinkedListCycleAlgorithm } from 'lib/algorithms/linkedList/detectCycle';
import { NextPage } from 'next';

const DetectCycle: NextPage = () => {
  return (
    <LinkedList
      title={'Detect a Cycle in a Linked List'}
      algoirthmGenerator={(list) => new DetectLinkedListCycleAlgorithm(list)}
      canCycle={true}
      cleanup={false}
    />
  );
};

export default DetectCycle;
