import React, { useEffect, useState, useCallback } from 'react'
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons'
import {
  Paper,
  IconButton,
  Button,
  Dialog,
  Typography
  // makeStyles
} from '@material-ui/core'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'

import {
  Playlist as PlaylistObj,
  Track as TrackObj,
  TrackFilter
} from '../types'

import GenreSelector from './GenreSelector'
import EditPlaylistNameDialog from './EditPlaylistNameDialog'
import SortSelector from './SortSelector'
import MultiFilter from './MultiFilter'
import { FeatureSelector } from './FeatureSelector'
import TrackList from './TrackList'
import { isTrackCustom } from '../helpers/helpers'
import makeStyles from '@material-ui/core/styles/makeStyles'

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
    margin: theme.spacing(1)
  }
}))

export default function Subplaylist(props: {
  source: TrackObj[]
  playlist: PlaylistObj
  genres: string[]
  onFilterUpdate?: (tracks: TrackObj[]) => any
  onDelete?: (playlist: PlaylistObj) => any
}) {
  const classes = useStyles()

  const [editDialogOpen, setEditDialogOpen] = useState(false)

  // to be displayed (after filter)
  const [tracks, setTracks] = useState<TrackObj[]>(props.source)

  // Track selector
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [featureFilter, setFeatureFilter] = useState<TrackFilter>(() => () =>
    true
  )

  // Visual properties
  const [trackFilter, setTrackFilter] = useState<TrackFilter>(() => () => true)

  const TrackCorrectGenre = (track: TrackObj): boolean => {
    if (selectedGenres.includes("ALL")) return true
    return selectedGenres.some((g: string) => track.genres.includes(g));
  }

  function handleSortAction(type: string) {
    const sortTracks = (track1: TrackObj, track2: TrackObj): number => {
      let var1: string = ''
      let var2: string = ''

      switch (type) {
        case 'Track Name':
          var1 = track1.name
          var2 = track2.name
          break
        case 'Artist':
          var1 = track1.artists[0].name
          var2 = track2.artists[0].name
          break
        case 'Album':
          if (track1.album) {
            var1 = track1.album.name
          }
          if (track2.album) {
            var2 = track2.album.name
          }
          break
        default:
          var1 = track1.name
          var2 = track2.name
      }
      return var1.localeCompare(var2)
    }

    setTracks([...tracks].sort(sortTracks))
    updateView()
  }

  useEffect(() => {
    // FIXME: Ordering property isn't persisted between updates to genre and features

    // Update the list of track in the playlist when the genre / features filter is changed
    setTracks(
      props.source
        .filter(t => !isTrackCustom(t))
        .filter(TrackCorrectGenre)
        .filter(featureFilter)
        .concat(props.source.filter(t => isTrackCustom(t)))
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenres, featureFilter, props.source])

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
  }, [tracks, trackFilter])

  return (
    <div>
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <EditPlaylistNameDialog
          name={props.playlist.name}
          onSave={(newName?: string) => {
            setEditDialogOpen(false)
            if (newName) props.playlist.name = newName
          }}
        />
      </Dialog>
      <List component={Paper}>
        <ListItem style={{justifyContent:"space-between"}}>
          <Typography>
            {props.playlist.name}
          </Typography>
          <IconButton onClick={() => setEditDialogOpen(true)}>
            <EditIcon />
          </IconButton>
          <Divider orientation="vertical" flexItem />
          <SortSelector onSort={handleSortAction} />
          <Divider orientation="vertical" flexItem />
          <Button
            variant='contained'
            color='secondary'
            className={classes.button}
            onClick={() => props.onDelete && props.onDelete(props.playlist)}
            startIcon={<DeleteIcon />}
          >
            Delete
            </Button>
        </ListItem>
        <ListItem>
          <GenreSelector
            genres={props.genres}
            onSelect={values => setSelectedGenres(values)}
          />
        </ListItem>
        <FeatureSelector
          onUpdateFilterFunction={f => setFeatureFilter(() => f)}
          component={List}
          childComponent={ListItem}
        />
        <ListItem divider={true}>
          <MultiFilter callback={f => setTrackFilter(() => f)} />
        </ListItem>
        <TrackList
          id={props.playlist.id}
          tracks={filterView}
          component={List}
          childComponent={ListItem}
        />
      </List>
    </div>
  )
}
