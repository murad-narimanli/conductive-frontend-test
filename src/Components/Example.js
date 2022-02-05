import React from 'react';
import { Group } from '@vx/group';
import { Text } from '@vx/text';
import { linkHorizontal } from 'd3-shape';
import Sankey from './Sankey';

const path = linkHorizontal()
    .source(d => [d.source.x1, d.y0])
    .target(d => [d.target.x0, d.y1]);

export default class extends React.Component {
    state = {
        highlightLinkIndexes: []
    }

    showToolTip(evt, link){
        let tooltip = document.getElementById("tooltip");
        tooltip.innerHTML = `
           <div>
            <p>  ${link.source.name} -> ${link.target.name} </p>
            <p> Weight ${link.width.toFixed(2)} </p>
          </div>
        `
        tooltip.style.visibility = 'visible';
        tooltip.style.left = evt.pageX - 140 + 'px';
        tooltip.style.top = evt.pageY - 150 + 'px';
    }


     hideTooltip() {
        let tooltip = document.getElementById("tooltip");
        tooltip.style.visibility = "hidden";
    }

    render() {
        const {
            data,
            width,
            height,
            margin = {
                top: 0,
                left: 0,
                right: 200,
                bottom: 0
            }
        } = this.props;

        if (width < 10) return null;

        return (
            <div>
                <div id="tooltip"  style={{position: 'absolute', visibility: 'hidden'}}/>

                <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
                    <Sankey
                        top={margin.top}
                        left={margin.left}
                        data={data}
                        size={[width, height]}
                        nodeWidth={15}
                        nodePadding={10}
                        extent={[[1, 1], [width - 1, height - 6]]}

                    >
                        {({ data }) => (
                            <Group>
                                {data.nodes.map((node, i) => (
                                    <Group top={node.y0} left={node.x0} key={`node-${i}`}>
                                        <rect
                                            id={`rect-${i}`}
                                            width={node.x1 - node.x0}
                                            height={node.y1 - node.y0}
                                            fill={node.color}
                                            opacity={0.9}
                                            stroke="white"
                                            strokeWidth={2}
                                            onMouseOver={e => {
                                                this.setState({
                                                    highlightLinkIndexes: [...node.sourceLinks.map(l => l.index), ...node.targetLinks.map(l => l.index) ] })
                                            }}
                                            onMouseOut={e => {
                                                this.setState({ highlightLinkIndexes: [] })
                                            }}
                                        />
                                        <Text
                                            x={18}
                                            y={((node.y1 - node.y0) / 2)}
                                            verticalAnchor="middle"
                                            style={{
                                                font: '10px sans-serif'
                                            }}
                                        >
                                            {node.name}
                                        </Text>

                                    </Group>
                                ))}

                                <Group>
                                    {data.links.map((link, i) => (
                                        <>
                                            <path
                                                style={{cursor:'pointer' , transition:'0.2s ease-in-out'}}
                                                key={`link-${i}`}
                                                d={path(link)}
                                                // stroke='black'
                                                stroke={this.state.highlightLinkIndexes.includes(i) ? 'red' : 'black'}
                                                strokeWidth={Math.max(1, link.width)}
                                                // opacity={0.2}
                                                opacity={this.state.highlightLinkIndexes.includes(i) ? 0.7 : 0.15}
                                                fill="none"
                                                onMouseOver={e => {
                                                    this.showToolTip(e , link)
                                                    this.setState({ highlightLinkIndexes: [i] })
                                                }}
                                                onMouseOut={e => {
                                                    this.hideTooltip()
                                                    this.setState({ highlightLinkIndexes: [] })
                                                }}
                                            />


                                        </>
                                    ))}
                                </Group>

                            </Group>
                        )}
                    </Sankey>
                </svg>
            </div>
        );
    }
}