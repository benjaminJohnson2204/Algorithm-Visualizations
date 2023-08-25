import { NextPage } from 'next';
import Link from 'next/link';
import { Col, Row } from 'react-bootstrap';

const LinkedLists: NextPage = () => {
  return (
    <Col>
      <h1 className='m-5'>Linked Lists</h1>
      <h3>Available Algorithms</h3>
      <Row>
        <Link className='m-2' href='/dsa/linked-list/detect-cycle'>
          Detect Cycle in Linked List
        </Link>
      </Row>
      <Row>
        <Link className='m-2' href='/dsa/linked-list/reverse'>
          Reverse a Linked List
        </Link>
      </Row>
      <Row>
        <Link className='m-2' href='/dsa/linked-list/remove-nth-from-end'>
          Remove Nth Node from End
        </Link>
      </Row>
    </Col>
  );
};

export default LinkedLists;
