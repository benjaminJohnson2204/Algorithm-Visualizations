import type { NextPage } from "next";
import { useEffect } from "react";
import { useState } from "react";
import dynamic from "next/dynamic";
const Array = dynamic(() => import("@/components/array"), {
  ssr: false,
});

const minArrayLength = 2,
  maxArrayLength = 20,
  minNumVal = 1,
  maxNumVal = 10;

const Sort: NextPage = () => {
  const [sortingType, setSortingType] = useState("merge");
  const [array, setArray] = useState<number[]>([]);

  useEffect(() => {
    const initialArray: number[] = [];
    for (
      let i = 0;
      i <
      minArrayLength +
        Math.floor(Math.random() * (maxArrayLength - minArrayLength));
      i++
    ) {
      initialArray.push(
        minNumVal + Math.floor(Math.random() * (maxNumVal - minNumVal))
      );
    }
    setArray(initialArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Array Sorting</h1>
      <Array array={array} />
      {/* <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {array.map((num, index) => (
            <Rect
              key={index}
              x={window.innerWidth / 4}
              y={window.innerHeight / 4}
              width={window.innerWidth / 20}
              height={(num * window.innerHeight) / 20}
            />
          ))}
        </Layer>
      </Stage> */}
    </div>
  );
};

export default Sort;
