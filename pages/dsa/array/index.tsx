import type { NextPage } from 'next';
import Link from 'next/link';
import { Col, Row } from 'react-bootstrap';

const Arrays: NextPage = () => {
  return (
    <Col>
      <h1 className='m-5'>Arrays</h1>
      <h3>Available Algorithms</h3>
      <Row>
        <Link className='m-2' href='/dsa/array/sort'>
          Sort an Array
        </Link>
      </Row>
    </Col>
  );
};

export default Arrays;
