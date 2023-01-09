import React, { useState, Fragment, useEffect } from 'react'

import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import { listByLicensePlate } from '../../api/truck.api';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function DeliveryForm() {

    const [trucks, setTrucks] = useState([]);
    const [truck, setTruck] = useState(null);
    return (
        <Box sx={{ width: '100%' }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid xs={12}>
                    <Autocomplete
                        fullWidth
                        getOptionLabel={
                            (option) => {
                                return `${option.licensePlate.toString().toUpperCase()} `
                            }
                        }
                        filterOptions={(x) => x}
                        value={truck}
                        options={trucks}
                        autoComplete
                        includeInputInList
                        filterSelectedOptions
                        onChange={(_, value) => {
                            console.log("value", value)
                            setTruck(value);

                        }}

                        onInputChange={(_, newInputValue) => {

                            if (newInputValue.toString().trim().length > 0) {
                                let data = {
                                    licensePlate: newInputValue.toString().trim()
                                }
                                listByLicensePlate(data).then(response => {
                                    console.log("response", response)
                                    setTrucks(response);
                                });
                            }

                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Placa" variant="outlined" margin="dense" />
                        )}
                        renderTags={(tagValue, getTagProps) =>
                            tagValue.map((option, index) => (
                                <Chip
                                    key={option.id}
                                    label={option.licensePlate}
                                    {...getTagProps({ index })}
                                    disabled={trucks.indexOf(option) !== -1}
                                />
                            ))
                        }
                        renderOption={(props, option) => {

                            return (
                                <Grid {...props} container alignItems="center" key={option.id}>
                                    <Grid item xs>
                                        <Typography >{`${option.licensePlate.toString().toUpperCase()}`}</Typography>
                                    </Grid>
                                </Grid>
                            );
                        }}
                    />
                </Grid>
                <Grid xs={6}>
                    <Item>2</Item>
                </Grid>
                <Grid xs={6}>
                    <Item>3</Item>
                </Grid>
                <Grid xs={6}>
                    <Item>4</Item>
                </Grid>
            </Grid>
        </Box>
    );
}