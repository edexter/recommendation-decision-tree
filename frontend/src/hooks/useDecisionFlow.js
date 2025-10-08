import { useState, useEffect } from 'react';

export const useDecisionFlow = (treeData) => {
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [visitedPath, setVisitedPath] = useState([]);
  const [choices, setChoices] = useState({});
  const [menuSelections, setMenuSelections] = useState({});
  const [currentPhase, setCurrentPhase] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  // Initialize with first phase's start node
  useEffect(() => {
    if (treeData?.phases?.length > 0) {
      const firstPhase = treeData.phases[0];
      setCurrentNodeId(firstPhase.startNode);
      setVisitedPath([firstPhase.startNode]);
    }
  }, [treeData]);

  const getNode = (nodeId) => {
    return treeData?.nodes?.find(n => n.id === nodeId);
  };

  const makeChoice = (nodeId, choice) => {
    // Handle menu selections (for menu-type phases)
    if (nodeId === '__continue__') {
      // Move to next phase
      const nextPhase = currentPhase + 1;
      if (nextPhase <= treeData.phases.length) {
        const phase = treeData.phases[nextPhase - 1];
        setCurrentPhase(nextPhase);
        if (phase.type === 'menu') {
          // Menu phase doesn't use nodes
          setCurrentNodeId(null);
        } else {
          setCurrentNodeId(phase.startNode);
          setVisitedPath(prev => {
            if (!prev.includes(phase.startNode)) {
              return [...prev, phase.startNode];
            }
            return prev;
          });
        }
      } else {
        setIsComplete(true);
        setCurrentNodeId(null);
      }
      return;
    }

    // Check if current phase is a menu
    const currentPhaseData = treeData.phases.find(p => p.id === currentPhase);
    if (currentPhaseData?.type === 'menu') {
      // Handle menu option toggle
      setMenuSelections(prev => ({ ...prev, [nodeId]: choice }));
      return;
    }

    const node = getNode(nodeId);
    if (!node) return;

    // Check if this is a change to a previous choice
    const isChangingPreviousChoice = choices[nodeId] && choices[nodeId] !== choice;

    if (isChangingPreviousChoice) {
      // Clear all choices and visited path after this node
      const nodeIndex = visitedPath.indexOf(nodeId);
      const newVisitedPath = visitedPath.slice(0, nodeIndex + 1);

      // Clear choices for nodes after this one
      const newChoices = {};
      newVisitedPath.forEach(id => {
        if (choices[id]) {
          newChoices[id] = choices[id];
        }
      });

      setVisitedPath(newVisitedPath);
      setChoices(newChoices);
      setCurrentNodeId(nodeId);
      setIsComplete(false);
    }

    // Record the choice
    setChoices(prev => ({ ...prev, [nodeId]: choice }));

    // Determine next node
    let nextNodeId = null;

    if (node.type === 'decision') {
      nextNodeId = node.options[choice];

      // Check if this is a cross-branch link (NO path with crossBranchLink)
      if (!nextNodeId && node.crossBranchLink && choice === 'NO') {
        nextNodeId = node.crossBranchLink.targetId;
      }
    } else if (node.type === 'info') {
      nextNodeId = node.next;
    }

    // Update visited path
    if (nextNodeId) {
      setVisitedPath(prev => {
        // Only add if not already in path
        if (!prev.includes(nextNodeId)) {
          return [...prev, nextNodeId];
        }
        return prev;
      });
      setCurrentNodeId(nextNodeId);
    } else {
      // End of current phase
      const nextPhase = currentPhase + 1;
      if (nextPhase <= treeData.phases.length) {
        const phase = treeData.phases[nextPhase - 1];
        setCurrentPhase(nextPhase);
        setCurrentNodeId(phase.startNode);
        setVisitedPath(prev => {
          if (!prev.includes(phase.startNode)) {
            return [...prev, phase.startNode];
          }
          return prev;
        });
      } else {
        // All phases complete
        setIsComplete(true);
        setCurrentNodeId(null);
      }
    }
  };

  const reset = () => {
    const firstPhase = treeData.phases[0];
    setCurrentNodeId(firstPhase.startNode);
    setVisitedPath([firstPhase.startNode]);
    setChoices({});
    setCurrentPhase(1);
    setIsComplete(false);
  };

  const getNodeState = (nodeId) => {
    if (visitedPath.includes(nodeId)) {
      if (nodeId === currentNodeId) {
        return 'current';
      }
      return 'visited';
    }
    return 'future';
  };

  const isOnActivePath = (nodeId) => {
    return visitedPath.includes(nodeId);
  };

  return {
    currentNodeId,
    visitedPath,
    choices,
    menuSelections,
    currentPhase,
    isComplete,
    makeChoice,
    reset,
    getNode,
    getNodeState,
    isOnActivePath,
  };
};
