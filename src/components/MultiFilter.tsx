import React, { useState } from 'react'
import { TextField } from '@material-ui/core'
import { Artist, Track as TrackObj } from '../types'
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup/FormGroup'
import FormControl from '@material-ui/core/FormControl/FormControl'
import Checkbox from '@material-ui/core/Checkbox/Checkbox'
import FormHelperText from '@material-ui/core/FormHelperText/FormHelperText'

export default function MultiFilter(props: {
  callback: (f: ((t: TrackObj) => boolean)) => void;
}) {
  const [filterValue, setFilterValue] = useState("");
  const [filterCategories, setFilterCategories] = useState({
    name: true,
    album: false,
    artist: false,
  });

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCategories({ ...filterCategories, [event.target.name]: event.target.checked });
  };

  const TrackMatchesFilter = (track: TrackObj): boolean => {
    return (filterCategories.name && track.name.toLowerCase().includes(filterValue))
      || (filterCategories.artist && track.artists.some((a: Artist) => a.name.toLowerCase().includes(filterValue)))
      || (filterCategories.album && track.album?.name.toLowerCase().includes(filterValue) === true);
  }

  props.callback(TrackMatchesFilter);

  const filterError = filterValue.length > 0 && Object.values(filterCategories).filter((v) => v).length === 0;

  return (
    <FormControl error={filterError} component="fieldset">
      <FormGroup aria-label="filter" row>
        <TextField
          error={filterError}
          style={{ width: '50%' }}
          variant='outlined'
          label='Filter'
          onChange={(e) => setFilterValue(e.target.value.toLowerCase())}
        />
        {Object.entries(filterCategories).map(([k,v]) => (
          <FormControlLabel
            control={<Checkbox color="primary" checked={v} onChange={handleFilterChange} name={k} />}
            label={k}
            labelPlacement="top"
          />
        ))}
      </FormGroup>
      <FormHelperText>Select one of {Object.keys(filterCategories).join(" ")}</FormHelperText>
    </FormControl >

  )
}
