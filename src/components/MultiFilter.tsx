import React, { useEffect, useState } from 'react'
import { TextField } from '@material-ui/core'
import { Artist, Track as TrackObj } from '../types'
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup/FormGroup'
import FormControl from '@material-ui/core/FormControl/FormControl'
import RadioGroup from '@material-ui/core/RadioGroup/RadioGroup'
import Radio from '@material-ui/core/Radio/Radio'

export interface TrackFilter {
  filter: (t: TrackObj) => boolean;
}

export default function MultiFilter(props: {
  callback: (f: TrackFilter) => void;
}) {
  const [filterValue, setFilterValue] = useState("");
  const [filterCategory, setFilterCategory] = useState("Name");

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => setFilterCategory(event.target.value);

  useEffect(() => {
    const TrackMatchesFilter = (track: TrackObj): boolean => {
      if (filterValue === '') return true;
      return (filterCategory === "Name" && track.name.toLowerCase().includes(filterValue))
        || (filterCategory === "Artist" && track.artists.some((a: Artist) => a.name.toLowerCase().includes(filterValue)))
        || (filterCategory === "Album" && track.album?.name.toLowerCase().includes(filterValue) === true)
        || (filterCategory === "Genre" && track.artists.some((a: Artist) => a.genres.some((g: string) => g.includes(filterValue))));
    }
    console.log(filterCategory, filterValue)
    props.callback({ filter: TrackMatchesFilter });
    // eslint-disable-next-line
  }, [filterValue, filterCategory]);

  return (
    <FormControl component="fieldset">
      <FormGroup aria-label="filter" row>
        <TextField
          style={{ width: '50%' }}
          variant='outlined'
          label='Filter'
          onChange={(e) => setFilterValue(e.target.value.toLowerCase())}
        />
        <RadioGroup value={filterCategory} onChange={handleFilterChange} row>
        {["Name", "Artist", "Album", "Genre"].map((k) => (
          <FormControlLabel
            control={<Radio />}
            label={k}
            labelPlacement="top"
            value={k}
            style={{ marginLeft: '5px', marginRight: '5px' }}
          />
        ))}
        </RadioGroup>
      </FormGroup>
    </FormControl >

  )
}
