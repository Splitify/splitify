import React, { useEffect, useState } from 'react'
import { TextField, FormGroup, FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core'
import { Artist, Track as TrackObj } from '../types'
import { TrackFilter } from "../types/TrackFilter"

export default function MultiFilter(props: {
  callback: (f: TrackFilter) => void;
  filterIsActive?: (v: boolean) => void;
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

    if(props.filterIsActive && filterValue === ""){
      props.filterIsActive(false)
    }else if(props.filterIsActive){
      props.filterIsActive(true)
    }
    props.callback(TrackMatchesFilter);
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
            //We should change all styling from fixed px to percentages in the future to conform to mobile and changing screen sizes. 
            style={{ marginLeft: '4px', marginRight: '4px' }}
          />
        ))}
        </RadioGroup>
      </FormGroup>
    </FormControl >

  )
}
