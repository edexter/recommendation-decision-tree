import { useEffect, useRef } from 'react';
import DecisionNode from './DecisionNode';
import InfoNode from './InfoNode';
import ConnectionLine from './ConnectionLine';
import PhaseHeader from './PhaseHeader';
import BranchConnector from './BranchConnector';
import FeatureMenu from './FeatureMenu';

export default function DecisionTree({ treeData, flowState, onChoice }) {
  const currentNodeRef = useRef(null);

  // Auto-scroll to current node
  useEffect(() => {
    if (currentNodeRef.current) {
      currentNodeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [flowState.currentNodeId]);

  const renderNode = (node, state, level = 1) => {
    const isCurrentNode = node.id === flowState.currentNodeId;
    const selectedChoice = flowState.choices[node.id];

    const nodeElement = node.type === 'decision' ? (
      <DecisionNode
        key={node.id}
        node={node}
        state={state}
        onChoice={onChoice}
        selectedChoice={selectedChoice}
        level={level}
      />
    ) : (
      <InfoNode
        key={node.id}
        node={node}
        state={state}
        onContinue={onChoice}
        level={level}
      />
    );

    return (
      <div key={node.id} ref={isCurrentNode ? currentNodeRef : null}>
        {nodeElement}
      </div>
    );
  };

  // Build rows of the tree - each row is always 2 columns (50% width each)
  const buildTreeRows = (startNodeId, phase) => {
    const rows = [];

    const getNode = (nodeId) => {
      if (!nodeId) return null;
      return treeData.nodes.find(n => n.id === nodeId && n.phase === phase.id);
    };

    // Row 0: Just the root node (centered, full width)
    const rootNode = getNode(startNodeId);
    if (!rootNode) return rows;

    rows.push({
      type: 'single',
      nodes: [rootNode]
    });

    // Get children of root
    const rootChoice = flowState.choices[rootNode.id];
    if (!rootChoice || rootNode.type !== 'decision') {
      return rows;
    }

    // Row 1: Root's two children (2 columns)
    const rootChildren = [];
    Object.entries(rootNode.options).forEach(([choiceLabel, nextNodeId]) => {
      if (nextNodeId) {
        const childNode = getNode(nextNodeId);
        if (childNode) {
          rootChildren.push({
            node: childNode,
            choiceLabel,
            parentChoice: rootChoice,
            parentNode: rootNode
          });
        }
      } else if (choiceLabel === 'NO' && rootNode.crossBranchLink) {
        const childNode = getNode(rootNode.crossBranchLink.targetId);
        if (childNode) {
          rootChildren.push({
            node: childNode,
            choiceLabel: rootNode.crossBranchLink.label,
            parentChoice: rootChoice,
            parentNode: rootNode,
            isCrossBranch: true
          });
        }
      }
    });

    if (rootChildren.length > 0) {
      rows.push({
        type: 'split',
        nodes: rootChildren
      });
    }

    // Continue building rows: check if either child has made a choice
    let currentRowNodes = rootChildren;

    while (currentRowNodes.length > 0) {
      // Find which node (if any) has a choice and has decision children
      let nextRowParent = null;
      let parentColumnIndex = -1;

      for (let i = 0; i < currentRowNodes.length; i++) {
        const item = currentRowNodes[i];
        const choice = flowState.choices[item.node.id];
        if (choice && item.node.type === 'decision') {
          nextRowParent = item;
          parentColumnIndex = i; // 0 = left column, 1 = right column
          break;
        }
      }

      if (!nextRowParent) break;

      // Get children of the node that made a choice
      const children = [];
      Object.entries(nextRowParent.node.options).forEach(([choiceLabel, nextNodeId]) => {
        if (nextNodeId) {
          const childNode = getNode(nextNodeId);
          if (childNode) {
            children.push({
              node: childNode,
              choiceLabel,
              parentChoice: flowState.choices[nextRowParent.node.id],
              parentNode: nextRowParent.node
            });
          }
        } else if (choiceLabel === 'NO' && nextRowParent.node.crossBranchLink) {
          const childNode = getNode(nextRowParent.node.crossBranchLink.targetId);
          if (childNode) {
            children.push({
              node: childNode,
              choiceLabel: nextRowParent.node.crossBranchLink.label,
              parentChoice: flowState.choices[nextRowParent.node.id],
              parentNode: nextRowParent.node,
              isCrossBranch: true
            });
          }
        }
      });

      if (children.length > 0) {
        rows.push({
          type: 'split',
          nodes: children,
          parentColumn: parentColumnIndex // Track which column the parent is in
        });
        currentRowNodes = children;
      } else {
        break;
      }
    }

    return rows;
  };

  const renderPhase = (phase) => {
    // Check if this is a menu-type phase
    if (phase.type === 'menu') {
      // Only render if we're on this phase OR if it's a completed phase
      const isCurrentPhase = flowState.currentPhase === phase.id;
      const isCompletedPhase = flowState.currentPhase > phase.id;

      if (!isCurrentPhase && !isCompletedPhase) {
        return null;
      }

      return (
        <div key={phase.id} className="mb-20">
          <PhaseHeader
            phase={phase}
            currentPhase={flowState.currentPhase}
            totalPhases={treeData.phases.length}
          />
          <FeatureMenu
            phase={phase}
            selections={flowState.menuSelections || {}}
            onToggle={(optionId, value) => onChoice(optionId, value)}
            isCompleted={isCompletedPhase}
          />
        </div>
      );
    }

    // Otherwise, render as decision tree
    const phaseNodes = treeData.nodes.filter(n => n.phase === phase.id);
    const visitedInPhase = phaseNodes.filter(n => flowState.visitedPath.includes(n.id));

    if (visitedInPhase.length === 0) {
      return null;
    }

    const rows = buildTreeRows(phase.startNode, phase);

    // Check if this is Phase 3 and if we've reached the end of a branch
    // The completion box should show when there are no more children to reveal
    const isPhase3 = phase.id === 3;
    const currentNode = treeData.nodes.find(n => n.id === flowState.currentNodeId);

    // Find the last node in the current visible path for this phase
    const lastVisibleNode = rows.length > 0 ? rows[rows.length - 1] : null;
    let lastNodeInPath = null;

    if (lastVisibleNode) {
      if (lastVisibleNode.type === 'single') {
        lastNodeInPath = lastVisibleNode.nodes[0];
      } else if (lastVisibleNode.type === 'split') {
        // Find which node in the split row is on the selected path
        const selectedNode = lastVisibleNode.nodes.find(item =>
          item.parentChoice === item.choiceLabel
        );
        lastNodeInPath = selectedNode ? selectedNode.node : null;
      }
    }

    // Show completion box if:
    // 1. We're in Phase 3
    // 2. The last visible node has no more children (next === null OR it's an info node whose next isn't revealed yet)
    let isTerminal = false;
    if (isPhase3 && lastNodeInPath) {
      if (lastNodeInPath.next === null) {
        // Explicit terminal node
        isTerminal = true;
      } else if (lastNodeInPath.type === 'info') {
        // Info node with a next - the next node should not be in the current rows
        const nextNodeId = lastNodeInPath.next;
        const nextNodeInRows = rows.some(row =>
          (row.type === 'single' && row.nodes[0].id === nextNodeId) ||
          (row.type === 'split' && row.nodes.some(item => item.node.id === nextNodeId))
        );
        isTerminal = !nextNodeInRows;
      }
    }

    return (
      <div key={phase.id} className="mb-20">
        <PhaseHeader
          phase={phase}
          currentPhase={flowState.currentPhase}
          totalPhases={treeData.phases.length}
        />

        <div className="flex flex-col items-center w-full space-y-8">
          {rows.map((row, rowIdx) => {
            if (row.type === 'single') {
              // Root node - centered, full width
              const node = row.nodes[0];
              const state = flowState.getNodeState(node.id);

              return (
                <div key={rowIdx} className="w-full flex justify-center">
                  {renderNode(node, state, 1)}
                </div>
              );
            } else {
              // Split row - always 2 columns at 50% width each
              const hasParentColumn = row.parentColumn !== undefined;
              const anySelected = row.nodes.some(item => item.parentChoice === item.choiceLabel);

              return (
                <div key={rowIdx} className="w-full">
                  {/* Show branching connector if this row has a parent in a specific column */}
                  {hasParentColumn && (
                    <BranchConnector parentColumn={row.parentColumn} isActive={anySelected} />
                  )}

                  <div className="grid grid-cols-2 gap-8">
                    {row.nodes.map((item, colIdx) => {
                      const { node, choiceLabel, parentChoice, parentNode } = item;
                      const isVisited = flowState.visitedPath.includes(node.id);
                      const isSelectedPath = parentChoice === choiceLabel;
                      const state = isSelectedPath && isVisited ? flowState.getNodeState(node.id) : 'future';

                      return (
                        <div key={colIdx} className="flex flex-col items-center">
                          {/* Only show connection line label if no branching connector */}
                          {!hasParentColumn && (
                            <ConnectionLine
                              isActive={isSelectedPath}
                              label={choiceLabel}
                            />
                          )}
                          {renderNode(node, state, 2)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
          })}

          {/* Show completion message if Phase 3 terminal node reached */}
          {isTerminal && (
            <div className="mt-12 w-full max-w-2xl relative z-50">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-6 shadow-lg text-center">
                <div className="text-2xl font-bold mb-2">✓ Decision Tree Complete</div>
                <div className="text-green-50 mb-4">All configuration decisions have been finalized</div>
                <button
                  onClick={() => {
                    // Generate text summary of all decisions
                    let summary = "Booth Recommendation System - Configuration Summary\n";
                    summary += "=".repeat(60) + "\n\n";

                    // Phase 1 decisions
                    summary += "PHASE 1: Core Algorithm\n";
                    summary += "-".repeat(60) + "\n";
                    treeData.phases[0] && treeData.nodes
                      .filter(n => n.phase === 1 && flowState.visitedPath.includes(n.id))
                      .forEach(node => {
                        if (node.type === 'decision' && flowState.choices[node.id]) {
                          summary += `${node.question}: ${flowState.choices[node.id]}\n`;
                        }
                      });

                    // Phase 2 menu selections
                    summary += "\nPHASE 2: Real-Time Engine Features\n";
                    summary += "-".repeat(60) + "\n";
                    const menuPhase = treeData.phases.find(p => p.type === 'menu');
                    if (menuPhase && flowState.menuSelections) {
                      menuPhase.options.forEach(opt => {
                        const value = flowState.menuSelections[opt.id];
                        summary += `${opt.question}: ${value ? 'YES' : 'NO'}\n`;
                      });
                    }

                    // Phase 3 decisions
                    summary += "\nPHASE 3: Delivery & Updates\n";
                    summary += "-".repeat(60) + "\n";
                    treeData.phases[2] && treeData.nodes
                      .filter(n => n.phase === 3 && flowState.visitedPath.includes(n.id))
                      .forEach(node => {
                        if (node.type === 'decision' && flowState.choices[node.id]) {
                          summary += `${node.question}: ${flowState.choices[node.id]}\n`;
                        }
                      });

                    summary += "\n" + "=".repeat(60) + "\n";
                    summary += `Generated: ${new Date().toLocaleString()}\n`;

                    // Download as text file
                    const blob = new Blob([summary], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'booth-recommendations-config.txt';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="px-6 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-green-50 transition-all shadow-md"
                >
                  Click here to save your decisions to a file
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 w-full">
      {treeData.phases.map(phase => renderPhase(phase))}
    </div>
  );
}
