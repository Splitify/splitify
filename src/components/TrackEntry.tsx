import React, { useState, useEffect } from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import { Track as TrackObj } from '../types'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Track from './Track'

// let id: number = 0

export default function (props: { track: TrackObj }) {
  let [track, setTrack] = useState<TrackObj>()

  useEffect(() => {
    ;(async () => {
      setTrack(await props.track.expand())
    })()
  }, [])

  return (
    <TableRow /* key={track?.id || id++} */ >
      <TableCell component='th' scope='row'>
        {track ? (
          /*<Track track={track} />*/ track.name
        ) : (
          <Skeleton variant='rect' />
        )}
      </TableCell>
    </TableRow>
  )
}
