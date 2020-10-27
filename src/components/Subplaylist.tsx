import React, { useEffect, useState } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  Button,
  Checkbox,
  Dialog,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  makeStyles
} from '@material-ui/core'
import { Playlist as PlaylistObj, Track as TrackObj } from '../types'
import Track from './Track'
import SortSelector from './SortSelector'
import EditPlaylistNameDialog from './EditPlaylistNameDialog'

const useStyles = makeStyles(theme => ({
  table: {
    //Add styling for tables here
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5)
    }
  },
  paper: {
    width: 200,
    height: 230,
    overflow: 'auto'
  },
  button: {
    margin: theme.spacing(0.5, 0)
  }
}))

export default function Subplaylist (props: {
  source: PlaylistObj
  playlist: PlaylistObj
  genres: string[]
  onDelete?: (playlist: PlaylistObj) => any
}) {
  const classes = useStyles()
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [sortType, setSortType] = useState("")

  const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
  const checkedIcon = <CheckBoxIcon fontSize='small' />
  // TODO: setTracks will be used for deletion, reordering and moving
  // eslint-disable-next-line
  const [tracks, setTracks] = useState(props.source.tracks)


  // TODO: Maybe put genres for each genre
  const TrackCorrectGenre = (track: TrackObj): boolean => {
    for (let artist of track.artists) {
      for (let genre of artist.genres) {
        if (selectedGenres.includes(genre)) {
          return true
        }
      }
    }
    return false
  }

  const sortTracks = (track1: TrackObj, track2: TrackObj): number => {
    let var1: string = "";
    let var2: string = "";
    console.log("sorting")
    switch(sortType) {
      case "Track Name":
        var1 = track1.name
        var2 = track2.name
        break;
      case "Artist":
        var1 = track1.artists[0].name
        var2 = track2.artists[0].name
        break;
      case "Album":
        if (track1.album){
          var1 = track1.album.name
        }
        if (track2.album){
          var2 = track2.album.name
        }
        break;
      default:
        var1 = track1.name
        var2 = track2.name
    }
    return var1.localeCompare(var2)
  };

  // Save tracks to playlist when updated
  useEffect(() => {
    props.playlist.tracks = tracks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks])

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
                  <SortSelector setSort={setSortType}/>
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
              <TableCell colSpan={2}>
                <Autocomplete
                  multiple
                  id='checkboxes-tags-demo'
                  options={props.genres}
                  disableCloseOnSelect
                  getOptionLabel={option => option}
                  onChange={(event: any, newValue: string[]) => {
                    console.log(newValue)
                    setSelectedGenres(newValue)
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
              </TableCell>
            </TableRow>
              {tracks.filter(TrackCorrectGenre).sort(sortTracks).map(track => (
              <TableRow key={track.id}>
                <TableCell colSpan={2} component='th' scope='row'>
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
