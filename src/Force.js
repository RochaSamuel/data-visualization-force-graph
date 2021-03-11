import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import { ForceGraph3D, ForceGraph2D } from "react-force-graph";
import Search from "./components/Search";
import AutoCompleteFilter from "./components/AutoCompleteFilter";

import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

function Force() {
    const graphRef = useRef(null);
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);

    const [secureLinks, setSecureLinks] = useState([])
    const [secureNodes, setSecureNodes] = useState([])

    const [filteredTemp, setFilteredTemp] = useState([])

    const [dataShouldBeUpdated, setDataShouldBeUpdated] = useState(false);
    const [assuntoFilter, setAssuntoFilter] = useState([]);
    const [dictAssuntoFilter, setDictAssuntoFilter] = useState([]);
    const [plataformaFilter, setPlataformaFilter] = useState([]);
    const [conjuntoFilter, setConjuntoFilter] = useState([]);

    const [openFilteredResults, setOpenFilteredResults] = useState(false);
    useEffect(() => {
        fetch(
        "conns.json"
        )
        .then((data) => data.json())
        .then((json) => {
            setLinks(json)
            setSecureLinks(json)
        }, []);

        fetch(
        "nodes.json"
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
            filteredNodes = secureNodes.filter(node => node.ASSUNTO.some(n => assuntoFilter.includes(n)));
            filteredLinks = secureLinks.filter(link => [...filteredNodes.map(node => node.id)].includes(link.source.id) && [...filteredNodes.map(node => node.id)].includes(link.target.id))
        } else {
            filteredLinks = secureLinks;
            filteredNodes = secureNodes;
        }

        if(dictAssuntoFilter.length > 0) {
            filteredNodes = filteredNodes.filter(node => [...new Set([].concat.apply([], [...node.DICIONARIO.map(column => column.assunto)]))].some(n => dictAssuntoFilter.includes(n)) )
            filteredLinks = filteredLinks.filter(link => [...filteredNodes.map(node => node.id)].includes(link.source.id) && [...filteredNodes.map(node => node.id)].includes(link.target.id))
        }

        if(plataformaFilter.length > 0) {
            filteredNodes = filteredNodes.filter(node => plataformaFilter.includes(node.PLATAFORMA))
            filteredLinks = filteredLinks.filter(link => [...filteredNodes.map(node => node.id)].includes(link.source.id) && [...filteredNodes.map(node => node.id)].includes(link.target.id))
        }

        if(conjuntoFilter.length > 0) {
            filteredNodes = filteredNodes.filter(node => conjuntoFilter.includes(node.CONJUNTO))
            filteredLinks = filteredLinks.filter(link => [...filteredNodes.map(node => node.id)].includes(link.source.id) && [...filteredNodes.map(node => node.id)].includes(link.target.id))
        }

        if(assuntoFilter.length > 0 || dictAssuntoFilter.length > 0 || plataformaFilter.length > 0 || conjuntoFilter.length > 0) {
            setOpenFilteredResults(true);
        }

        setFilteredTemp({nodes: filteredNodes, links: filteredLinks})
        setDataShouldBeUpdated(false);
    }, [dataShouldBeUpdated])


    const renderFilteredResults = ({nodes, links}) => {
        const styles = {
            container: {overflow: 'auto',borderRadius: '10px', background: '#F2F2F2', width: '300px', padding: '0', height: '348px', position: 'absolute', zIndex: '1', bottom: '20px', right: '20px'},
            nav: {width: '270px', display: 'flex', padding:'15px', alignItems: 'center', justifyContent: 'space-between', background: '#F2F2F2', position: 'fixed', borderRadius: '10px', height: '11px', boxShadow: 'rgb(0 0 0 / 20%) 2px 1px 10px 1px'}
        }

        return (<>
            <div style={styles.container}>
                <div style={styles.nav}>
                    <CloseIcon style={{cursor: 'pointer'}} onClick={() => setOpenFilteredResults(false)}/>
                    <CheckIcon style={{cursor: 'pointer'}} onClick={() => {
                        setNodes(nodes);
                        setLinks(links);
                    }}/>
                    <RotateLeftIcon style={{cursor: 'pointer'}}  onClick={() => {
                        setNodes(secureNodes);
                        setLinks(secureLinks);
                    }}/>
                </div>
                <div style={{marginTop: '40px'}}>
                    {nodes.map(node => <div onClick={() => handleNodeClick(node)} style={{cursor: 'pointer', marginBottom: '6px'}}>{node.id}</div>)}
                </div>
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

    const styles = {
        container: {borderRadius: '10px', background: '#F2F2F2', width: 'fit-content', padding: '15px 15px 0 15px', height: 'fit-content', maxHeight: '80vh', position: 'absolute', zIndex: '1', top: '130px', left: '20px'},
    }

    return (
        <div className="Graph">
            <ForceGraph3D
                ref={graphRef}
                graphData={{ nodes: nodes, links: links }}
                nodeLabel={"id"}
                linkLabel={(link) => `${link.protocolo}`}
                nodeAutoColorBy={"PLATAFORMA"}
                onNodeClick={ handleNodeClick }
                linkDirectionalParticles={1}
                linkDirectionalParticleWidth={2}
            />
            {openFilteredResults && renderFilteredResults(filteredTemp)}
            <div style={styles.container}>
                <AutoCompleteFilter 
                    data={[...new Set([...[].concat.apply([], [...nodes.map(node => node.ASSUNTO)])])]} 
                    applyFilter={(value) => {
                        setAssuntoFilter(value);
                        setDataShouldBeUpdated(true);
                    }}
                    label={'Assuntos'}
                    placeholder={'assuntos'}
                />
                <AutoCompleteFilter 
                    data={['dado pessoal', 'transferencia', 'seguranca', 'dados', 'cliente']} 
                    applyFilter={(value) => {
                        setDictAssuntoFilter(value);
                        setDataShouldBeUpdated(true);
                    }}
                    label={'Assuntos das Colunas'}
                    placeholder={'assuntos'}
                />
                <AutoCompleteFilter 
                    data={[...new Set(nodes.map(node => node.PLATAFORMA))]} 
                    applyFilter={(value) => {
                        setPlataformaFilter(value);
                        setDataShouldBeUpdated(true);
                    }}
                    label={'Plataforma'}
                    placeholder={'plataforma'}
                />
                <AutoCompleteFilter 
                    data={[...new Set(nodes.map(node => node.CONJUNTO))]} 
                    applyFilter={(value) => {
                        setConjuntoFilter(value);
                        setDataShouldBeUpdated(true);
                    }}
                    label={'Conjunto'}
                    placeholder={'conjunto'}
                />
            </div>
            {graphRef.current && <Search nodes={nodes} graphRef={graphRef}/>}
        </div>
    );
}

export default Force;
