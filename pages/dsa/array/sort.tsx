import type { NextPage } from "next";
import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";

import * as d3 from "d3";

interface ArrayElement {
  key: number;
  value: number;
}

// State of array at a given step
interface State {
  nums: ArrayElement[];
  pivot?: number;
  cur?: number;
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
    const height = 500;
    const width = 500;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const xScale = d3
      .scaleBand()
      .domain(array.map((num, index) => index.toString()))
      .rangeRound([margin.left, width - margin.left])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, maxNumVal])
      .range([height - margin.bottom, margin.top]);

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
      (async () => {
        switch (sortingType) {
          // case "merge":
          //   mergeSort(svg, svg.transition().duration(500).ease(d3.easeLinear));
          //   break;
          case "quick":
            for (const state of quickSort()) {
              console.log(state);
              const newTransition = d3
                .transition()
                .duration(1000)
                .ease(d3.easeLinear);
              d3.select("g")
                .selectAll("rect")
                .transition(newTransition)
                .attr("x", (d: any, index: number) => {
                  for (
                    let newIndex = 0;
                    newIndex < state.nums.length;
                    newIndex++
                  ) {
                    if (state.nums[newIndex].key === index) {
                      return xScale(newIndex.toString())!;
                    }
                  }
                  return xScale("0")!;
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
            break;
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

  const mergeSort = () => {};

  /*
   * Quick sort the array and return a list of its states after each swap
   */
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
          height: 500,
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
