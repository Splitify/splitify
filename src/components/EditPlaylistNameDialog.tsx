import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog(props: { name: string, closeAndSet: (newName: string) => void }) { 
  const [newName, setNewName] = React.useState(props.name)

  return (
    <div>
      <DialogTitle>Edit Name: {props.name}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="New Name"
          defaultValue={props.name}
          fullWidth
          onChange={(e) => setNewName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.closeAndSet(props.name)} color="primary">
          Cancel
      </Button>
        <Button onClick={() => props.closeAndSet(newName)} color="primary">
          Ok
      </Button>
      </DialogActions>
    </div>
  );
}