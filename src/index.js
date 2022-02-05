import React, {useEffect, useState} from "react";
import { render } from "react-dom";
import axios from "axios";
import Example from "./Example";

const App = () => {
    let trigger = 1
    let url = 'https://conductive-frontend-task.herokuapp.com/api/data'
    const [graphData , setGraphData] = useState({ nodes: [], links: [] },)
    const [numberOfTransactions , setNumberOfTransactions] = useState(0)
    const [waiting , setWaiting] = useState(false)
    const wallets = {
        Mint: "0x0000000000000000000000000000000000000000",
        "Primary Wallet": "0x72571d815dd31fbde52be0b9d7ffc8344aede616",
        "Other Wallet": "Other",
        HODL: "HODL",
        PancakeSwap: "0xd6d206f59cc5a3bfa4cc10bc8ba140ac37ad1c89",
        Polkastarter: "0xee62650fa45ac0deb1b24ec19f983a8f85b727ab",
    }
    const colors = {
        Mint: "blue",
        "Primary Wallet": "yellow",
        "Other Wallet": "purple",
        HODL: "green",
        PancakeSwap: "red",
        Polkastarter: "royalblue",
    }

    useEffect(()=>{
        getData().then(()=>{
            setWaiting(true)
        })
    } , [trigger])

    const getData =  async () => {
        await axios.get(url).then((res)=>{
            generateLinks(res.data).then(r =>  {
                console.log(r)
                setGraphData(r)
            })
        })
    }

    const generateLinks = async (data) => {
        let obj = {}
        let nodes = []
        let links = [];
        let HODL = 0;

        Object.keys(wallets).forEach((s, i) =>{
            nodes.push({
                node: i,
                name: s,
                color: colors[s]
            });
        })

        await data.forEach((entry, index) => {
            let From = entry.From
            let To = entry.To
            let Quantity = entry.Quantity
            
            Quantity = Quantity.split(',').join('');
            let FromMint = (From === wallets.Mint);
            let FromPrimaryWallet = (From === wallets["Primary Wallet"]);
            let FromPolkstarter = (From === wallets.Polkastarter);
            let toPriWallet = (To === wallets["Primary Wallet"]);
            let toPancake = (To === wallets.PancakeSwap);
            let toOtherWallets = (!toPriWallet && !toPancake);

            let FromIndex =
                FromMint ? 0
                    : FromPrimaryWallet ? 1
                        : (From === wallets["Other Wallet"]) ? 2
                            : (From === wallets.HODL) ? 3
                                : (From === wallets.PancakeSwap) ? 4
                                    : FromPolkstarter ? 5 :  undefined

            let ToIndex =
                (To === wallets.Mint) ? 0
                    : toPriWallet ? 1
                        : toOtherWallets ? 2
                            : (To === wallets.HODL) ? 3
                                : toPancake ? 4
                                    : (To === wallets.Polkastarter) ? 5 :  undefined

                let mainConditions =
                (FromMint && toPriWallet) ||
                (FromPolkstarter && toPriWallet) ||
                (FromPolkstarter && toPancake) ||
                (FromPrimaryWallet && toPancake);
            if (mainConditions &&  FromIndex && ToIndex) {
                UpdateLinks(FromIndex, ToIndex, Quantity, links)
            }
            if(FromMint && toPriWallet){
                UpdateLinks(0, 1, Quantity, links)
            }
            if (
                (FromPolkstarter && toOtherWallets) ||
                (FromPrimaryWallet && toOtherWallets)
            ) {
                UpdateLinks(
                    FromIndex,
                    2,
                    Quantity,
                    links
                );
            }
            if (toPriWallet) {
                HODL += Number(Quantity);
            }
            if (FromPrimaryWallet) {
                if (toOtherWallets || toPancake) {
                    HODL -= Number(Quantity);
                }
            }
            if (index === data.length - 1) {
                UpdateLinks(
                   1,
                    3,
                    HODL,
                    links
                );
            }
        });
        obj['nodes'] = nodes
        obj['links'] = links
        return obj
    }


    const UpdateLinks = (from, to, quantity, links) => {
        let indexOfLink = links.findIndex((link) => {
            return link.source === from && link.target === to;
        });
        let isLinkCreated = indexOfLink >= 0;
        if (!isLinkCreated) {
            links.push({
                source: from,
                target: to,
                value: Number(quantity),
            });
        } else {
            links[indexOfLink].value += Number(quantity);
        }
        setNumberOfTransactions(numberOfTransactions+1)
    }

    return (
        <div style={{marginTop:'130px'}}>
            {waiting ?
                <Example data={graphData}  width={960} height={500} />
                : 'Loading...'
            }
        </div>
    );
}




render(<App />, document.getElementById("root"));
