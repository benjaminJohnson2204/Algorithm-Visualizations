import type { NextPage } from "next";
import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";

import * as d3 from "d3";

class ElementColors {
  static UNSORTED = "cyan";
  static SORTED = "blue";
  static ACTIVE_1 = "red";
  static ACTIVE_2 = "green";
  static ACTIVE_3 = "orange";
  static ACTIVE_SECTION = "purple";
}

interface ArrayElement {
  key: number;
  value: number;
}

interface Auxilary {
  startIndex: number;
  elements: ArrayElement[];
}

// State of array at a given step
interface State {
  nums: ArrayElement[];
  colors?: string[];
  aside?: number;
  auxilary?: Auxilary;
}

const minArrayLength = 2,
  maxArrayLength = 20,
  minNumVal = 1,
  maxNumVal = 10;

let paused = false,
  steps: State[] = [],
  curStepIndex = 0;

const Sort: NextPage = () => {
  const margin = { top: 20, right: 100, bottom: 30, left: 100 };
  const [sortingType, setSortingType] = useState("merge");
  const [sorting, setSorting] = useState(false);

  const [transitionDuration, setTransitionDuration] = useState(0);

  const [array, setArray] = useState(() => {
    const initialArray: ArrayElement[] = [];
    for (
      let i = 0;
      i <
      minArrayLength +
        Math.floor(Math.random() * (maxArrayLength - minArrayLength));
      i++
    ) {
      initialArray.push({
        key: i,
        value: minNumVal + Math.floor(Math.random() * (maxNumVal - minNumVal)),
      });
    }
    return initialArray;
  });

  const getXScale = (width: number) =>
    d3
      .scaleBand()
      .domain(array.map((num, index) => index.toString()))
      .rangeRound([margin.left, width - margin.left])
      .padding(0.1);

  const getYScale = (height: number) =>
    d3
      .scaleLinear()
      .domain([0, d3.max(array, (d) => d.value)!])
      .range([height / 2 - margin.bottom, margin.top]);

  useEffect(() => {
    d3.select(".bars")
      .attr("fill", ElementColors.UNSORTED)
      .selectAll(".bar")
      .data(array)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr(
        "x",
        (d: ArrayElement, i: number) =>
          getXScale(window.innerWidth)(i.toString())!
      )
      .attr("width", (d: ArrayElement, i: number) =>
        getXScale(window.innerWidth).bandwidth()
      )
      .attr("y", (d: ArrayElement) => getYScale(window.innerHeight)(d.value))
      .attr(
        "height",
        (d: ArrayElement) =>
          getYScale(window.innerHeight)(0) -
          getYScale(window.innerHeight)(d.value)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sorting) {
      paused = false;
      if (steps.length === 0) {
        switch (sortingType) {
          case "merge":
            steps = mergeSort();
            break;
          case "quick":
            steps = quickSort();
            break;
          case "bubble":
            steps = bubbleSort();
            break;
          case "insertion":
            steps = insertionSort();
            break;
          case "selection":
            steps = selectionSort();
            break;
        }
      }
      curStepIndex = 0;
      runSortingStep();
    } else {
      paused = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  const runSortingStep = async () => {
    const state = steps[curStepIndex];
    const newTransition = d3
      .transition()
      .duration(transitionDuration)
      .ease(d3.easeLinear);
    d3.select("g")
      .selectAll("rect")
      .transition(newTransition)
      .attr("x", (d: any, index: number) => {
        if (state.auxilary) {
          for (
            let newIndex = 0;
            newIndex < state.auxilary.elements.length;
            newIndex++
          ) {
            if (state.auxilary.elements[newIndex].key === index) {
              return getXScale(window.innerWidth)(
                (newIndex + state.auxilary.startIndex).toString()!
              )!;
            }
          }
        }

        for (let newIndex = 0; newIndex < state.nums.length; newIndex++) {
          if (state.nums[newIndex].key === index) {
            return getXScale(window.innerWidth)(newIndex.toString())!;
          }
        }

        return getXScale(window.innerWidth)("0")!;
      })
      .attr("y", (d: any, index: number) => {
        if (state.auxilary) {
          for (
            let newIndex = 0;
            newIndex < state.auxilary.elements.length;
            newIndex++
          ) {
            if (state.auxilary.elements[newIndex].key === index) {
              return getYScale(window.innerHeight)(0) + 25;
            }
          }
        }
        return state.aside === index
          ? getYScale(window.innerHeight)(0) + 25
          : getYScale(window.innerHeight)(d.value);
      })
      .style("fill", (d: any, index: number) => {
        for (let newIndex = 0; newIndex < state.nums.length; newIndex++) {
          if (state.nums[newIndex].key === index) {
            return state.colors
              ? state.colors[newIndex]
              : ElementColors.UNSORTED;
          }
        }
        return ElementColors.UNSORTED;
      });
    await newTransition.end();
    curStepIndex++;
    if (curStepIndex >= steps.length) {
      steps = [];
      return;
    }
    if (!paused) runSortingStep();
  };

  const mergeSort = (
    start = 0,
    end = array.length,
    newArray = [...array]
  ): State[] => {
    if (start >= end - 1) return [];
    const mid = Math.floor((start + end) / 2);
    const sortedLeft = mergeSort(start, mid, newArray);
    const sortedRight = mergeSort(mid, end, newArray);
    const states: State[] = sortedLeft.concat(sortedRight);
    const auxilaryElements: ArrayElement[] = [];
    let leftPointer = start,
      rightPointer = mid;
    states.push({
      nums: [...newArray],
      colors: newArray.map((element, index) =>
        start <= index && index < end
          ? index === leftPointer
            ? ElementColors.ACTIVE_1
            : index === rightPointer
            ? ElementColors.ACTIVE_2
            : ElementColors.ACTIVE_SECTION
          : ElementColors.UNSORTED
      ),
    });
    while (leftPointer < mid || rightPointer < end) {
      if (
        rightPointer >= end ||
        (leftPointer < mid &&
          newArray[leftPointer].value <= newArray[rightPointer].value)
      ) {
        auxilaryElements.push(newArray[leftPointer]);
        leftPointer++;
      } else {
        auxilaryElements.push(newArray[rightPointer]);
        rightPointer++;
      }
      states.push({
        nums: [...newArray],
        auxilary: { startIndex: start, elements: [...auxilaryElements] },
        colors: newArray.map((element, index) =>
          start <= index && index < end
            ? index === leftPointer && index < mid
              ? ElementColors.ACTIVE_1
              : index === rightPointer
              ? ElementColors.ACTIVE_2
              : ElementColors.ACTIVE_SECTION
            : ElementColors.UNSORTED
        ),
      });
    }
    for (let i = start; i < end; i++) {
      newArray[i] = auxilaryElements[i - start];
    }
    states.push({
      nums: [...newArray],
      colors:
        start === 0 && end === newArray.length
          ? newArray.map((element) => ElementColors.SORTED)
          : newArray.map((element) => ElementColors.UNSORTED),
    });
    return states;
  };

  const quickSort = (
    start = 0,
    end = array.length,
    newArray = [...array]
  ): State[] => {
    if (start >= end - 1) return [];
    const states: State[] = [];
    let i = start;
    let partition = end - 1;
    for (let j = start; j < partition; j++) {
      states.push({
        nums: [...newArray],
        colors: newArray.map((element, index) =>
          index === partition
            ? ElementColors.ACTIVE_2
            : index === i
            ? ElementColors.ACTIVE_3
            : index === j
            ? ElementColors.ACTIVE_1
            : index < start
            ? ElementColors.SORTED
            : index < end
            ? ElementColors.ACTIVE_SECTION
            : ElementColors.UNSORTED
        ),
      });
      if (newArray[j].value < newArray[partition].value) {
        swap(newArray, i, j);
        states.push({
          nums: [...newArray],
          colors: newArray.map((element, index) =>
            index === partition
              ? ElementColors.ACTIVE_2
              : index === i
              ? ElementColors.ACTIVE_1
              : index === j
              ? ElementColors.ACTIVE_3
              : index < start
              ? ElementColors.SORTED
              : index < end
              ? ElementColors.ACTIVE_SECTION
              : ElementColors.UNSORTED
          ),
        });
        i += 1;
      }
    }
    swap(newArray, i, partition);
    states.push({
      nums: [...newArray],
      colors: newArray.map((element, index) =>
        index === partition
          ? ElementColors.ACTIVE_1
          : index === i
          ? ElementColors.ACTIVE_2
          : index < start
          ? ElementColors.SORTED
          : index < end
          ? ElementColors.ACTIVE_SECTION
          : ElementColors.UNSORTED
      ),
    });
    return states
      .concat(quickSort(start, i, newArray))
      .concat(quickSort(i + 1, end, newArray))
      .concat(
        start === 0 && end === newArray.length
          ? [
              {
                nums: [...newArray],
                colors: newArray.map((element, index) => ElementColors.SORTED),
              },
            ]
          : []
      );
  };

  const bubbleSort = () => {
    const newArray = [...array];
    const states: State[] = [];

    for (let i = 0; i < newArray.length; i++) {
      let swapped = false;
      for (let j = 0; j < newArray.length - i - 1; j++) {
        states.push({
          nums: [...newArray],
          colors: newArray.map((element, index) =>
            index > newArray.length - i - 1
              ? ElementColors.SORTED
              : index === j + 1
              ? ElementColors.ACTIVE_1
              : index === j
              ? ElementColors.ACTIVE_2
              : index > j
              ? ElementColors.UNSORTED
              : ElementColors.ACTIVE_SECTION
          ),
        });
        if (newArray[j].value > newArray[j + 1].value) {
          swap(newArray, j, j + 1);
          states.push({
            nums: [...newArray],
            colors: newArray.map((element, index) =>
              index > newArray.length - i - 1
                ? ElementColors.SORTED
                : index === j + 1
                ? ElementColors.ACTIVE_2
                : index === j
                ? ElementColors.ACTIVE_1
                : index > j
                ? ElementColors.UNSORTED
                : ElementColors.ACTIVE_SECTION
            ),
          });
          swapped = true;
        }
      }
      if (!swapped) break;
    }

    states.push({
      nums: [...newArray],
      colors: newArray.map((element) => ElementColors.SORTED),
    });
    return states;
  };

  const insertionSort = () => {
    const newArray = [...array];
    const states: State[] = [];
    for (let i = 1; i < newArray.length; i++) {
      states.push({
        nums: [...newArray],
        aside: newArray[i].key,
        colors: newArray.map((element, index) =>
          index === i
            ? ElementColors.ACTIVE_1
            : index < i
            ? ElementColors.ACTIVE_SECTION
            : ElementColors.UNSORTED
        ),
      });
      let j = i - 1;
      for (; j >= 0 && newArray[j].value > newArray[j + 1].value; j--) {
        swap(newArray, j, j + 1);
        states.push({
          nums: [...newArray],
          aside: newArray[j].key,
          colors: newArray.map((element, index) =>
            index === j
              ? ElementColors.ACTIVE_1
              : index === j + 1
              ? ElementColors.ACTIVE_2
              : index <= i
              ? ElementColors.ACTIVE_SECTION
              : ElementColors.UNSORTED
          ),
        });
      }
    }
    states.push({
      nums: [...newArray],
      colors: newArray.map((element) => ElementColors.SORTED),
    });
    return states;
  };

  const selectionSort = () => {
    const newArray = [...array];
    const states: State[] = [];
    for (let i = 0; i < newArray.length; i++) {
      let smallestIndex = i;
      for (let j = i; j < newArray.length; j++) {
        states.push({
          nums: [...newArray],
          colors: newArray.map((element, index) =>
            index === j
              ? ElementColors.ACTIVE_1
              : index === smallestIndex
              ? ElementColors.ACTIVE_2
              : index < i
              ? ElementColors.SORTED
              : index < j
              ? ElementColors.ACTIVE_SECTION
              : ElementColors.UNSORTED
          ),
        });
        if (newArray[j].value < newArray[smallestIndex].value) {
          smallestIndex = j;
        }
      }
      swap(newArray, i, smallestIndex);
      states.push({
        nums: [...newArray],
        colors: newArray.map((element, index) =>
          index === smallestIndex
            ? ElementColors.ACTIVE_2
            : index < i
            ? ElementColors.SORTED
            : ElementColors.ACTIVE_SECTION
        ),
      });
    }
    states.push({
      nums: [...newArray],
      colors: newArray.map((element) => ElementColors.SORTED),
    });
    return states;
  };

  const swap = (arr: ArrayElement[], i: number, j: number) => {
    const temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  };

  return (
    <div className="page">
      <h1>Array Sorting</h1>
      <Form>
        <Form.Group>
          <Form.Label>Choose algorithm</Form.Label>
          <Form.Select
            onChange={(event: React.ChangeEvent<any>) =>
              setSortingType(event.target.value)
            }
            defaultValue="merge"
          >
            <option value="merge">Merge Sort</option>
            <option value="quick">Quick Sort</option>
            <option value="insertion">Insertion Sort</option>
            <option value="selection">Selection Sort</option>
            <option value="bubble">Bubble Sort</option>
          </Form.Select>
        </Form.Group>
        <Button
          className="m-3"
          onClick={() => setSorting((prevSorting) => !prevSorting)}
        >
          {sorting ? "Pause" : "Start"}
        </Button>
      </Form>
      <svg
        style={{
          height: "100%",
          width: "100%",
          marginRight: "0px",
          marginLeft: "0px",
        }}
      >
        <g className="bars" />
      </svg>
    </div>
  );
};

export default Sort;
