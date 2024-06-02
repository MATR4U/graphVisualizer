document.getElementById('toggleShortcutPane').addEventListener('click', () => {
    const pane = document.getElementById('shortcutPane');
    if (pane.classList.contains('visible')) {
        pane.classList.remove('visible');
        document.getElementById('toggleShortcutPane').innerText = 'Show Shortcuts';
    } else {
        pane.classList.add('visible');
        document.getElementById('toggleShortcutPane').innerText = 'Hide Shortcuts';
    }
});

document.getElementById('toggleSettingsPane').addEventListener('click', () => {
    const pane = document.getElementById('settingsPane');
    if (pane.classList.contains('visible')) {
        pane.classList.remove('visible');
        document.getElementById('toggleSettingsPane').innerText = 'Settings';
    } else {
        pane.classList.add('visible');
        document.getElementById('toggleSettingsPane').innerText = 'Hide Settings';
    }
});

// Bind keyboard shortcuts to functions
document.addEventListener('keydown', (event) => {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
    switch (event.code) {
        case 'Tab':
            if (event.shiftKey) {
                // Move back to the parent branch
                navigateBetweenBranches('ArrowUp');
            } else {
                // Create a new child branch
                const selectedNode = network.getSelectedNodes()[0];
                if (selectedNode) addNewChildBranch(selectedNode);
            }
            event.preventDefault();
            break;
        case 'Enter':
            if (event.ctrlKey) {
                // Create new line of text inside the existing branch
                const selectedNode = network.getSelectedNodes()[0];
                if (selectedNode) createNewLineOfText(selectedNode);
            } else if (event.shiftKey) {
                // Create a new sibling branch
                const selectedNode = network.getSelectedNodes()[0];
                if (selectedNode) addNewSiblingBranch(selectedNode);
            }
            event.preventDefault();
            break;
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
            if (event.ctrlKey && event.altKey && event.shiftKey) {
                // Navigate between items
                navigateBetweenBranches(event.code);
            }
            break;
        case 'KeyZ':
            if (event.ctrlKey) {
                if (event.shiftKey) {
                    redo();
                } else {
                    undo();
                }
                event.preventDefault();
            }
            break;
        case 'Equal':
        case 'NumpadAdd':
            if (event.ctrlKey) {
                // Increase text size or zoom in
                event.preventDefault();
            }
            break;
        case 'Minus':
        case 'NumpadSubtract':
            if (event.ctrlKey) {
                // Decrease text size or zoom out
                event.preventDefault();
            }
            break;
        case 'Digit0':
        case 'Numpad0':
            if (event.ctrlKey) {
                // Reset text size or zoom to default
                event.preventDefault();
            }
            break;
        case 'Backspace':
            // Double-tap backspace to remove an empty item with no children
            break;
        case 'KeyR':
            if (event.ctrlKey && event.altKey && event.shiftKey) {
                // Re-arrange all branches in the diagram
                rearrangeBranches();
                event.preventDefault();
            }
            break;
        case 'KeyC':
            if (event.ctrlKey && event.altKey) {
                // Cycle color
                const selectedNode = network.getSelectedNodes()[0];
                if (selectedNode) cycleColor(selectedNode);
                event.preventDefault();
            }
            break;
        case 'KeyS':
            if (event.ctrlKey && event.altKey) {
                // Cycle shape
                const selectedNode = network.getSelectedNodes()[0];
                if (selectedNode) cycleShape(selectedNode);
                event.preventDefault();
            }
            break;
        case 'KeyT':
            if (event.ctrlKey && event.altKey) {
                // Cycle line thickness
                const selectedNode = network.getSelectedNodes()[0];
                if (selectedNode) cycleLineThickness(selectedNode);
                event.preventDefault();
            }
            break;
        case 'KeyL':
            if (event.ctrlKey && event.altKey) {
                // Toggle line straight/curved
                const selectedNode = network.getSelectedNodes()[0];
                if (selectedNode) toggleLineStraightCurved(selectedNode);
                event.preventDefault();
            }
            break;
        case 'KeyD':
            if (event.ctrlKey && event.altKey) {
                // Toggle line dashed/solid
                const selectedNode = network.getSelectedNodes()[0];
                if (selectedNode) toggleLineDashedSolid(selectedNode);
                event.preventDefault();
            }
            break;
    }
});

