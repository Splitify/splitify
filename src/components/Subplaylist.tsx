import React, { useEffect, useState, useCallback } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@material-ui/icons'
import {
  IconButton,
  Button,
  Checkbox,
  Dialog,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  makeStyles
} from '@material-ui/core'
import { Playlist as PlaylistObj, Track as TrackObj, TrackFilter} from '../types'

import EditPlaylistNameDialog from './EditPlaylistNameDialog'
import SortSelector from './SortSelector'
import MultiFilter from './MultiFilter'
import { FeatureSelector } from './FeatureSelector'
import TrackList from './TrackList'

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

export default function Subplaylist(props: {
  source: PlaylistObj
  playlist: PlaylistObj
  genres: string[]
  onFilterUpdate?: (tracks: TrackObj[]) => any
  onDelete?: (playlist: PlaylistObj) => any
}) {
  const classes = useStyles()
  
  const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
  const checkedIcon = <CheckBoxIcon fontSize='small' />

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const [tracks, setTracks] = useState<TrackObj[]>(props.source.tracks)

  // eslint-disable-next-line 
  const [includedTracks, setIncludedTracks] = useState<TrackObj[]>([])
  // eslint-disable-next-line 
  const [excludedTracks, setExcludedTracks] = useState<TrackObj[]>([])
  
  // Track selector
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [featureFilter, setFeatureFilter] = useState<TrackFilter>(() => (() => true));

  // Visual properties
  const [trackFilter, setTrackFilter] = useState<TrackFilter>(() => (() => true));

  // TODO: Maybe put genres in each track
  const TrackCorrectGenre = (track: TrackObj): boolean => {
    if (selectedGenres.length === 0) return true;
    for (let artist of track.artists) {
      for (let genre of artist.genres) {
        if (selectedGenres.includes(genre)) {
          return true
        }
      }
    }
    return false
  }

  function handleSortAction(type: string) {

    const sortTracks = (track1: TrackObj, track2: TrackObj): number => {
      let var1: string = "";
      let var2: string = "";
      
      switch(type) {
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

    setTracks([...tracks].sort(sortTracks))
    updateView()
  }

  useEffect(() => {
    // FIXME: Ordering property isn't persisted between updates to genre and features

    // Update the list of track in the playlist when the genre / features filter is changed
    setTracks(
      props.source.tracks
      .filter(TrackCorrectGenre)
      .filter(featureFilter)
      .filter(t => !excludedTracks.includes(t))
      .concat(includedTracks) // Add items after concat
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenres, featureFilter, excludedTracks, includedTracks])

  // Save tracks to playlist when updated
  useEffect(() => {
    props.playlist.tracks = tracks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks])
  
  useEffect(() => {
    setTracks(props.playlist.tracks)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.playlist.tracks])

  let [filterView, updateFilteredView] = useState<TrackObj[]>([])

  const updateView = useCallback(() => {
    let view = tracks.filter(trackFilter)
    updateFilteredView(view)
    props.onFilterUpdate && props.onFilterUpdate(view)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks, trackFilter, props.onFilterUpdate])

  useEffect(() => {
    // Update the displayed items when the tracks change, or the track filter changes
    updateView()
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks, excludedTracks])

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
      <TableContainer component={Paper} style={{ maxHeight: 800, overflowY: 'auto' }}>
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
                  <SortSelector onSort={handleSortAction}/>
              </TableCell>
              <TableCell>
                <Button variant="contained" color="secondary" onClick={() => props.onDelete && props.onDelete(props.playlist)} startIcon={<DeleteIcon />}>
                  Delete
                  </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>
                <Autocomplete
                  multiple
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
            <FeatureSelector onUpdateFilterFunction={f => setFeatureFilter(() => f)} />
            <TableRow>
              <TableCell colSpan={3}>
                <MultiFilter callback={f => setTrackFilter(() => f)} />
              </TableCell>
            </TableRow>
          </TableHead>
        <TrackList id={props.playlist.id} tracks={filterView} />
        </Table>
      </TableContainer>
    </div>
  )
}
