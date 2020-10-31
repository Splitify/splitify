import React, { useEffect, useState } from 'react'
import { Playlist as PlaylistObj } from '../types'
import {
  makeStyles,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell
} from '@material-ui/core'
import { TrackFilter } from "../types/TrackFilter"
import MultiFilter from './MultiFilter'
import TrackList from './TrackList'

const useStyles = makeStyles({
  table: {
    //Add styling for tables here
  }
})

export default function MasterPlaylist(props: { playlist: PlaylistObj }) {
  const classes = useStyles()

  const [trackFilter, setTrackFilter] = useState<TrackFilter>(() => (() => true));
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
  
  return (
    <TableContainer
      component={Paper}
      style={{ maxHeight: 1000, overflow: 'auto' }}
    >
      <Table className={classes.table} aria-label='master playlist'>
        <TableHead>
          <TableRow key='heading'>
            <TableCell>Master Playlist: {props.playlist.name}</TableCell>
          </TableRow>
            <TableRow>
              <TableCell>
                <MultiFilter callback={f => setTrackFilter(() => f)} />
              </TableCell>
            </TableRow>
        </TableHead>
        <TrackList id={props.playlist.id} tracks={props.playlist.tracks.filter(trackFilter)} isDragDisabled={true} isDropDisabled={true} />
      </Table>
    </TableContainer>
  )
}
