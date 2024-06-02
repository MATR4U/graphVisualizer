// Function to highlight nodes and edges
const highlightConnectedNodesAndEdges = (network, nodes, edges, nodeId, labelToColorMap) => {
    const connectedNodes = network.getConnectedNodes(nodeId);
    const connectedEdges = network.getConnectedEdges(nodeId);
    // Reset node and edge colors
    nodes.update(nodes.get().map(node => {
        const baseLabel = node.label.split(" ")[0];
        const subGroupLabel = `${baseLabel} SubGroup ${Math.floor(Math.random() * 5) + 1}`;
        return {
            id: node.id,
            color: {
                border: labelToColorMap[subGroupLabel],
                background: labelToColorMap[subGroupLabel],
                highlight: {
                    border: tinycolor(labelToColorMap[subGroupLabel]).darken(10).toString(),
                    background: tinycolor(labelToColorMap[subGroupLabel]).darken(10).toString()
                },
                hover: {
                    border: tinycolor(labelToColorMap[subGroupLabel]).brighten(10).toString(),
                    background: tinycolor(labelToColorMap[subGroupLabel]).brighten(10).toString()
                }
            },
            font: {
                size: 18,
                color: '#000000' // Always set the label color to black
            }
        };
    }));
    edges.update(edges.get().map(edge => ({
        id: edge.id,
        color: '#c0c0c0'
    })));
    // Highlight the selected node, its neighbors, and connected edges
    nodes.update([{ id: nodeId, color: { border: '#ff5722', background: '#ffccbc', font: { color: '#000000' } } }]);
    connectedNodes.forEach(id => {
        nodes.update({ id: id, color: { border: '#ff5722', background: '#ffccbc', font: { color: '#000000' } } });
    });
    connectedEdges.forEach(id => {
        edges.update({ id: id, color: { color: '#ff5722' } });
    });
};
