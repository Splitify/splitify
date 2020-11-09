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
  genres: string[]
  onSelect: (values: string[]) => any
}) {
  return (
    <Autocomplete
      multiple
      fullWidth={true}
      options={props.genres}
      disableCloseOnSelect
      getOptionLabel={option => option}
      onChange={(event: any, newValue: string[]) => {
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
          {option}
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
