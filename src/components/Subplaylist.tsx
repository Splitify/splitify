import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Playlist as PlaylistObj, Track as TrackObj } from "../types"
import { IconButton } from '@material-ui/core';
import Track from './Track';

const useStyles = makeStyles({
  table: {
    //Add styling for tables here
  },
});


export default function Subplaylist(props: {
  playlist: PlaylistObj,
  genres: string[],
  onDelete?: (playlist: PlaylistObj) => any;
}) {
  const classes = useStyles();
  const [selectedGenres, setFormats] = React.useState(() => []);

  const handleFormat = (event: object, value: any) => {
    setFormats(value);
  };

  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [newName, setNewName] = React.useState(props.playlist.name);

  const editNameDialog = (
    <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
      <DialogTitle>Edit Name: {props.playlist.name}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="New Name"
          defaultValue={props.playlist.name}
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
          props.playlist.name = newName;
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
                {props.playlist.name}
                <IconButton onClick={() => setEditDialogOpen(true)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <Button variant="contained" color="secondary" onClick={() => props.onDelete && props.onDelete(props.playlist)} startIcon={<DeleteIcon />}>
                Delete
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
        <TableBody>
          <TableRow>
            <ToggleButtonGroup value={selectedGenres} size="small" onChange={handleFormat} aria-label="text formatting">
              {props.genres.map((genre: string) => (
                <ToggleButton value={genre}>
                  {genre}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </TableRow>

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
    </div >
  );
}
