import LinkedList from "@/components/LinkedList";
import { listHasCycle } from "lib/dsa/linked-list";
import { NextPage } from "next";

const DetectCycle: NextPage = () => {
  return (
    <LinkedList
      title={"Detect a Cycle in a Linked List"}
      algorithm={listHasCycle}
      canCycle={true}
      cleanup={false}
    />
  );
};

export default DetectCycle;

