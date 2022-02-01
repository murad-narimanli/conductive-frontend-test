import React, {useState} from "react";
import { render } from "react-dom";
import Example from "./Example";
import cvData from "./data/cv";
import {data} from "./data/data";


const App = () => {
    const [nodes, setNodes] =  useState([
        { node: 0, name: "Polkastarter" },
    ])
    const [links , setLinks] = useState([])

    let data = {
        nodes , links
    }

    return (
        <div style={{marginTop:'130px'}}>
            <Example data={cvData} width={960} height={500} />
        </div>
    );
}




render(<App />, document.getElementById("root"));
