import * as d3 from "d3";

import {
  getRandomExtraParams,
  getRandomList,
  ListNode,
  NodeColors,
  State,
} from "lib/dsa/linked-list";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import InputControls from "./contols/InputControls";
import SpeedControls from "./contols/SpeedControls";

let paused = false,
  steps: State[] = [],
  curStepIndex = 0,
  transitionDuration = 500,
  nodeRadius = 25,
  spaceBetweenNodes = 50,
  canvasHeight = 100,
  markerBoxWidth = 20,
  markerBoxHeight = 20;

const LinkedList = (props: {
  title: string;
  algorithm: (list: ListNode[], ...extraParams: number[]) => State[];
  numExtraParams?: number;
  canCycle?: boolean;
  cleanup?: boolean;
}) => {
  const margin = { top: 20, right: 100, bottom: 30, left: 100 };

  const [list, setList] = useState(getRandomList(5, props.canCycle));
  const [extraParams, setExtraParams] = useState(
    getRandomExtraParams(list, props.numExtraParams)
  );
  const [invalidInput, setInvalidInput] = useState(false);
  const [begun, setBegun] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    canvasHeight =
      window.innerHeight -
      (d3.select(".list")!.node() as Element)!.getBoundingClientRect()!.y;

    nodeRadius = Math.min(
      (window.innerWidth - margin.left - margin.right) /
        (3 * list.length - 2) /
        2,
      canvasHeight / 2.125
    );

    spaceBetweenNodes =
      (window.innerWidth - margin.left - margin.right - 2 * nodeRadius) /
      Math.max(1, list.length - 1);

    markerBoxWidth = nodeRadius / 2;
    markerBoxHeight = nodeRadius / 2;

    renderList(list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  useEffect(() => {
    if (begun) {
      paused = false;
      if (steps.length === 0) {
        steps = props.algorithm([...list], ...extraParams);
        curStepIndex = 0;
      }
      if (steps.length > 0) runStep();
    } else {
      paused = true;
    }
  });

  const renderList = (list: ListNode[]) => {
    d3.select(".list").selectAll("*").remove();

    d3.select(".list")
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("refX", markerBoxWidth / 2)
      .attr("refY", markerBoxHeight / 2)
      .attr("markerWidth", markerBoxWidth)
      .attr("markerHeight", markerBoxHeight)
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr(
        "d",
        d3.line()([
          [0, 0],
          [0, markerBoxHeight],
          [markerBoxWidth, markerBoxHeight / 2],
        ])
      )
      .attr("stroke", "black");

    const nodeGroup = d3
      .select(".list")
      .selectAll(".node")
      .data(list)
      .enter()
      .append("g")
      .attr("class", "node");

    nodeGroup
      .append("circle")
      .attr("stroke", "black")
      .attr("fill", "white")
      .attr("stroke-width", nodeRadius / 10)
      .attr("cx", (d, i) => i * spaceBetweenNodes + margin.left + nodeRadius)
      .attr("cy", canvasHeight / 2)
      .attr("r", nodeRadius);

    nodeGroup
      .append("text")
      .attr(
        "x",
        (d, i) =>
          i * spaceBetweenNodes +
          margin.left +
          (nodeRadius * (4 - (d.value.toString().length % 4))) / 4
      )
      .attr("y", canvasHeight / 2 + nodeRadius * 0.125)
      .attr(
        "font-size",
        (d, i) =>
          (nodeRadius * 0.75) / (Math.floor(d.value.toString().length / 4) + 1)
      )
      .text((d, i) => d.value);

    nodeGroup
      .append("path")
      .attr("d", (d, i) => {
        if (d.nextKey === -1)
          return `M ${
            i * spaceBetweenNodes + nodeRadius + margin.left + nodeRadius
          }, ${canvasHeight / 2}`;
        let nextIndex = i;
        for (let j = 0; j < list.length; j++) {
          if (list[j].key === d.nextKey) {
            nextIndex = j;
          }
        }
        return `M ${
          i * spaceBetweenNodes +
          nodeRadius * (nextIndex > i ? 1 : -1) +
          margin.left +
          nodeRadius
        }, ${canvasHeight / 2} ${
          Math.abs(nextIndex - i) > 1
            ? "L" +
              (((i + nextIndex) / 2) * spaceBetweenNodes -
                markerBoxWidth / 4 +
                margin.left) +
              ", " +
              canvasHeight / 4
            : ""
        } L ${
          nextIndex * spaceBetweenNodes +
          nodeRadius * (nextIndex > i ? 0 : 2) -
          (markerBoxWidth / 2) * (nextIndex > i ? 1 : -1) +
          margin.left
        }, ${canvasHeight / 2}`;
      })
      .attr("marker-end", "url(#arrow)")
      .attr("fill", "none")
      .attr("stroke", "black");
  };

  const runStep = async () => {
    const state = steps[curStepIndex];
    if (state.message) setMessage(state.message);
    const newTransition = d3
      .transition()
      .duration(transitionDuration)
      .ease(d3.easeLinear);

    const nodeGroup = d3
      .select(".list")
      .selectAll(".node")
      .transition(newTransition);

    nodeGroup
      .select("circle")
      .attr("cx", (d, i: number) => {
        for (let j = 0; j < state.list.length; j++) {
          if (state.list[j].key === i) {
            return j * spaceBetweenNodes + margin.left + nodeRadius;
          }
        }
        return 0;
      })
      .style("fill", (datum, i: number) => {
        const d = datum as ListNode;
        for (let newIndex = 0; newIndex < state.list.length; newIndex++) {
          if (state.list[newIndex].key === i) {
            return state.colors ? state.colors[newIndex] : NodeColors.DEFAULT;
          }
        }
        return NodeColors.DEFAULT;
      });

    nodeGroup.select("text").attr("x", (datum, i: number) => {
      const d = datum as ListNode;
      for (let j = 0; j < state.list.length; j++) {
        if (state.list[j].key === i) {
          return (
            j * spaceBetweenNodes +
            margin.left +
            (nodeRadius * (4 - (d.value.toString().length % 4))) / 4
          );
        }
      }
      return 0;
    });

    nodeGroup.select("path").attr("d", (datum, i: number) => {
      const d = datum as ListNode;
      let index = -1,
        nextIndex = -1;

      for (let j = 0; j < state.list.length; j++) {
        if (state.list[j].key === d.key) {
          index = j;
        }
      }
      if (!state.list[index]) return "";
      if (state.list[index].nextKey === -1)
        return `M ${
          index * spaceBetweenNodes + nodeRadius + margin.left + nodeRadius
        } ${canvasHeight / 2}`;
      for (let j = 0; j < state.list.length; j++) {
        if (state.list[j].key === state.list[index].nextKey) {
          nextIndex = j;
        }
      }
      return `M ${
        index * spaceBetweenNodes +
        nodeRadius * (nextIndex > index ? 1 : -1) +
        margin.left +
        nodeRadius
      }, ${canvasHeight / 2} ${
        Math.abs(nextIndex - index) > 1
          ? "L" +
            (((index + nextIndex) / 2) * spaceBetweenNodes -
              markerBoxWidth / 4 +
              margin.left) +
            ", " +
            canvasHeight / 4
          : ""
      } L ${
        nextIndex * spaceBetweenNodes +
        nodeRadius * (nextIndex > index ? 0 : 2) -
        (markerBoxWidth / 2) * (nextIndex > index ? 1 : -1) +
        margin.left
      }, ${canvasHeight / 2}`;
    });
    await newTransition.end();
    curStepIndex++;
    if (curStepIndex >= steps.length) {
      steps = [];
      setBegun(false);
      if (props.cleanup)
        setList(
          state.list.map((element, index, array) => ({
            ...element,
            key: index,
            nextKey: index === array.length - 1 ? -1 : index + 1,
          }))
        );
      return;
    }
    if (!paused) runStep();
  };

  return (
    <div className='page'>
      <h1 className='m-3'>{props.title}</h1>
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
            <Button
              className='m-3'
              onClick={() => setBegun((prevBegun) => !prevBegun)}
            >
              {begun ? "Pause" : "Start"}
            </Button>
          </Col>
          <Col xs={12} md={4}>
            <InputControls
              defaultInput={`[${list
                .map((node) => node.value)
                .toString()}] ${extraParams.toString()}`}
              maxLength={25}
              invalid={invalidInput}
              setCustomInput={(input) => {
                try {
                  const providedExtraParams = input
                    .split("]")[1]
                    .trim()
                    .split(",");
                  if (
                    providedExtraParams.length !== props.numExtraParams ||
                    providedExtraParams.some(
                      (param) => !param || (parseInt(param) || -1) < 0
                    )
                  ) {
                    return setInvalidInput(true);
                  }
                  setList(
                    eval(input.split("]")[0] + "]").map(
                      (num: number, index: number, array: number[]) => ({
                        key: index,
                        value: num,
                        nextKey:
                          index === array.length - 1
                            ? props.canCycle
                              ? Math.min(
                                  eval(input.split("]")[1].trim()),
                                  array.length - 1
                                )
                              : -1
                            : index + 1,
                      })
                    )
                  );
                  setExtraParams(
                    providedExtraParams.map((param) => parseInt(param.trim()))
                  );
                  setInvalidInput(false);
                } catch (error) {
                  setInvalidInput(true);
                }
              }}
              setRandomInput={(length) => {
                setList(getRandomList(length, props.canCycle));
                setExtraParams(
                  getRandomExtraParams(list, props.numExtraParams)
                );
              }}
            />
          </Col>
        </Row>
      </Container>

      <b>{message}</b>
      <svg
        style={{
          height: "100%",
          width: "100%",
          marginRight: "0px",
          marginLeft: "0px",
        }}
      >
        <g className='list' />
      </svg>
    </div>
  );
};

export default LinkedList;

