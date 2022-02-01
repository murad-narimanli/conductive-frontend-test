import React from "react";
import { render } from "react-dom";
import Example from "./Example";
import cvData from "./data/cv";

const App = () => (
  <div>
    <h2>Sankey</h2>
    <Example data={cvData} width={960} height={500} />
  </div>
);




render(<App />, document.getElementById("root"));
