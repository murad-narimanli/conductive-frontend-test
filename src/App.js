import './App.css';

//
// Your task is to visualize the transactions in the CSV quidd-bsc-transfers-0x7961Ade0a767c0E5B67Dd1a1F78ba44F727642Ed.csv and specifically point out which transactions came from the Polkastarter smart contract (0xee62650fa45ac0deb1b24ec19f983a8f85b727ab) in a Sankey diagram with the following requirements:
//
//     Create a node showing the token mint. A mint even is designated when the From address is 0x0000000000000000000000000000000000000000 and the resulting tokens go to the owners wallet, in this case 0x72571d815dd31fbde52be0b9d7ffc8344aede616
// Create a node for the Polkastarter smart contract which is 0xee62650fa45ac0deb1b24ec19f983a8f85b727ab
// Create nodes for locations where the tokens can be transferred to
// Represent tokens that were transferred to a decentralized exchange (DEX) such as PancakeSwap with a red node. The PankcakeSwap address is 0xd6d206f59cc5a3bfa4cc10bc8ba140ac37ad1c89.
//     Represent tokens that were transferred to another wallet, but not a DEX with a yellow node labeled “Jump 1”. This can be labeled with any method under the Method column.
//     Represent tokens that were not transferred with a green node.
//     Create links between the nodes to show the flow of tokens from one node to the next. The link between nodes should be visually thicker when more tokens are transferred.
//     Display the amount of QUIDD tokens transferred between nodes on a mouseover of a link in the diagram.
//     Display the value of QUIDD tokens in USD in each node when on a mouseover of a node in the diagram.
//     Repeat this process for tokens transferred to another wallet (yellow node) to visualize their flow to a proceeding wallet, decentralized exchange, or if the tokens were not transferred further.
//     Display a summary of metrics to explain what is being displayed
// Total Value QUIDD - This displays the total lifetime sum of transfer value in QUIDD tokens
// Total number of transactions - This displays the total number of transactions being displayed.


function App() {
  return (
    <div className="App">
      salam
    </div>
  );
}

export default App;
