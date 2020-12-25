import React, { useState } from 'react'
import {
  Button,
  TextField,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core'

export default function FormDialog (props: {
  name: string
  onSave: (newName?: string) => void
}) {
  const [newName, setNewName] = useState(props.name)

  return (
    <div>
      <DialogTitle>Edit Name: {props.name}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label='New Name'
          defaultValue={props.name}
          fullWidth
          onChange={e => setNewName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onSave()} color='primary'>
          Cancel
        </Button>
        <Button onClick={() => props.onSave(newName)} color='primary'>
          Ok
        </Button>
      </DialogActions>
    </div>
  )
}
