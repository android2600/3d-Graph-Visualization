import React, { useState,useEffect } from 'react';
import ExpandableGraph from './components/ExpandableGraph'
import data from './data_source/output.json'
import './App.css'

const App = () => {
  const [selectedId, setSelectedId] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [graphData,setGraphData]=useState(null);
  const [filteredData, setFilteredData] = useState();
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
        setUploadedFile(JSON.parse(JSON.stringify(data)));
        setGraphData(JSON.parse(JSON.stringify(data)));
  }, []);

  
  const readFileContents = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e.target.error);
      reader.readAsText(file);
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const contents = await readFileContents(file);
      const jsonData = JSON.parse(contents);
      console.log(jsonData)
      setUploadedFile(JSON.parse(JSON.stringify(jsonData)));
    }
  };
  
  const handleSearchButtonClick = () => {
    setIsSearching(true);
    setGraphData(JSON.parse(JSON.stringify(uploadedFile)))
    console.log(graphData)
    let filteredLinks = [];
    for (let i = 0; i < graphData.links.length; i++) {
      let link = graphData.links[i];
      if (String(link.source) === selectedId) {
        filteredLinks.push(link);
      }
    }
    let requiredNodeIds = [selectedId];
    for (let i = 0; i < filteredLinks.length; i++) {
      let link = filteredLinks[i];
      requiredNodeIds.push(String(link.target));
    }
  
    let filteredNodes = [];
    for (let i = 0; i < graphData.nodes.length; i++) {
      let node = graphData.nodes[i];
      if (requiredNodeIds.includes(String(node.id))) {
        filteredNodes.push(node);
      }
    }

    let updatedData = {
      nodes: filteredNodes,
      links: filteredLinks,
    };

    setFilteredData(updatedData);
    setIsSearching(false);
  };

  const handleSearchChange = (event) => {
    setSelectedId(event.target.value);
  };

  return (
    <div className="container">
      <div className="sidebar">
        <input
          type="text"
          value={selectedId}
          onChange={handleSearchChange}
          placeholder="Search..."
        />
        <button onClick={handleSearchButtonClick} disabled={isSearching}>Search</button>
        <input type="file" accept=".json" onChange={handleFileUpload} title=''/>
      </div>
      <div className="graph-container">
      <ExpandableGraph graphData={filteredData}/>
      </div>
  </div>
  );
};

export default App;
