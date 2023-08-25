import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div>
      <h1 className='m-5'>Algorithm Visualizations</h1>
      <p>
        This is a tool I created to visualize various Data Structures and
        Algorithms. Select a category below to see available visualizations!
      </p>
      <p>
        <Link className='m-2' href='/dsa/array'>
          Arrays
        </Link>
      </p>
      <p>
        <Link className='m-2' href='/dsa/linked-list'>
          Linked Lists
        </Link>
      </p>
    </div>
  );
};

export default Home;
