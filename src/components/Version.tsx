import React from "react";
import pJson from "../../package.json";

const Version = () => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 5,
        right: 5,
      }}
    >
      {pJson.version}
    </div>
  );
};

export default Version;
