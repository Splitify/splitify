import React, { useEffect, useState } from 'react'
import { Playlist as PlaylistObj, Track as TrackObj, TrackFilter } from '../types'

import { makeStyles, List, ListItem, Paper } from '@material-ui/core'

import MultiFilter from './MultiFilter'
import TrackList from './TrackList'
import ToggleButton from '@material-ui/lab/ToggleButton/ToggleButton'

const useStyles = makeStyles({
  root: {
    width: '100%',
    maxWidth: 540
  }
})

export default function MasterPlaylist(props: { playlist: PlaylistObj, usedTracks: TrackObj[] }) {
  const classes = useStyles()

  const [trackFilter, setTrackFilter] = useState<TrackFilter>(() => () => true)
  const [filterUsedTracks, setFilterUsedTracks] = useState(false)

  // Async state update

  let _tick = useState(false)[1]
  const tick = () => _tick(v => !v)

  useEffect(() => {
    // Expand the playlist (get tracks) and update the UI every 250ms
    ; (async () => {
      let intl = setInterval(() => tick(), 250)
      props.playlist.expand().then(function () {
        clearInterval(intl)
        tick()
      })
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // TODO: Changing playlist? props.playlist

  const usedFilter = (t: TrackObj) => {
    return !filterUsedTracks || !props.usedTracks.some((m: TrackObj) => m.id == t.id);
  }

  return (
    <div className={classes.root}>
      <List component={Paper}>
        <ListItem>Master Playlist: {props.playlist.name}</ListItem>
        <ListItem>{props.usedTracks.map((t: TrackObj) => t.name)}</ListItem>
        <ListItem>
          <ToggleButton
          size="small"
            selected={!filterUsedTracks}
            onChange={()=> setFilterUsedTracks(!filterUsedTracks)}
          >
            Show All
          </ToggleButton>
        </ListItem>
        <ListItem>
          <MultiFilter callback={f => setTrackFilter(() => f)} />
        </ListItem>

        <TrackList
          id={props.playlist.id}
          tracks={props.playlist.tracks.filter(trackFilter).filter(usedFilter)}
          isDragDisabled={true}
          isDropDisabled={true}
          component={List}
          childComponent={ListItem}
        />
      </List>
    </div>
  )
}
