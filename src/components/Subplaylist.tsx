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
import SaveIcon from '@material-ui/icons/Save';
import Dialog from '@material-ui/core/Dialog';
import { Playlist as PlaylistObj, Track as TrackObj } from "../types"
import { IconButton } from '@material-ui/core';
import Track from './Track';
import EditPlaylistNameDialog from './EditPlaylistNameDialog'
import { createPlaylist, getUserProfile} from '../helpers/helpers'

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
  const [curPlaylist, setCurPlaylist] = React.useState(props.playlist);

  const handleFormat = (event: object, value: any) => {
    setFormats(value);
  };

  async function handleSave(){
    const user = await getUserProfile();
    console.log("Creating playlist: ",await curPlaylist.expand());
    const resp = await createPlaylist(user.id, props.playlist)
    setCurPlaylist(resp);
  }

  const [editDialogOpen, setEditDialogOpen] = React.useState(false);

  return (
    <div>
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <EditPlaylistNameDialog
          name={props.playlist.name}
          onSave={(newName?: string) => {
            setEditDialogOpen(false);
            if (newName) props.playlist.name = newName;
          }} />
      </Dialog>
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
              <TableCell>
                <Button variant="contained" color="secondary" onClick={async () => await handleSave()} startIcon={<SaveIcon />}>
                  Save
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
