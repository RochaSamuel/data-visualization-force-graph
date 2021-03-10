import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

const styles = {
    container: {borderRadius: '10px', background: '#F2F2F2', width: 'max-content', padding: '15px', height: 'fit-content', position: 'absolute', zIndex: '1', top: '130px', right: '20px'},
}

export default function AssuntoFilter({assuntos, applyFilter}) {
    return <div style={styles.container}>
        <Autocomplete
            multiple
            size='small'
            limitTags={2}
            id="multiple-limit-tags"
            options={assuntos}
            style={{ width: 300 }}
            getOptionLabel={(option) => option}
            onChange={(event, selectedValues) => {
                applyFilter(selectedValues)
            }}
            renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Slecione os assuntos" placeholder="assuntos" />
            )}
        />
    </div>
}