import InputControls from "@/components/contols/InputControls";
import SpeedControls from "@/components/contols/SpeedControls";
import * as d3 from "d3";
import {
  getRandomList,
  ListNode,
  NodeColors,
  reverseLinkedList,
  State,
} from "lib/dsa/linked-list/reverse";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

let paused = false,
  steps: State[] = [],
  curStepIndex = 0,
  transitionDuration = 500,
  nodeRadius = 25,
  spaceBetweenNodes = 50,
  markerBoxWidth = 20,
  markerBoxHeight = 20;

const Reverse: NextPage = () => {
  const margin = { top: 20, right: 100, bottom: 30, left: 100 };

  const [list, setList] = useState(getRandomList(5));
  const [begun, setBegun] = useState(false);

  useEffect(() => {
    nodeRadius =
      (window.innerWidth - margin.left - margin.right) /
      (3 * list.length + 1) /
      2;
    spaceBetweenNodes =
      (window.innerWidth - margin.left - margin.right) /
        ((2 * list.length) / 3) -
      2 * nodeRadius;

    markerBoxWidth = nodeRadius / 2;
    markerBoxHeight = nodeRadius / 2;

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
      .attr("cy", 100)
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
      .attr("y", 100 + nodeRadius * 0.125)
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
          }, 100`;
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
        }, 100 ${
          Math.abs(nextIndex - i) > 1
            ? "L" +
              (((i + nextIndex) / 2) * spaceBetweenNodes -
                markerBoxWidth / 4 +
                margin.left) +
              ", 50"
            : ""
        } L ${
          nextIndex * spaceBetweenNodes +
          nodeRadius * (nextIndex > i ? 0 : 2) -
          (markerBoxWidth / 2) * (nextIndex > i ? 1 : -1) +
          margin.left
        }, 100`;
      })
      .attr("marker-end", "url(#arrow)")
      .attr("fill", "none")
      .attr("stroke", "black");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  useEffect(() => {
    if (begun) {
      paused = false;
      if (steps.length === 0) {
        steps = reverseLinkedList([...list]);
        curStepIndex = 0;
      }
      runSortingStep();
    } else {
      paused = true;
    }
  });

  const runSortingStep = async () => {
    const state = steps[curStepIndex];
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
      if (state.list[index].nextKey === -1)
        return `M ${
          index * spaceBetweenNodes + nodeRadius + margin.left + nodeRadius
        } 100`;
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
      }, 100 ${
        Math.abs(nextIndex - index) > 1
          ? "L" +
            (((index + nextIndex) / 2) * spaceBetweenNodes -
              markerBoxWidth / 4 +
              margin.left) +
            ", 50"
          : ""
      } L ${
        nextIndex * spaceBetweenNodes +
        nodeRadius * (nextIndex > index ? 0 : 2) -
        (markerBoxWidth / 2) * (nextIndex > index ? 1 : -1) +
        margin.left
      }, 100`;
    });
    await newTransition.end();
    curStepIndex++;
    if (curStepIndex >= steps.length) {
      steps = [];
      setBegun(false);
      setList(
        state.list.map((element, index, array) => ({
          ...element,
          key: index,
          nextKey: index === array.length - 1 ? -1 : index + 1,
        }))
      );
      return;
    }
    if (!paused) runSortingStep();
  };

  return (
    <div className="page">
      <h1 className="m-3">Reverse a Linked List</h1>
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
              className="m-3"
              onClick={() => setBegun((prevBegun) => !prevBegun)}
            >
              {begun ? "Pause" : "Start"}
            </Button>
          </Col>
          <Col xs={12} md={4}>
            <InputControls
              maxLength={25}
              setCustomInput={(input) => {
                try {
                  setList(
                    eval(input).map(
                      (num: number, index: number, array: number[]) => ({
                        key: index,
                        value: num,
                        nextKey: index === array.length - 1 ? -1 : index + 1,
                      })
                    )
                  );
                } catch (error) {}
              }}
              setRandomInput={(length) => setList(getRandomList(length))}
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
        <g className="list" />
      </svg>
    </div>
  );
};

export default Reverse;
