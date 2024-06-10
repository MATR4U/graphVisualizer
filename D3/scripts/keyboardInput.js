export function initializeKeyboardShortcuts() {
  document.addEventListener('keydown', (event) => {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
    switch (event.code) {
      case 'Tab':
        if (event.shiftKey) {
          navigateBetweenBranches('ArrowUp');
        } else {
          const selectedNode = d3.select(".selected").data()[0];
          if (selectedNode) addNewChildBranch(selectedNode);
        }
        event.preventDefault();
        break;
      case 'Enter':
        if (event.ctrlKey) {
          const selectedNode = d3.select(".selected").data()[0];
          if (selectedNode) createNewLineOfText(selectedNode);
        } else if (event.shiftKey) {
          const selectedNode = d3.select(".selected").data()[0];
          if (selectedNode) addNewSiblingBranch(selectedNode);
        }
        event.preventDefault();
        break;
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        if (event.ctrlKey && event.altKey && event.shiftKey) {
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
          event.preventDefault();
        }
        break;
      case 'Minus':
      case 'NumpadSubtract':
        if (event.ctrlKey) {
          event.preventDefault();
        }
        break;
      case 'Digit0':
      case 'Numpad0':
        if (event.ctrlKey) {
          event.preventDefault();
        }
        break;
      case 'Backspace':
        break;
      case 'KeyR':
        if (event.ctrlKey && event.altKey && event.shiftKey) {
          rearrangeBranches();
          event.preventDefault();
        }
        break;
      case 'KeyC':
        if (event.ctrlKey && event.altKey) {
          const selectedNode = d3.select(".selected").data()[0];
          if (selectedNode) cycleColor(selectedNode.data.id);
          event.preventDefault();
        }
        break;
      case 'KeyS':
        if (event.ctrlKey && event.altKey) {
          const selectedNode = d3.select(".selected").data()[0];
          if (selectedNode) cycleShape(selectedNode.data.id);
          event.preventDefault();
        }
        break;
      case 'KeyT':
        if (event.ctrlKey && event.altKey) {
          const selectedNode = d3.select(".selected").data()[0];
          if (selectedNode) cycleLineThickness(selectedNode.data.id);
          event.preventDefault();
        }
        break;
      case 'KeyL':
        if (event.ctrlKey && event.altKey) {
          const selectedNode = d3.select(".selected").data()[0];
          if (selectedNode) toggleLineStraightCurved(selectedNode.data.id);
          event.preventDefault();
        }
        break;
      case 'KeyD':
        if (event.ctrlKey && event.altKey) {
          const selectedNode = d3.select(".selected").data()[0];
          if (selectedNode) toggleLineDashedSolid(selectedNode.data.id);
          event.preventDefault();
        }
        break;
    }
  });
}
