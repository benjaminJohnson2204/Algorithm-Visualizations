# Algorithm Visualizations

This is a website I created with various animations of algorithms and data structures. The site shows data visually, and runs an animation of the algorithm, step by step, to help users better understand the algorithm. The project is hosted on Vercel at https://algorithm-visualizations-benjaminjohnson2204.vercel.app/.

## Tech Stack

I created this project using Next.js, React, TypeScript, and D3. I used D3 for visually displaying data and smoothly animating changes to the data.

## To Run Locally

To install dependencies, run

```
npm i
```

To run the app in development mode, run

```
npm run dev
```

To build the app, run

```
npm run build
```

To run the built app, run

```
npm start
```

## Code Structure

The code is structured like a standard Next.js project. I didn't need to create any APIs; this project is purely front-end React code, and I just choose to use Next.js to provide extra structure and functionality to that code.

The `pages` directory contains all the pages; each visualization is on its own page. The page paths are [category]/[subcategory]/[specific algorithm]. So far, the only category of visualizations I've created is Data Structures and Algorithms, but I'm planning to eventually expand to math and physics animations.

The `lib` directory contains my library of functions to run the various algorithms.

The `components` directory contains React components for different parts of the visualizations. For example, each page contains a slider to adjust the animation speed, and options for custom and random input; these are provided by the `SpeedControls` and `InputControls` components respectively. The `SiteHeader` components contains the Nav bar for navigating between pages. The `LinkedList` component renders the animation of an algorithm involving a linked list; I created this component to reduce code repetition in the multiple linked list-related algorithms.

## Design Decisions

In order to show a data structure at each step of an algorithm, I needed to design a representation of the structures that allowed both algorithmic manipulation and displaying on the page.

For arrays, I accomplished this by representing each array element as an object with fields for its value (the number in the array) and a unique key, set to its original index in the array. As the array is mutated (such as by sorting it), the array elements will change indexes, but in order to animate these changes, I needed a way to uniquely identify each D3 array element so the code would know which element to move.

I represented linked lists as an array of elements, where each element is an object with fields for its value, a unique key (just like with arrays), and the key of the "next" element (the element that this element points to). I used the unique key system since some algorithms, such as reversing a linked list, require changing the order in which list elements appear on the screen.

To show each step of an algorithm, my code for the algorithms creates a list of states. Each state includes what the data is and how it should be rendered; for example, to highlight a certain array/list element, I change its color. When the animation runs, I run through each state and use D3's `transition` functionality to smoothly transition from one state to the next.

