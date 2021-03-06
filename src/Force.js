import "./App.css";
import { useEffect, useRef, useState } from "react";
import { ForceGraph3D, ForceGraph2D } from "react-force-graph";

function Force() {
    const graphRef = useRef(null);
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);

    useEffect(() => {
        fetch(
        "https://raw.githubusercontent.com/RochaSamuel/data-visualization-force-graph/master/data/linksv2.json"
        )
        .then((data) => data.json())
        .then((json) => setLinks(json));

        fetch(
        "https://raw.githubusercontent.com/RochaSamuel/data-visualization-force-graph/master/data/nodesv2.json"
        )
        .then((data) => data.json())
        .then((json) => setNodes(json));
    }, []);

    const handleNodeClick = (node) => {
        const distance = 40;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

        graphRef.current.cameraPosition(
            {
            x: node.x * distRatio,
            y: node.y * distRatio,
            z: node.z * distRatio,
            }, // new position
            node, // lookAt ({ x, y, z })
            3000
        );
    }

    return (
        <div className="Graph">
        <ForceGraph3D
            ref={graphRef}
            graphData={{ nodes: nodes, links: links }}
            nodeLabel={"id"}
            linkLabel={(link) => `${link.protocolo}`}
            nodeAutoColorBy={"assunto"}
            linkDirectionalArrowLength={3}
            onNodeClick={ handleNodeClick }
        />
        </div>
    );
}

export default Force;
