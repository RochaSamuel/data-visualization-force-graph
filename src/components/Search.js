import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const styles = {
    container: {borderRadius: '10px', background: '#F2F2F2', width: 'fit-content', padding: '15px', height: 'fit-content', position: 'absolute', zIndex: '1', top: '20px', left: '20px'},
}

export default function Seacrh(props) {
    console.log(props.nodes)
    return <div style={styles.container}>
        <Autocomplete
            id="combo-box-demo"
            options={props.nodes}
            getOptionLabel={(option) => option.id}
            onInputChange={(event, newInputValue) => {
                const node = props.nodes.filter((node) => node.id === newInputValue)

                const distance = 40;
                const distRatio = 1 + distance/Math.hypot(node[0].x, node[0].y, node[0].z);
                
                props.graphRef.current.cameraPosition(
                    { x: node[0].x * distRatio, y: node[0].y * distRatio, z: node[0].z * distRatio }, // new position
                    node[0], // lookAt ({ x, y, z })
                    3000  // ms transition duration
                );
            }}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="ID da base" variant="outlined" />}
        />
    </div>
}   