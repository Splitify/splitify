import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Track from './Track';
import { Playlist as PlaylistObj, Track as TrackObj } from "../types"
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles({
  table: {
    //Add styling for tables here
  },
});

export default function Playlist(props: {
  playlist: PlaylistObj;
  name: string;
  delete: () => void;
  rename: (oldName: string, newName: string) => void;

}) {
  const classes = useStyles();

  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [newName, setNewName] = React.useState(props.name);
  
  const editNameDialog = (
    <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
      <DialogTitle>Edit Name: {props.name}</DialogTitle>
      <DialogContent>
        {/* <DialogContentText>
          To subscribe to this website, please enter your email address here. We will send updates
          occasionally.
      </DialogContentText> */}
        <TextField
          autoFocus
          // margin="dense"
          id="name"
          label="New Name"
          defaultValue={props.name}
          fullWidth
          onChange={(e) => setNewName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEditDialogOpen(false)} color="primary">
          Cancel
      </Button>
        <Button onClick={() => {
          setEditDialogOpen(false);
          props.rename(props.name, newName);
        }} color="primary">
          Ok
      </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <div>
      {editNameDialog}
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                {props.name}
                <IconButton onClick={() => setEditDialogOpen(true)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <Button variant="contained" color="secondary" onClick={props.delete} startIcon={<DeleteIcon />}>
                  Delete
              </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* //FIXME: Simplify / expand */}
            {props.playlist.tracks.map((track: TrackObj) => (
              <TableRow key={track.id}>
                {/* UUID for each track item */}
                <TableCell component="th" scope="row">
                  <Track track={track} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
