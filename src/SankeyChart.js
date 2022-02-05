import React, { useEffect, useRef } from "react";

import * as d3 from "d3";
import * as d3Sankey from "d3-sankey";

export default function SankeyChartComponent({data}) {
    const svgEl = useRef(null);
    useEffect(() => {
        let svg = d3.select(svgEl.current),
            width = +svg.attr("width"),
            height = +svg.attr("height");

        let formatNumber = d3.format(",.0f");
        let format = function (d) {
            return "Weight " + formatNumber(d);
        };

        let sankey = d3Sankey
            .sankey()
            .nodeWidth(15)
            .nodePadding(10)
            .extent([
                [1, 1],
                [width - 1, height - 6],
            ]);

        let link = svg
            .append("g")
            .attr("class", "links")
            .attr("fill", "none")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.2)
            .selectAll("path");

        let node = svg
            .append("g")
            .attr("class", "nodes")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .selectAll("g");

        sankey(data);

        link = link
            .data(data.links)
            .enter()
            .append("path")
            .attr("d", d3Sankey.sankeyLinkHorizontal())
            .attr("stroke-width", function (d) {
                return Math.max(1, d.width);
            });

        link.append("title").text(function (d) {
            return d.source.name + " → " + d.target.name + "\n" + format(d.value);
        });

        node = node.data(data.nodes).enter().append("g");

        node
            .append("rect")
            .attr("x", function (d) {
                return d.x0;
            })
            .attr("y", function (d) {
                return d.y0;
            })
            .attr("height", function (d) {
                return d.y1 - d.y0;
            })
            .attr("width", function (d) {
                return d.x1 - d.x0;
            })
            .attr("fill", function (d) {
                return d.color;
            })
            .attr("stroke", "#000");

        node
            .append("text")
            .attr("x", function (d) {
                return d.x0 - 6;
            })
            .attr("y", function (d) {
                return (d.y1 + d.y0) / 2;
            })
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .text(function (d) {
                return d.name;
            })
            .filter(function (d) {
                return d.x0 < width / 2;
            })
            .attr("x", function (d) {
                return d.x1 + 6;
            })
            .attr("text-anchor", "start");

        node.append("title").text(function (d) {
            return d.name + "\n" + format(d.value);
        });
    }, [data]);

    return (
        <div>
            <div>Total transactions processed {data.transactionsProcessed}</div>
            <div>Total Value QUIDD {data.totalQUIDD}</div>
            <svg ref={svgEl} width="960" height="500"></svg>
        </div>
    );
}
