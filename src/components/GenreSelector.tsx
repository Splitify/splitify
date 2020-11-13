import React from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { Checkbox, TextField } from '@material-ui/core'
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon
} from '@material-ui/icons'

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
const checkedIcon = <CheckBoxIcon fontSize='small' />

export default function (props: {
  genres: Record<string,number>
  selectedGenres: string[]
  onSelect: (values: string[]) => any
}) {
  return (
    <Autocomplete
      multiple
      fullWidth={true}
      options={Object.keys(props.genres)}
      defaultValue={["ALL"]}
      disableCloseOnSelect
      // getOptionLabel={option => {console.log(option, props.genres[option]); return option + props.genres[option]}}
      onChange={(event: any, newValue: string[]) => {
        if (props.selectedGenres.length === 1 && props.selectedGenres[0] === "ALL")
          newValue.splice(0, 1)
        props.onSelect(newValue)
      }}
      renderOption={(option, { selected }) => (
        <React.Fragment>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {`${option} (${props.genres[option]})`}
        </React.Fragment>
      )}
      renderInput={params => (
        <TextField
          style={{ width: '100%' }}
          {...params}
          variant='outlined'
          label='Genres'
          placeholder='Add Genre'
        />
      )}
    />
  )
}
