import { DataStructureState, MyAlgorithm } from 'lib/dataStructure';
import * as d3 from 'd3';
import {
  ArrayElement,
  ArrayState,
  ElementColors,
  MyArray,
} from 'lib/algorithms/array';

const MARGIN = { top: 20, right: 100, bottom: 30, left: 100 };

export abstract class Animator {
  algorithm: MyAlgorithm;
  rootId: string;
  duration: number;
  isPaused: boolean;

  constructor(algorithm: MyAlgorithm, rootId: string, duration: number) {
    this.algorithm = algorithm;
    this.rootId = rootId;
    this.duration = duration;
    this.isPaused = false;
  }

  getRoot() {
    return d3.select(this.rootId);
  }

  createTransition() {
    return d3.transition().duration(this.duration).ease(d3.easeLinear);
  }

  clear() {
    this.getRoot().selectAll('*').remove();
  }

  async run() {
    this.algorithm.run();
    const states = this.algorithm.getStateHistory();
    for (const state of states) {
      if (this.isPaused) {
        return;
      }
      const transition = this.createTransition();
      this.applyTransition(transition, state);
      await transition.end();
    }
  }

  abstract renderInitial(): void;
  abstract applyTransition(
    transition: d3.Transition<d3.BaseType, unknown, null, undefined>,
    newState: DataStructureState
  ): void;
  abstract reset(): void;
}

export class ArrayAnimator extends Animator {
  BAR_CLASS = '.bar';

  getArray() {
    return this.algorithm.dataStructure as MyArray;
  }

  getXScale(state: ArrayState) {
    return d3
      .scaleBand()
      .domain(state.elements.map((element, index) => index.toString()))
      .rangeRound([MARGIN.left, window.innerWidth - MARGIN.left])
      .padding(0.1);
  }

  getYScale(state: ArrayState) {
    return d3
      .scaleLinear()
      .domain([0, d3.max(state.elements, (d) => d.value)!])
      .range([window.innerHeight / 2 - MARGIN.bottom, MARGIN.top]);
  }

  /**
   * Finds the array index bar with the given bar index; since the values may have been
   * reordered in the array state, but the D3 bars have NOT been reordered, we need to check
   * the array state elements' keys to find which one matches this D3 bar
   * @param index index of D3 bar to find
   */
  findElement(index: number, state: ArrayState) {
    for (let newIndex = 0; newIndex < state.elements.length; newIndex++) {
      if (state.elements[newIndex].key === index) {
        return newIndex;
      }
    }
  }

  /**
   * Similar to findElement, but for finding index of element in the auxilary part of the state
   * @param index index of D3 bar to find
   */
  findAuxilaryElement(index: number, state: ArrayState) {
    if (!state.auxilary || !state.auxilary.elements) {
      return;
    }
    for (
      let newIndex = 0;
      newIndex < state.auxilary.elements.length;
      newIndex++
    ) {
      if (state.auxilary.elements[newIndex].key === index) {
        return newIndex;
      }
    }
  }

  renderInitial() {
    const xScale = this.getXScale(this.getArray().state);
    const yScale = this.getYScale(this.getArray().state);

    // Remove previous bars
    d3.select('.bars').selectAll('*').remove();

    // Render all bars as unsorted color
    this.getRoot()
      .attr('fill', ElementColors.UNSORTED)
      .selectAll(this.BAR_CLASS)
      .data(this.getArray().state.elements)
      .enter()
      .append('rect')
      .attr('class', this.BAR_CLASS)
      .attr('x', (d: ArrayElement, i: number) => xScale(i.toString())!)
      .attr('width', (d: ArrayElement, i: number) => xScale.bandwidth())
      .attr('y', (d: ArrayElement) => yScale(d.value))
      .attr('height', (d: ArrayElement) => yScale(0) - yScale(d.value));
  }

  applyTransition(
    transition: d3.Transition<d3.BaseType, unknown, null, undefined>,
    _state: DataStructureState
  ) {
    const state = _state as ArrayState;
    const xScale = this.getXScale(state);
    const yScale = this.getYScale(state);

    this.getRoot()
      .selectAll('rect')
      .transition(transition)
      .attr('x', (d: any, index: number) => {
        if (state.auxilary) {
          // If this element is in the auxilary elements, use auxilary x
          const auxilaryElementIndex = this.findAuxilaryElement(index, state);

          if (auxilaryElementIndex != undefined) {
            return xScale(
              (auxilaryElementIndex + state.auxilary!.startIndex).toString()!
            )!;
          }
        }

        // Otherwise, find index in list and get x coordinate from index
        const elementIndex = this.findElement(index, state);
        if (elementIndex !== undefined) {
          return xScale(elementIndex.toString())!;
        }

        return xScale('0')!;
      })
      .attr('y', (d: any, index: number) => {
        if (state.auxilary) {
          // If it's auxilary, it goes lower down
          const auxilaryElementIndex = this.findAuxilaryElement(index, state);
          if (auxilaryElementIndex !== undefined) {
            return yScale(0) + 25;
          }
        }

        // Otherwise, if it's aside, it goes lower down; otherwise at normal level
        return state.aside === index ? yScale(0) + 25 : yScale(d.value);
      })
      // Set color
      .style('fill', (d: any, index: number) => {
        const elementIndex = this.findElement(index, state);
        if (elementIndex !== undefined) {
          return state.elements[elementIndex]?.color ?? ElementColors.UNSORTED;
        }
        return ElementColors.UNSORTED;
      });
  }

  reset() {
    throw new Error('Method not implemented.');
  }
}
