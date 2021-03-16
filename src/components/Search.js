import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const styles = {
    container: {borderRadius: '10px', background: '#F2F2F2', width: 'fit-content', padding: '15px', height: 'fit-content', position: 'absolute', zIndex: '1', top: '60px', left: '10px'},
}

export default function Seacrh(props) {
    return <div style={styles.container}>
        <Autocomplete
            id="combo-box-demo"
            options={props.nodes}
            getOptionLabel={(option) => option.id}
            renderOption={(option) => option.NOME}
            onInputChange={(event, newInputValue) => {
                if(newInputValue){
                    const nodeVector = props.nodes.filter((node) => node.id === newInputValue)
    
                    props.handleNodeClick(nodeVector[0]);
                }
            }}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="ID da base" variant="outlined" />}
        />
    </div>
}   