Project Recap: D3.js Hierarchical Data Visualization
Objective:
The project aims to create an interactive and visually appealing hierarchical data visualization using D3.js. The visualization displays a network of nodes and links with various interactive features such as color cycling, node highlighting, and keyboard shortcuts.

Core Components:
HTML Structure (index.html):

Contains the main containers for the network visualization and the legend.
Includes buttons to toggle visibility of the shortcut pane and settings pane.
Imports required scripts and stylesheets.
Styling (styles.css):

Defines the layout and appearance of the network container, legend, and various UI elements.
Provides styles for nodes, links, and interactive components to ensure a cohesive look and feel.
Data Loading (dataLoader.js):

Contains functions to load graph data from a JSON file using Fetch API.
Example function: loadGraphData(url) fetches data and returns a promise resolving to the JSON content​​.
Color Utilities (colorUtils.js):

Functions to generate base colors and shades for different groups of nodes.
Example functions: getBaseColor() generates a random color, and getColorShades(baseColor, numShades) generates shades of a base color​​.
Event Handlers (eventHandlers.js):

Manages interactions such as highlighting nodes and their connections.
Example function: highlightConnectedNodesAndEdges(root, nodeId, labelToColorMap) highlights the selected node and its connected nodes and edges​​.
Network Settings (networkSetup.js):

Sets up the network visualization, including the legend and event listeners for nodes.
Example function: setupNetwork(root, labelToColorMap, uniqueLabels, labelBaseColors) initializes the network and legend based on data​​.
Keyboard Input (keyboardInput.js):

Implements keyboard shortcuts for various interactions such as adding new branches, undo/redo actions, and cycling node attributes.
Example function: initializeKeyboardShortcuts() sets up event listeners for keyboard events and handles different shortcuts accordingly​​.
Main Script (main.js):

Coordinates the loading of data, initialization of the network, and setup of interactive features.
Example flow: Loads data using loadGraphData, processes the data into a D3 hierarchy, assigns colors, and sets up the network with interactive handlers​​.
Key Features:
Interactive Network Visualization: Nodes and links are dynamically rendered based on hierarchical data, with color-coding for different groups.
Legend: Displays color-coding information for different node groups.
Node and Link Highlighting: Clicking a node highlights it and its connections.
Keyboard Shortcuts: Various shortcuts to interact with the network, such as adding branches, cycling colors, and rearranging branches.
Settings and Shortcuts Pane: Togglable panes for displaying keyboard shortcuts and network settings.
This project combines D3.js for data visualization, JavaScript for interactive functionalities, and CSS for styling to create a comprehensive tool for visualizing hierarchical data.

### File Structure
├── index.html = This file contains the main HTML structure and includes the necessary scripts and styles.
├── styles.css = Contains the CSS styles for the visualization.
├── scripts/ = 
│   ├── main.js = The main entry point that initializes the visualization, loads data, and sets up the network.
│   ├── colorUtils.js = Contains functions related to color generation and manipulation.
│   ├── networkSetup.js = Sets up the network visualization and includes functions for manipulating nodes and edges.
│   ├── eventHandlers.js = Contains event handler functions for interactions like highlighting connected nodes.
│   ├── keyboardInput.js = 
│   ├── dataLoader.js = Handles data loading.
├── graph_data.json


### Example JSON Structure
´´´
{
    "name": "Root",
    "children": [
        { 
            "name": "Child 1",
            "children": [
                { "name": "Grandchild 1.1" },
                { "name": "Grandchild 1.2" }
            ]
        },
        { "name": "Child 2" }
    ]
}
´´´