// Fetch the JSON data
fetch('graph_data.json')
    .then(response => response.json())
    .then(data => {
        const nodes = new vis.DataSet(data.nodes);
        const edges = new vis.DataSet(data.edges);

        // Extract unique labels for grouping
        const uniqueLabels = [...new Set(nodes.get().map(node => node.label.split(" ")[0]))];

        // Assign base colors to each unique label
        const labelBaseColors = {};
        uniqueLabels.forEach(label => {
            labelBaseColors[label] = getBaseColor();
        });

        // Assign groups and color shades to nodes
        const labelToColorMap = {};
        uniqueLabels.forEach(label => {
            const shades = getColorShades(labelBaseColors[label], 6); // Generate 6 shades, main node + 5 sub-nodes
            labelToColorMap[`${label} SubGroup 0`] = shades[0]; // Main node (darkest)
            for (let i = 1; i <= 5; i++) {
                labelToColorMap[`${label} SubGroup ${i}`] = shades[i]; // Sub-nodes (lighter)
            }
        });

        // Set up the network
        setupNetwork(nodes, edges, labelToColorMap, uniqueLabels, labelBaseColors);
    });
