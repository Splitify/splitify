import React, { useEffect, useState } from 'react'
import { Playlist as PlaylistObj } from '../types'
import { makeStyles } from '@material-ui/core'

import List from '@material-ui/core/List'
import Paper from '@material-ui/core/Paper'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

import { TrackFilter } from '../types/TrackFilter'
import MultiFilter from './MultiFilter'
import TrackList from './TrackList'

const useStyles = makeStyles({
  root: {
    width: '100%',
    maxWidth: 540
  }
})

export default function MasterPlaylist (props: { playlist: PlaylistObj }) {
  const classes = useStyles()

  const [trackFilter, setTrackFilter] = useState<TrackFilter>(() => () => true)
  // Async state update

  let _tick = useState(false)[1]
  const tick = () => _tick(v => !v)

  useEffect(() => {
    // Expand the playlist (get tracks) and update the UI every 250ms
    ;(async () => {
      let intl = setInterval(() => tick(), 250)
      props.playlist.expand().then(function () {
        clearInterval(intl)
        tick()
      })
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // TODO: Changing playlist? props.playlist

  return (
    <div className={classes.root}>
      <List component={Paper}>
        <ListItem>Master Playlist: {props.playlist.name}</ListItem>
        <ListItem>
          <MultiFilter callback={f => setTrackFilter(() => f)} />
        </ListItem>

        <TrackList
          id={props.playlist.id}
          tracks={props.playlist.tracks.filter(trackFilter)}
          isDragDisabled={true}
          isDropDisabled={true}
          component={List}
          childComponent={ListItem}
        />
      </List>
    </div>
  )
}
