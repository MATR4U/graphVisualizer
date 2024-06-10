import { KEY_CODES } from './constants.js';

export function initializeKeyboardShortcuts() {
  document.addEventListener('keydown', handleKeyDown);
}

function handleKeyDown(event) {
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;

  const selectedNode = d3.select(".selected").data()[0];

  switch (event.code) {
    case KEY_CODES.TAB:
      handleTab(event, selectedNode);
      break;
    case KEY_CODES.ENTER:
      handleEnter(event, selectedNode);
      break;
    case KEY_CODES.ARROW_UP:
    case KEY_CODES.ARROW_DOWN:
    case KEY_CODES.ARROW_LEFT:
    case KEY_CODES.ARROW_RIGHT:
      handleArrowKeys(event);
      break;
    case KEY_CODES.KEY_Z:
      handleUndoRedo(event);
      break;
    case KEY_CODES.EQUAL:
    case KEY_CODES.NUMPAD_ADD:
    case KEY_CODES.MINUS:
    case KEY_CODES.NUMPAD_SUBTRACT:
    case KEY_CODES.DIGIT_0:
    case KEY_CODES.NUMPAD_0:
      handleZoom(event);
      break;
    case KEY_CODES.BACKSPACE:
      // Handle backspace if needed
      break;
    case KEY_CODES.KEY_R:
      handleRearrange(event);
      break;
    case KEY_CODES.KEY_C:
      handleCycleColor(event, selectedNode);
      break;
    case KEY_CODES.KEY_S:
      handleCycleShape(event, selectedNode);
      break;
    case KEY_CODES.KEY_T:
      handleCycleLineThickness(event, selectedNode);
      break;
    case KEY_CODES.KEY_L:
      handleToggleLineStraightCurved(event, selectedNode);
      break;
    case KEY_CODES.KEY_D:
      handleToggleLineDashedSolid(event, selectedNode);
      break;
  }
}

function handleTab(event, selectedNode) {
  if (event.shiftKey) {
    navigateBetweenBranches('ArrowUp');
  } else if (selectedNode) {
    addNewChildBranch(selectedNode);
  }
  event.preventDefault();
}

function handleEnter(event, selectedNode) {
  if (event.ctrlKey && selectedNode) {
    createNewLineOfText(selectedNode);
  } else if (event.shiftKey && selectedNode) {
    addNewSiblingBranch(selectedNode);
  }
  event.preventDefault();
}

function handleArrowKeys(event) {
  if (event.ctrlKey && event.altKey && event.shiftKey) {
    navigateBetweenBranches(event.code);
  }
}

function handleUndoRedo(event) {
  if (event.ctrlKey) {
    if (event.shiftKey) {
      redo();
    } else {
      undo();
    }
    event.preventDefault();
  }
}

function handleZoom(event) {
  if (event.ctrlKey) {
    event.preventDefault();
  }
}

function handleRearrange(event) {
  if (event.ctrlKey && event.altKey && event.shiftKey) {
    rearrangeBranches();
    event.preventDefault();
  }
}

function handleCycleColor(event, selectedNode) {
  if (event.ctrlKey && event.altKey && selectedNode) {
    cycleColor(selectedNode.data.id);
    event.preventDefault();
  }
}

function handleCycleShape(event, selectedNode) {
  if (event.ctrlKey && event.altKey && selectedNode) {
    cycleShape(selectedNode.data.id);
    event.preventDefault();
  }
}

function handleCycleLineThickness(event, selectedNode) {
  if (event.ctrlKey && event.altKey && selectedNode) {
    cycleLineThickness(selectedNode.data.id);
    event.preventDefault();
  }
}

function handleToggleLineStraightCurved(event, selectedNode) {
  if (event.ctrlKey && event.altKey && selectedNode) {
    toggleLineStraightCurved(selectedNode.data.id);
    event.preventDefault();
  }
}

function handleToggleLineDashedSolid(event, selectedNode) {
  if (event.ctrlKey && event.altKey && selectedNode) {
    toggleLineDashedSolid(selectedNode.data.id);
    event.preventDefault();
  }
}