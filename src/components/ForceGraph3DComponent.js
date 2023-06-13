import ForceGraph3D  from 'react-force-graph-3d';
import graphData from "../data_source/output.json"

const ForceGraph3DComponent =({selectedId})=> { 
   // Assuming your JSON data is stored in a variable called 'graphData'
    var selectedNode = graphData.nodes.find((node) => String(node.id) === selectedId);
    
    if (!selectedNode) {
     return <p>Node with selected ID not found.</p>;
     // You can customize the error message or UI as per your needs
    }
  
  // var filteredLinks = graphData.links.filter(
  //   (link) => String(link.source) === selectedId
  // );
  var filteredLinks = [];
  for (var i = 0; i < graphData.links.length; i++) {
    var link = graphData.links[i];
    if (String(link.source) === selectedId) {
      filteredLinks.push(link);
    }
  }

  var requiredNodeIds = [
    selectedId,
    ...filteredLinks.map((link) => String(link.target)),
  ];

  var filteredNodes = graphData.nodes.filter((node) =>
    requiredNodeIds.includes(String(node.id))
  );

  var filteredData={
    nodes: filteredNodes,
    links: filteredLinks
  }
  
  
  return (
    <div>
        <ForceGraph3D  graphData={filteredData} linkWidth={1}
        onNodeDragEnd={node=>{
        node.fx=node.x;
        node.fy=node.y;
        node.fz=node.z;
      }}/>
    </div>
  
  
  );
}

export default ForceGraph3DComponent;
