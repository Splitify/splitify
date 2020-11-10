import React, { useEffect, useState, useCallback } from 'react'
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons'
import {
  Paper,
  IconButton,
  Button,
  Dialog,
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

// const useStyles = makeStyles(theme => ({
//   table: {
//     //Add styling for tables here
//   },
//   root: {
//     display: 'flex',
//     justifyContent: 'center',
//     flexWrap: 'wrap',
//     '& > *': {
//       margin: theme.spacing(0.5)
//     }
//   },
//   paper: {
//     width: 200,
//     height: 230,
//     overflow: 'auto'
//   },
//   button: {
//     margin: theme.spacing(0.5, 0)
//   }
// }))

export default function Subplaylist (props: {
  source: PlaylistObj
  playlist: PlaylistObj
  genres: string[]
  onFilterUpdate?: (tracks: TrackObj[]) => any
  onDelete?: (playlist: PlaylistObj) => any
  onBlacklist: (tracks: TrackObj[]) => any

}) {
  // const classes = useStyles()

  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const [tracks, setTracks] = useState<TrackObj[]>(props.source.tracks)

  // eslint-disable-next-line
  const [includedTracks, setIncludedTracks] = useState<TrackObj[]>([])
  // eslint-disable-next-line
  const [excludedTracks, setExcludedTracks] = useState<TrackObj[]>([])

  const [blacklist, setBlacklist] = useState<TrackObj[]>([])
  const [checked, setChecked] = useState<TrackObj[]>([])
  // Track selector
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [filteredView, setFilteredView] = useState<TrackObj[]>([])
  const [featureFilter, setFeatureFilter] = useState<TrackFilter>(() => () =>
    true
  )
  

  // Visual properties
  const [trackFilter, setTrackFilter] = useState<TrackFilter>(() => () => true)

  // TODO: Maybe put genres in each track
  const TrackCorrectGenre = (track: TrackObj): boolean => {
    if (selectedGenres.length === 0) return true
    for (let artist of track.artists) {
      for (let genre of artist.genres) {
        if (selectedGenres.includes(genre)) {
          return true
        }
      }
    }
    return false
  }

  const updateBlacklist = () => {
    const blacklistedTracks = blacklist;
    checked.map((track) => {if (!blacklistedTracks.includes(track)) {
      blacklistedTracks.push(track)
    }})
    setBlacklist(blacklistedTracks);
    setChecked([])
  }

  const toggleChecked = (track: TrackObj) => () => {
    const currentIndex = checked.indexOf(track);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(track);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    console.log(checked)
  };

  const handleSortAction  = (type: string) => {
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

  const updateView = useCallback(() => {
    let view = tracks.filter(trackFilter)
    setFilteredView(view)
    props.onFilterUpdate && props.onFilterUpdate(view)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks, trackFilter, props.onFilterUpdate])

  useEffect(() => {
    // Update the displayed items when the tracks change, or the track filter changes
    updateView()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks, trackFilter, excludedTracks])

  return (
    <div>
      <Button
        variant='contained'
        onClick={updateBlacklist}
      >
        Remove Selected Songs
      </Button>
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
        <ListItem divider={true}>
          {props.playlist.name}
          <IconButton onClick={() => setEditDialogOpen(true)}>
            <EditIcon />
          </IconButton>
          <ListItem>
            <SortSelector onSort={handleSortAction} />
          </ListItem>
          <ListItem>
            <Button
              variant='contained'
              color='secondary'
              onClick={() => props.onDelete && props.onDelete(props.playlist)}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </ListItem>
        </ListItem>
        <ListItem divider={true}>
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
        <Divider />
        <ListItem divider={true}>
          <MultiFilter callback={f => setTrackFilter(() => f)} />
        </ListItem>
        <TrackList
          toggleChecked={toggleChecked}
          checked={checked}
          id={props.playlist.id}
          tracks={filteredView.filter(track => !blacklist.includes(track))}
          component={List}
          childComponent={ListItem}
        />
      </List>
    </div>
  )
}
