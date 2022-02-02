import React, {useEffect, useState} from "react";
import { render } from "react-dom";
import Example from "./Example";
import {data} from "./data/data";


const App = () => {
    const [graphData , setGraphData] = useState({ nodes: [], links: [] },)
    const [numberOfTransactions , setNumberOfTransactions] = useState(0)
    const [waiting , setWaiting] = useState(false)
    const [wallets , setWallets] = useState( {
        Mint: "0x0000000000000000000000000000000000000000",
        "Primary Wallet": "0x72571d815dd31fbde52be0b9d7ffc8344aede616",
        "Other Wallet": "Other",
        HODL: "HODL",
        PancakeSwap: "0xd6d206f59cc5a3bfa4cc10bc8ba140ac37ad1c89",
        Polkastarter: "0xee62650fa45ac0deb1b24ec19f983a8f85b727ab",
    })
    const [colors , setNodeColors] = useState( {
        Mint: "blue",
        "Primary Wallet": "yellow",
        "Other Wallet": "purple",
        HODL: "green",
        PancakeSwap: "red",
        Polkastarter: "royalblue",
    })

    useEffect(()=>{
        generateLinks(data).then(r =>  {
            console.log(r)
            setWaiting(true)
            setGraphData(r)
        })
    } , [data])

    const generateLinks = async (data) => {
        let obj = {}
        let nodes = []

        for (const [key, value] of Object.entries(wallets)) {
            nodes.push({
                index:value,
                node: value,
                name: key,
                color: colors[key]
            });
        }

        let links = [];
        let HODL = 0;
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
            let mainConditions =
                (FromMint && toPriWallet) ||
                (FromPolkstarter && toPriWallet) ||
                (FromPolkstarter && toPancake) ||
                (FromPrimaryWallet && toPancake);

            if (mainConditions) {
                UpdateLinks(From, To, Quantity, links)
            }
            if (
                (FromPolkstarter && toOtherWallets) ||
                (FromPrimaryWallet && toOtherWallets)
            ) {
                UpdateLinks(
                    From,
                    wallets["Other Wallet"],
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
                    wallets["Primary Wallet"],
                    wallets.HODL,
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
                <Example data={graphData} width={960} height={500} />
                : 'Loading...'
            }
        </div>
    );
}




render(<App />, document.getElementById("root"));
