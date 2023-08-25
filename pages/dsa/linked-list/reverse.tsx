import InputControls from '@/components/contols/InputControls';
import SpeedControls from '@/components/contols/SpeedControls';
import LinkedList from '@/components/LinkedList';
import { ReverseLinkedListAlgorithm } from 'lib/algorithms/linkedList/reverse';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';

const Reverse: NextPage = () => {
  return (
    <LinkedList
      title={'Reverse a Linked List'}
      algoirthmGenerator={(list) => new ReverseLinkedListAlgorithm(list)}
      cleanup={true}
    />
  );
};

export default Reverse;
