import ForceGraph3D  from 'react-force-graph-3d';
import React, { useState, useMemo,useCallback } from 'react';
const ExpandableGraph = ({ graphData }) => {
    const rootId = "0";

    const nodesById = useMemo(() => {
      const nodesById = Object.fromEntries(graphData.nodes.map(node => [node.id, node]));

      // link parent/children
      graphData.nodes.forEach(node => {
        node.collapsed = node.id !== rootId;
        node.childLinks = [];
      });
      graphData.links.forEach(link => nodesById[link.source].childLinks.push(link));

      return nodesById;
    }, [graphData]);

    const getPrunedTree = useCallback(() => {
      const visibleNodes = [];
      const visibleLinks = [];
      (function traverseTree(node = nodesById[rootId]) {
        visibleNodes.push(node);
        if (node.collapsed) return;
        visibleLinks.push(...node.childLinks);
        node.childLinks
          .map(link => ((typeof link.target) === 'object') ? link.target : nodesById[link.target]) // get child node
          .forEach(traverseTree);
      })();

      return { nodes: visibleNodes, links: visibleLinks };
    }, [nodesById]);

    const [prunedTree, setPrunedTree] = useState(getPrunedTree());

    const handleNodeClick = useCallback(node => {
      node.collapsed = !node.collapsed; // toggle collapse state
      setPrunedTree(getPrunedTree())
    }, []);

    return <ForceGraph3D
      graphData={prunedTree}
      onNodeDragEnd={node=>{
        node.fx=node.x;
        node.fy=node.y;
        node.fz=node.z;}}
      onNodeClick={handleNodeClick}
    />;
  };

export default ExpandableGraph;