// Mouse + keyboard shortcuts
document.addEventListener('click', (event) => {
    if (event.ctrlKey && event.target.matches('.vis-button')) {
        // Remove branch on [ctrl] + click on (+) button
        const nodeId = network.getNodeAt({ x: event.clientX, y: event.clientY });
        if (nodeId) removeBranch(nodeId);
    } else if (event.shiftKey && event.target.matches('.vis-button')) {
        // Insert new parent above branch on [shift] + click on (+) button
        const nodeId = network.getNodeAt({ x: event.clientX, y: event.clientY });
        if (nodeId) insertParentBranch(nodeId);
    } else if (event.ctrlKey && event.shiftKey && event.target.matches('.vis-button')) {
        // Remove branch without removing its children on [ctrl] + [shift] + click on (+) button
        const nodeId = network.getNodeAt({ x: event.clientX, y: event.clientY });
        if (nodeId) removeBranchKeepChildren(nodeId);
    }
});

// Drag + keyboard shortcuts
document.addEventListener('dragstart', (event) => {
    if (event.shiftKey) {
        // Transplant item to a different parent
    }
    if (event.ctrlKey) {
        // Snap to a grid as you move the item
    }
});

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

// Helper functions for navigation (to be implemented)
const getParentNode = (nodeId) => {
    const parentEdge = edges.get({ filter: edge => edge.to === nodeId })[0];
    return parentEdge ? parentEdge.from : null;
};

const getChildNode = (nodeId) => {
    const childEdge = edges.get({ filter: edge => edge.from === nodeId })[0];
    return childEdge ? childEdge.to : null;
};

const getSiblingNode = (nodeId, direction) => {
    const parentEdge = edges.get({ filter: edge => edge.to === nodeId })[0];
    if (!parentEdge) return null;

    const siblings = edges.get({ filter: edge => edge.from === parentEdge.from }).map(edge => edge.to);
    const currentIndex = siblings.indexOf(nodeId);
    if (direction === 'left' && currentIndex > 0) {
        return siblings[currentIndex - 1];
    } else if (direction === 'right' && currentIndex < siblings.length - 1) {
        return siblings[currentIndex + 1];
    }
    return null;
};

// Function to handle undo action
const undo = () => {
    if (undoStack.length > 0) {
        const action = undoStack.pop();
        redoStack.push(action);
        // Perform undo action
    }
};

// Function to handle redo action
const redo = () => {
    if (redoStack.length > 0) {
        const action = redoStack.pop();
        undoStack.push(action);
        // Perform redo action
    }
};

// Function to add a new child branch
const addNewChildBranch = (parentId) => {
    const newNodeId = nodes.length + 1; // Or use a better unique id generator
    const newNode = {
        id: newNodeId,
        label: 'New Node'
    };
    nodes.add(newNode);
    edges.add({ from: parentId, to: newNode.id });
    undoStack.push({ action: 'add', node: newNode, edge: { from: parentId, to: newNode.id } });
};

// Function to add a new sibling branch
const addNewSiblingBranch = (currentId) => {
    const parentEdge = edges.get({ filter: edge => edge.to === currentId })[0];
    if (parentEdge) {
        addNewChildBranch(parentEdge.from);
    }
};

// Function to create a new line of text inside the existing branch
const createNewLineOfText = (currentId) => {
    const node = nodes.get(currentId);
    node.label += '\nNew line';
    nodes.update(node);
    undoStack.push({ action: 'update', node });
};

// Function to navigate between branches
const navigateBetweenBranches = (direction) => {
    const selectedNode = network.getSelectedNodes()[0];
    if (!selectedNode) return;

    let nextNode;
    switch (direction) {
        case 'ArrowUp':
            nextNode = getParentNode(selectedNode);
            break;
        case 'ArrowDown':
            nextNode = getChildNode(selectedNode);
            break;
        case 'ArrowLeft':
            nextNode = getSiblingNode(selectedNode, 'left');
            break;
        case 'ArrowRight':
            nextNode = getSiblingNode(selectedNode, 'right');
            break;
    }
    if (nextNode) network.selectNodes([nextNode]);
};
