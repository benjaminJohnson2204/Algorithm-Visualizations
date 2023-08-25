import InputControls from '@/components/contols/InputControls';
import SpeedControls from '@/components/contols/SpeedControls';
import { getRandomArrayElements } from 'lib/algorithms/array';
import { ArraySort } from 'lib/algorithms/array/sort';
import { BubbleSort } from 'lib/algorithms/array/sort/bubble';
import { InsertionSort } from 'lib/algorithms/array/sort/insertion';
import { MergeSort } from 'lib/algorithms/array/sort/merge';
import { QuickSort } from 'lib/algorithms/array/sort/quick';
import { SelectionSort } from 'lib/algorithms/array/sort/selection';
import { ArrayAnimator } from 'lib/animators';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

const ARRAY_SORT_ROOT_CLASS = '.bars';

const ArraySortPage = () => {
  const [arrayElements, setArrayElements] = useState(getRandomArrayElements(5));
  const [transitionDuration, setTransitionDuration] = useState(100);
  const [sortingType, setSortingType] = useState('merge');
  const [sorting, setSorting] = useState(false);

  let algorithm;
  let animator;

  useEffect(() => {
    algorithm = new ArraySort(arrayElements);
    animator = new ArrayAnimator(
      algorithm,
      ARRAY_SORT_ROOT_CLASS,
      transitionDuration
    );
    animator.clear();
    animator.renderInitial();
  }, [arrayElements]);

  const getSortingAlgorithm = () => {
    switch (sortingType) {
      case 'merge':
        return new MergeSort(arrayElements);
      case 'selection':
        return new SelectionSort(arrayElements);
      case 'insertion':
        return new InsertionSort(arrayElements);
      case 'bubble':
        return new BubbleSort(arrayElements);
      case 'quick':
        return new QuickSort(arrayElements);
    }
  };

  useEffect(() => {
    if (sorting) {
      algorithm = getSortingAlgorithm()!;
      animator = new ArrayAnimator(
        algorithm,
        ARRAY_SORT_ROOT_CLASS,
        transitionDuration
      );
      animator.run();
    }
  }, [sorting]);

  return (
    <div className='page'>
      <h1 className='m-3'>Array Sorting</h1>
      <Container>
        <Row>
          <Col xs={12} md={4}>
            <SpeedControls setTransitionDuration={setTransitionDuration} />
          </Col>
          <Col xs={12} md={4}>
            <Form>
              <Form.Group>
                <Form.Label>Choose algorithm</Form.Label>
                <Form.Select
                  disabled={sorting}
                  onChange={(event: React.ChangeEvent<any>) =>
                    setSortingType(event.target.value)
                  }
                  defaultValue='merge'
                >
                  <option value='merge'>Merge Sort</option>
                  <option value='quick'>Quick Sort</option>
                  <option value='insertion'>Insertion Sort</option>
                  <option value='selection'>Selection Sort</option>
                  <option value='bubble'>Bubble Sort</option>
                </Form.Select>
              </Form.Group>
              <Button
                className='m-3'
                onClick={() => setSorting((prevSorting) => !prevSorting)}
              >
                {sorting ? 'Pause' : 'Start'}
              </Button>
            </Form>
          </Col>
          <Col xs={12} md={4}>
            <InputControls
              defaultInput={arrayElements
                .map((element) => element.value)
                .toString()}
              maxLength={200}
              setCustomInput={(input) => {
                try {
                  setArrayElements(
                    eval(input).map((num: number, index: number) => ({
                      key: index,
                      value: num,
                    }))
                  );
                } catch (error) {}
              }}
              setRandomInput={(length) =>
                setArrayElements(getRandomArrayElements(length))
              }
            />
          </Col>
        </Row>
      </Container>
      <svg
        style={{
          height: '100%',
          width: '100%',
          marginRight: '0px',
          marginLeft: '0px',
        }}
      >
        <g className='bars' />
      </svg>
    </div>
  );
};

export default ArraySortPage;
