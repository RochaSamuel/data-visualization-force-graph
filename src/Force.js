import "./styles/global.css";
import React, { useEffect, useRef, useState } from "react";
import { ForceGraph3D, ForceGraph2D } from "react-force-graph";
import Search from "./components/Search";
import AutoCompleteFilter from "./components/AutoCompleteFilter";
import Dictionary from './components/Dictionary';

import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

function Force({graphType, close}) {
    const graphRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true)
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);

    const [secureLinks, setSecureLinks] = useState([])
    const [secureNodes, setSecureNodes] = useState([])

    const [filteredTemp, setFilteredTemp] = useState([])
    const [clickedNode, setClickedNode] = useState({})

    const [openNodeInfo, setOpenNodeInfo] = useState(false)
    const [openFilteredResults, setOpenFilteredResults] = useState(false);
    const [openDictDialog, setOpenDictDialog] = useState(false);

    const [dataShouldBeUpdated, setDataShouldBeUpdated] = useState(false);
    const [assuntoFilter, setAssuntoFilter] = useState([]);
    const [dictAssuntoFilter, setDictAssuntoFilter] = useState([]);
    const [plataformaFilter, setPlataformaFilter] = useState([]);
    const [conjuntoFilter, setConjuntoFilter] = useState([]);

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
            setIsLoading(false)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataShouldBeUpdated, assuntoFilter, conjuntoFilter, plataformaFilter, dictAssuntoFilter])


    const renderFilteredResults = ({nodes, links}) => {

        return (<>
            <div className='filteredResultsContainer'>
                <div className='filteredResultsNav'>
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
                <div style={{marginTop: '45px'}}>
                    {nodes.map(node => <div className='filteredResultsNodeId' onClick={() => handleNodeClick(node)} style={{cursor: 'pointer', marginBottom: '6px'}}>{node.NOME}</div>)}
                </div>
            </div>
        </>
        );
    }

    const renderNodeInfo = (node) => {
        return <div className='nodeInfoContainer'>
            <CloseIcon style={{cursor: 'pointer'}} onClick={() => setOpenNodeInfo(false)}/>
            <div className='nodeInfoTitle'><b>Informações da Base: </b>{node.NOME}</div>
            <div className='nodeInfoProp'><b>ID: </b>{node.id}</div>
            <div className='nodeInfoProp'><b>Plataforma: </b>{node.PLATAFORMA}</div>
            <div className='nodeInfoProp'><b>Caminho: </b>{node.CAMINHO}</div>
            <div className='nodeInfoProp'><b>Conjunto: </b>{node.CONJUNTO}</div>
            <div className='nodeInfoProp'><b>Assunto: </b>{node.ASSUNTO.map(item => <div>{item}</div>)}</div>
            <div className='nodeInfoProp'><b>Dscrição: </b>{node.DESCR}</div>
            <div className='nodeInfoProp'><b>Dicionário: </b><div onClick={() => setOpenDictDialog(true)} className='nodeInfoDicioLink'>Visualizar Dicionário</div></div>
        </div>
    }
    
    const handleNodeClick = (node) => {
        if(graphType === '3D') {
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

        node.color = '#17fc03'

        setClickedNode(node);
        setOpenNodeInfo(true);
    }

    const styles = {
        container: {borderRadius: '10px', background: '#F2F2F2', width: 'fit-content', padding: '15px 15px 0 15px', height: 'fit-content', maxHeight: '80vh', position: 'absolute', zIndex: '1', top: '158px', left: '10px'},
    }

    return (
        <div className="Graph">
            {graphType === '3D' ? 
                <>{!isLoading && <ForceGraph3D
                    ref={graphRef}
                    graphData={{ nodes: nodes, links: links }}
                    nodeLabel={"id"}
                    linkLabel={(link) => `${link.protocolo}`}
                    nodeAutoColorBy={"PLATAFORMA"}
                    onNodeClick={ handleNodeClick }
                    linkDirectionalParticles={1}
                    linkDirectionalParticleWidth={2}
                />}</> :
                <>{!isLoading && <ForceGraph2D
                    ref={graphRef}
                    graphData={{ nodes: nodes, links: links }}
                    nodeLabel={"id"}
                    linkLabel={(link) => `${link.protocolo}`}
                    nodeAutoColorBy={"PLATAFORMA"}
                    onNodeClick={ handleNodeClick }
                />}</>
            }
            {openFilteredResults && renderFilteredResults(filteredTemp)}
            {openNodeInfo && renderNodeInfo(clickedNode)}
            {openDictDialog && <Dictionary open={openDictDialog} close={() => setOpenDictDialog(false)} node={clickedNode}/>}
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
            <div className="backButton" onClick={close}>Voltar</div>
            {!isLoading && <Search nodes={nodes} graphRef={graphRef} handleNodeClick={handleNodeClick}/>}
        </div>
    );
}

export default Force;
