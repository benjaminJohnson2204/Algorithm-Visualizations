import InputControls from "@/components/contols/InputControls";
import SpeedControls from "@/components/contols/SpeedControls";
import LinkedList from "@/components/LinkedList";
import { reverseLinkedList } from "lib/dsa/linked-list";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

const Reverse: NextPage = () => {
  return (
    <LinkedList
      title={"Reverse a Linked List"}
      algorithm={reverseLinkedList}
      cleanup={true}
    />
  );
};

export default Reverse;
