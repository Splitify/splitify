import React , { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Track from './Track';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import { Playlist as PlaylistObj, Track as TrackObj } from "../types"

const useStyles = makeStyles((theme) => ({
  table: {
    //Add styling for tables here
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    }
  },
  paper: {
      width: 200,
      height: 230,
      overflow: 'auto',
  },
  button: {
      margin: theme.spacing(0.5, 0),
  },
}));

export default function Playlist(props: {
  playlist: PlaylistObj;
  genres: string[];
  id: Number;
  delete: () => void;
}) {
  const classes = useStyles();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  
  const handleDelete = (genreToDelete: any) => () => {
    setSelectedGenres((selectedGenres: string[]) => selectedGenres.filter((genre: string) => genre !== genreToDelete));
  };  

  const TrackCorrectGenre = (track: TrackObj): boolean => {
    var found = false;
    track.artists.map((artist) => {
      artist.genres.map((genre) => {
        if (selectedGenres.includes(genre)) {
          found = true
        }
      })
    })
    return found;
  }
  
  const handleToggle = (genre: string) => () => {
    const currentIndex = selectedGenres.indexOf(genre);
    const newChecked = [...selectedGenres];
    
    if (currentIndex === -1) {
      newChecked.push(genre);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setSelectedGenres(newChecked)
  };

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Sub-Playlist</TableCell>
            <TableCell>
              <Button variant="contained" color="secondary" onClick={props.delete}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell colSpan={2}>
                <Autocomplete
                  multiple
                  id="checkboxes-tags-demo"
                  options={props.genres}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option}
                  onChange={(event: any, newValue: string[]) => {
                    setSelectedGenres(newValue);
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
                  renderInput={(params) => (
                    <TextField  style={{ width: "100%" }} {...params} variant="outlined" label="Genres" placeholder="Add Genre" />
                  )}
                />
            </TableCell>
          </TableRow>
          {props.playlist.tracks.map((track: TrackObj) => {
            console.log(TrackCorrectGenre(track) === true)
            if (TrackCorrectGenre(track)) {
              return (<TableRow key={track.id}> 
                  <TableCell colSpan={2} component="th" scope="row">
                    <Track track={track} />
                  </TableCell>
                </TableRow>)
            }
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
