import React, { useState, useMemo, useCallback} from 'react';
import ForceGraph3D  from 'react-force-graph-3d';
import data from "./data_source/output.json"

const App = () => {
  const [graphData, setGraphData] = useState(data);
  const [filteredData, setFilteredData] = useState(JSON.parse(JSON.stringify(graphData)));
  const [selectedId, setSelectedId] = useState('0');
  const [temp,setTemp]=useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setUploadedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const contents = reader.result;
        const jsonData = JSON.parse(contents);
        setGraphData(jsonData);
        setFilteredData(JSON.parse(JSON.stringify(jsonData)));
      };
      reader.readAsText(file);
    };
  };

  const handleSearch = () => {
    setSelectedId(temp);
    setFilteredData(JSON.parse(JSON.stringify(graphData)))
  };

  const nodesById = useMemo(() => {
    const nodesById = {};
    filteredData.nodes.forEach(node => {
      nodesById[node.id] = { ...node, collapsed: node.id !== selectedId, childLinks: [] };
    });
    filteredData.links.forEach(link => {
      nodesById[link.source].childLinks.push(link);
    });
    return nodesById;
    // eslint-disable-next-line
  }, [filteredData]);

  const getPrunedTree = useCallback(() => {
    const visibleNodes = [];
    const visibleLinks = [];
    const traverseTree = (node) => {
      visibleNodes.push(node);
      if (node.collapsed) return;
      visibleLinks.push(...node.childLinks);
      node.childLinks.forEach(link => {
        const childNode = typeof link.target === 'object' ? link.target : nodesById[link.target];
        traverseTree(childNode);
      });
    };
    traverseTree(nodesById[selectedId]);
    return { nodes: visibleNodes, links: visibleLinks };
    // eslint-disable-next-line
  }, [nodesById]);

  const [prunedTree, setPrunedTree] = useState(getPrunedTree());

  const handleNodeClick = useCallback(node => {
    node.collapsed = !node.collapsed;
    setPrunedTree(getPrunedTree());
  }, [getPrunedTree]);
  
  return (
    <div>
      <div>
        <input type="file" accept=".json" onChange={handleFileUpload} />
        {uploadedFile && <span>File uploaded: {uploadedFile.name}</span>}
        <input
        type="text"
        value={temp}
        onChange={(e) => setTemp(e.target.value)}
        placeholder="Search.."
        />
      <button onClick={handleSearch}>Search</button>
      </div>
        <ForceGraph3D
        graphData={prunedTree}
        onNodeClick={handleNodeClick}
        nodeLabel={node=>node.id}
        onNodeDragEnd={node => {
          node.fx = node.x;
          node.fy = node.y;
          node.fz = node.z;
        }}
        />
    </div>
  );
};

export default App;

