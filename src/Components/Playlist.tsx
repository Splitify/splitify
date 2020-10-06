import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Track from './Track';

const useStyles = makeStyles({
  table: {
    //Add styling for tables here
  },
});

function createData(name: string, genre: string) {
  return { name, genre };
}

const songs = [
  createData('Song A', 'pop'),
  createData('Song B', 'rap'),
  createData('Song C', 'lofi'),
  createData('Song D', 'weeb'),
  createData('Song E', 'rock'),
];

export default function Playlist() {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {songs.map((song) => (
            <TableRow key={song.name}>
              <TableCell component="th" scope="row">
                <Track/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}