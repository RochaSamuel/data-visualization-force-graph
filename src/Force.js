import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import { ForceGraph3D, ForceGraph2D } from "react-force-graph";
import Search from "./components/Search";
import AssuntoFilter from "./components/AssuntoFilter";

function Force() {
    const graphRef = useRef(null);
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);

    const [secureLinks, setSecureLinks] = useState([])
    const [secureNodes, setSecureNodes] = useState([])

    const [filteredTemp, setFilteredTemp] = useState([])

    const [dataShouldBeUpdated, setDataShouldBeUpdated] = useState(false);
    const [assuntoFilter, setAssuntoFilter] = useState([]);

    const [openFilteredResults, setOpenFilteredResults] = useState(false);

    useEffect(() => {
        fetch(
        "https://raw.githubusercontent.com/RochaSamuel/data-visualization-force-graph/master/linksv2.json"
        )
        .then((data) => data.json())
        .then((json) => {
            setLinks(json)
            setSecureLinks(json)
        });

        fetch(
        "https://raw.githubusercontent.com/RochaSamuel/data-visualization-force-graph/master/nodesv2.json"
        )
        .then((data) => data.json())
        .then((json) => {
            setNodes(json)
            setSecureNodes(json)
        });
    }, []);

    useEffect(() => {
        let filteredNodes
        let filteredLinks
        if(assuntoFilter.length > 0) {
            filteredNodes = secureNodes.filter(node => assuntoFilter.includes(node.assunto));
            filteredLinks = secureLinks.filter(link => [...filteredNodes.map(node => node.id)].includes(link.source.id) && [...filteredNodes.map(node => node.id)].includes(link.target.id))
        } else {
            filteredLinks = secureLinks;
            filteredNodes = secureNodes;
        }
        // setNodes(filteredNodes);
        // setLinks(filteredLinks);
        setFilteredTemp({nodes: filteredNodes, links: filteredLinks})
        setOpenFilteredResults(true);
        setDataShouldBeUpdated(false);
    }, [dataShouldBeUpdated])

    const handleAssuntoFilter = (value) => {
        setAssuntoFilter(value)
        setDataShouldBeUpdated(true);
    }


    const renderFilteredResults = ({nodes, links}) => {
        const styles = {
            container: {overflow: 'auto',borderRadius: '10px', background: '#F2F2F2', width: '300px', padding: '15px', height: '400px', position: 'absolute', zIndex: '1', top: '260px', left: '20px'},
            button: {cursor: 'pointer', background: 'red', color: '#fff', padding: '10px', width: 'fit-content', dsplay: 'flex', alignItems: 'center', justifyContent: 'center', fontWeigth: 'bold', borderRadius: '10px', margin: '20px auto'}
        }

        return (<>
            <div style={styles.container}>
                {nodes.map(node => <div onClick={() => handleNodeClick(node)} style={{cursor: 'pointer', marginBottom: '6px'}}>{node.id}</div>)}
                <div style={styles.button} onClick={() => {
                    setNodes(nodes);
                    setLinks(links);
                }}>APLICAR FILTROS</div>
                <div style={styles.button} onClick={() => {
                    setNodes(secureNodes);
                    setLinks(secureLinks);
                }}>REVERTER</div>
            </div>
            </>
        );
    }
    
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
                onNodeClick={ handleNodeClick }
                linkDirectionalParticles={1}
                linkDirectionalParticleWidth={2}
            />
            {openFilteredResults && renderFilteredResults(filteredTemp)}
            <AssuntoFilter assuntos={[...new Set(secureNodes.map(node => node.assunto))]} applyFilter={handleAssuntoFilter}/>
            {graphRef.current && <Search nodes={nodes} graphRef={graphRef}/>}
        </div>
    );
}

export default Force;
