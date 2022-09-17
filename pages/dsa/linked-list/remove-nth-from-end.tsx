import LinkedList from "@/components/LinkedList";
import { removeNthFromEnd } from "lib/dsa/linked-list";
import { NextPage } from "next";

const RemoveNthFromEnd: NextPage = () => {
  return (
    <LinkedList
      title={"Remove Nth Node from End of Linked List"}
      numExtraParams={1}
      algorithm={removeNthFromEnd}
      cleanup={false}
    />
  );
};

export default RemoveNthFromEnd;

