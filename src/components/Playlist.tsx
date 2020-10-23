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

}) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              {props.name}
              <IconButton>
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
  );
}
