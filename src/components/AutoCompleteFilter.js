import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

export default function AutoCompleteFilters({data, applyFilter, label, placeholder}) {
    return <div style={{marginBottom: '20px'}}>
        <Autocomplete
            multiple
            size='small'
            limitTags={2}
            id="multiple-limit-tags"
            options={data}
            style={{ width: 300 }}
            getOptionLabel={(option) => option}
            onChange={(event, selectedValues) => {
                applyFilter(selectedValues)
            }}
            renderInput={(params) => (
                <TextField {...params} variant="outlined" label={label} placeholder={placeholder} />
            )}
        />
    </div>
}