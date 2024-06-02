const setupNetwork = (nodes, edges, labelToColorMap, uniqueLabels, labelBaseColors) => {
    // Update nodes with colors and font settings
    nodes.update(nodes.get().map(node => {
        const baseLabel = node.label.split(" ")[0];
        const groupNumber = node.label.includes('SubGroup') ? parseInt(node.label.split("SubGroup ")[1], 10) : 0;
        const subGroupLabel = `${baseLabel} SubGroup ${groupNumber}`;
        return {
            ...node,
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
            },
            group: subGroupLabel
        };
    }));

    // Create legend dynamically
    const legendContainer = document.getElementById('legend');
    legendContainer.innerHTML = ''; // Clear any existing content
    uniqueLabels.forEach(label => {
        const legendBox = document.createElement('div');
        legendBox.className = 'legend-box';
        legendBox.innerHTML = `<div style="background-color: ${labelBaseColors[label]};"></div><span class="legend-text">${label}</span>`;
        legendContainer.appendChild(legendBox);
    });

    // Create a network
    const container = document.getElementById('mynetwork');
    const networkData = {
        nodes: nodes,
        edges: edges
    };
    const options = {
        interaction: {
            hover: true,
            tooltipDelay: 200,
            navigationButtons: true,
            keyboard: true
        },
        nodes: {
            shape: 'dot',
            size: 30,
            font: {
                size: 18,
                color: '#000000' // Always set the label color to black
            },
            borderWidth: 2
        },
        edges: {
            width: 2,
            color: {
                color: '#c0c0c0',
                highlight: '#ff5722',
                hover: '#ff5722'
            },
            arrows: {
                to: { enabled: true, scaleFactor: 1.2 }
            },
            smooth: {
                type: 'continuous'
            },
            font: {
                size: 14,
                color: '#000000',
                strokeWidth: 0,
                align: 'middle'
            }
        },
        physics: {
            enabled: true,
            barnesHut: {
                gravitationalConstant: -30000,
                centralGravity: 0.3,
                springLength: 200,
                springConstant: 0.04,
                damping: 0.09,
                avoidOverlap: 0.5
            },
            solver: 'barnesHut',
            stabilization: {
                enabled: true,
                iterations: 2000,
                updateInterval: 25,
                onlyDynamicEdges: false
            }
        },
        groups: Object.keys(labelToColorMap).reduce((acc, label) => {
            acc[label] = { color: labelToColorMap[label] };
            return acc;
        }, {})
    };
    const network = new vis.Network(container, networkData, options);

    // Add event listener for node clicks
    network.on('click', function(params) {
        if (params.nodes.length > 0) {
            const nodeId = params.nodes[0];
            highlightConnectedNodesAndEdges(network, nodes, edges, nodeId, labelToColorMap);
        }
    });

    // Remove zoom functionality on hoverNode
    network.on('hoverNode', function(params) {
        const nodeId = params.node;
        highlightConnectedNodesAndEdges(network, nodes, edges, nodeId, labelToColorMap);
    });

    // Function to handle highlighting connected nodes and edges
    const highlightConnectedNodesAndEdges = (network, nodes, edges, nodeId, labelToColorMap) => {
        const connectedNodes = network.getConnectedNodes(nodeId);
        const connectedEdges = network.getConnectedEdges(nodeId);
        network.setSelection({
            nodes: connectedNodes,
            edges: connectedEdges
        });

        // Check zoom on focus setting
        const zoomOnFocus = document.getElementById('zoomOnFocus').checked;
        if (zoomOnFocus) {
            network.focus(nodeId, { scale: 1.5, animation: true });
        }
    };

    // Functions to remove branch, insert parent, remove branch keeping children
    const removeBranch = (nodeId) => {
        const connectedEdges = edges.get({ filter: edge => edge.from === nodeId || edge.to === nodeId });
        connectedEdges.forEach(edge => edges.remove(edge));
        nodes.remove(nodeId);
        undoStack.push({ action: 'remove', nodeId, connectedEdges });
    };

    const insertParentBranch = (nodeId) => {
        const parentEdge = edges.get({ filter: edge => edge.to === nodeId })[0];
        if (parentEdge) {
            const newNodeId = nodes.length + 1;
            const newNode = {
                id: newNodeId,
                label: 'New Parent Node'
            };
            nodes.add(newNode);
            edges.add({ from: parentEdge.from, to: newNodeId });
            edges.update({ id: parentEdge.id, from: newNodeId });
            undoStack.push({ action: 'insertParent', newNode, parentEdge });
        }
    };

    const removeBranchKeepChildren = (nodeId) => {
        const connectedEdges = edges.get({ filter: edge => edge.from === nodeId });
        connectedEdges.forEach(edge => {
            edges.update({ id: edge.id, from: edge.to });
        });
        nodes.remove(nodeId);
        undoStack.push({ action: 'removeKeepChildren', nodeId, connectedEdges });
    };
};
