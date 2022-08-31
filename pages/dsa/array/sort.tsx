import type { NextPage } from "next";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

import * as d3 from "d3";
import SpeedControls from "@/components/contols/SpeedControls";
import {
  ArrayElement,
  bubbleSort,
  ElementColors,
  getRandomArray,
  insertionSort,
  mergeSort,
  quickSort,
  selectionSort,
  State,
} from "lib/dsa/array/sort";
import InputControls from "@/components/contols/InputControls";

let paused = false,
  steps: State[] = [],
  curStepIndex = 0,
  transitionDuration = 250;

const Sort: NextPage = () => {
  const margin = { top: 20, right: 100, bottom: 30, left: 100 };
  const [sortingType, setSortingType] = useState("merge");
  const [sorting, setSorting] = useState(false);

  const [array, setArray] = useState(getRandomArray(5));

  const getXScale = (width: number, array: ArrayElement[]) =>
    d3
      .scaleBand()
      .domain(array.map((num, index) => index.toString()))
      .rangeRound([margin.left, width - margin.left])
      .padding(0.1);

  const getYScale = (height: number, array: ArrayElement[]) =>
    d3
      .scaleLinear()
      .domain([0, d3.max(array, (d) => d.value)!])
      .range([height / 2 - margin.bottom, margin.top]);

  useEffect(() => {
    d3.select(".bars").selectAll("*").remove();
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
          getXScale(window.innerWidth, array)(i.toString())!
      )
      .attr("width", (d: ArrayElement, i: number) =>
        getXScale(window.innerWidth, array).bandwidth()
      )
      .attr("y", (d: ArrayElement) =>
        getYScale(window.innerHeight, array)(d.value)
      )
      .attr(
        "height",
        (d: ArrayElement) =>
          getYScale(window.innerHeight, array)(0) -
          getYScale(window.innerHeight, array)(d.value)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [array]);

  useEffect(() => {
    if (sorting) {
      paused = false;
      if (steps.length === 0) {
        switch (sortingType) {
          case "merge":
            steps = mergeSort(0, array.length, [...array]);
            break;
          case "quick":
            steps = quickSort(0, array.length, [...array]);
            break;
          case "bubble":
            steps = bubbleSort(array);
            break;
          case "insertion":
            steps = insertionSort(array);
            break;
          case "selection":
            steps = selectionSort(array);
            break;
        }
        curStepIndex = 0;
      }
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
              return getXScale(
                window.innerWidth,
                array
              )((newIndex + state.auxilary.startIndex).toString()!)!;
            }
          }
        }

        for (let newIndex = 0; newIndex < state.nums.length; newIndex++) {
          if (state.nums[newIndex].key === index) {
            return getXScale(window.innerWidth, array)(newIndex.toString())!;
          }
        }

        return getXScale(window.innerWidth, array)("0")!;
      })
      .attr("y", (d: any, index: number) => {
        if (state.auxilary) {
          for (
            let newIndex = 0;
            newIndex < state.auxilary.elements.length;
            newIndex++
          ) {
            if (state.auxilary.elements[newIndex].key === index) {
              return getYScale(window.innerHeight, array)(0) + 25;
            }
          }
        }
        return state.aside === index
          ? getYScale(window.innerHeight, array)(0) + 25
          : getYScale(window.innerHeight, array)(d.value);
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
      setSorting(false);
      setArray(state.nums);
      return;
    }
    if (!paused) runSortingStep();
  };

  return (
    <div className="page">
      <h1 className="m-3">Array Sorting</h1>
      <Container>
        <Row>
          <Col xs={12} md={4}>
            <SpeedControls
              setTransitionDuration={(duration) =>
                (transitionDuration = duration)
              }
            />
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
          </Col>
          <Col xs={12} md={4}>
            <InputControls
              maxLength={200}
              setCustomInput={(input) => {
                try {
                  setArray(
                    eval(input).map((num: number, index: number) => ({
                      key: index,
                      value: num,
                    }))
                  );
                } catch (error) {}
              }}
              setRandomInput={(length) => setArray(getRandomArray(length))}
            />
          </Col>
        </Row>
      </Container>
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
