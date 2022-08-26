import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div>
      <h1 className="m-5">Algorithm Visualizations</h1>
      <p>
        This is a tool I created to visualize various Data Structures and
        Algorithms. Select a category from the navigation bar to see
        visualizations under that category!
      </p>
    </div>
  );
};

export default Home;
