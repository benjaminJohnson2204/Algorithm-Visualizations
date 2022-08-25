import type { NextPage } from "next";
import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";

import * as d3 from "d3";

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
  pivot?: number;
  cur?: number;
  aside?: number;
  auxilary?: Auxilary;
}

const minArrayLength = 2,
  maxArrayLength = 20,
  minNumVal = 1,
  maxNumVal = 10;

const Sort: NextPage = () => {
  const [sortingType, setSortingType] = useState("merge");
  const [sorting, setSorting] = useState(false);

  const [windowWidth, setWindowWidth] = useState<number>();
  const [windowHeight, setWindowHeight] = useState<number>();

  const [transitionDuration, setTransitionDuration] = useState(500);

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

  useEffect(() => {
    const height = window.innerHeight;
    const width = window.innerWidth;
    const margin = { top: 20, right: 100, bottom: 30, left: 100 };

    const xScale = d3
      .scaleBand()
      .domain(array.map((num, index) => index.toString()))
      .rangeRound([margin.left, width - margin.left])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(array, (d) => d.value)!])
      .range([height / 2 - margin.bottom, margin.top]);

    d3.select(".bars")
      .attr("fill", "blue")
      .selectAll(".bar")
      .data(array)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d: ArrayElement, i: number) => xScale(i.toString())!)
      .attr("width", (d: ArrayElement, i: number) => xScale.bandwidth())
      .attr("y", (d: ArrayElement) => yScale(d.value))
      .attr("height", (d: ArrayElement) => yScale(0) - yScale(d.value));

    if (sorting) {
      let states: State[];
      switch (sortingType) {
        case "merge":
          states = mergeSort();
          break;
        case "quick":
          states = quickSort();
          break;
        case "bubble":
          states = bubbleSort();
          break;
        case "insertion":
          states = insertionSort();
          break;
        case "selection":
          states = selectionSort();
          break;
        default:
          states = [];
          break;
      }

      (async () => {
        for (const state of states) {
          console.log(state);
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
                    return xScale(
                      (newIndex + state.auxilary.startIndex).toString()
                    )!;
                  }
                }
              }

              for (let newIndex = 0; newIndex < state.nums.length; newIndex++) {
                if (state.nums[newIndex].key === index) {
                  return xScale(newIndex.toString())!;
                }
              }

              return xScale("0")!;
            })
            .attr("y", (d: any, index: number) => {
              if (state.auxilary) {
                for (
                  let newIndex = 0;
                  newIndex < state.auxilary.elements.length;
                  newIndex++
                ) {
                  if (state.auxilary.elements[newIndex].key === index) {
                    return yScale(0) + 25;
                  }
                }
              }
              return state.aside === index ? yScale(0) + 25 : yScale(d.value);
            })
            .style("fill", (d: any, index: number) =>
              state.pivot === index
                ? "red"
                : state.cur === index
                ? "green"
                : "blue"
            );
          await newTransition.end();
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      });
    }
    for (let i = start; i < end; i++) {
      newArray[i] = auxilaryElements[i - start];
    }
    states.push({
      nums: [...newArray],
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
    let i = start - 1;
    let partition = end - 1;
    states.push({ nums: [...newArray], pivot: newArray[partition].key });
    for (let j = start; j < partition; j++) {
      states.push({
        nums: [...newArray],
        pivot: newArray[partition].key,
        cur: newArray[j].key,
      });
      if (newArray[j].value < newArray[partition].value) {
        i += 1;
        const temp = newArray[j];
        newArray[j] = newArray[i];
        newArray[i] = temp;
        states.push({
          nums: [...newArray],
          pivot: newArray[partition].key,
          cur: newArray[j].key,
        });
      }
    }
    const temp = newArray[i + 1];
    newArray[i + 1] = newArray[partition];
    newArray[partition] = temp;
    states.push({ nums: [...newArray] });
    return states
      .concat(quickSort(start, i + 1, newArray))
      .concat(quickSort(i + 2, end, newArray));
  };

  const bubbleSort = () => {
    const newArray = [...array];
    const states: State[] = [];

    for (let i = 0; i < newArray.length; i++) {
      let swapped = false;
      states.push({ nums: [...newArray] });
      for (let j = 0; j < newArray.length - i - 1; j++) {
        if (newArray[j].value > newArray[j + 1].value) {
          swap(newArray, j, j + 1);
          states.push({ nums: [...newArray] });
          swapped = true;
        }
      }
      if (!swapped) break;
    }
    return states;
  };

  const insertionSort = () => {
    const newArray = [...array];
    const states: State[] = [];
    for (let i = 1; i < newArray.length; i++) {
      states.push({ nums: [...newArray], aside: newArray[i].key });
      let j = i - 1;
      for (; j >= 0 && newArray[j].value > newArray[j + 1].value; j--) {
        swap(newArray, j, j + 1);
        states.push({ nums: [...newArray], aside: newArray[j].key });
      }
      states.push({ nums: [...newArray] });
    }
    return states;
  };

  const selectionSort = () => {
    const newArray = [...array];
    const states: State[] = [];
    for (let i = 0; i < newArray.length; i++) {
      let smallestIndex = i;
      for (let j = i; j < newArray.length; j++) {
        if (newArray[j].value < newArray[smallestIndex].value) {
          smallestIndex = j;
        }
      }
      swap(newArray, i, smallestIndex);
      states.push({ nums: [...newArray] });
    }
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
          height: windowHeight,
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
