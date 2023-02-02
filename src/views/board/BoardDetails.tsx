import React from "react";
import Filter from "../../components/Filter";

const opts = [
  "Hello",
  "Test1",
  "Test2",
  "Test3",
  "Test4",
  "Test5",
  "Test6",
  "Test7",
  "Test8",
  "Test9",
  "Test10",
  "Hello1",
];
const opts2 = ["Hello", "Test2", "Test3"];
const opts3 = [
  "Hello",
  "Test1",
  "Test2",
  "Test3",
  "Test4",
  "Test5",
  "Test6",
  "Test7",
  "Test8",
  "Test9",
  "Test10",
  "Test11",
];
const BoardDetails = () => {
  return (
    <div>
      <Filter options={opts} />
      <Filter options={opts2} />
      <Filter options={opts3} />
    </div>
  );
};

export default BoardDetails;
