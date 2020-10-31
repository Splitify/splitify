import React, { useState, useEffect } from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import { Track as TrackObj } from '../types'
import { TableRow, TableCell } from '@material-ui/core'
import { Draggable } from 'react-beautiful-dnd'
import Track from './Track'

export default function (props: { track: TrackObj; index?: number, isDragDisabled?: boolean }) {
  let [track, setTrack] = useState<TrackObj>()

  useEffect(() => {
    ;(async () => {
      setTrack(await props.track.expand())
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Draggable draggableId={props.track.id} index={props.index ?? -1} isDragDisabled={props.isDragDisabled} >
      {(provided, snapshot) => (
        <TableRow
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            cursor: 'pointer',
            ...(snapshot.isDragging
              ? { backgroundColor: '#E6E6E6' }
              : undefined)
          }}
        >
          <TableCell colSpan={100}>
            {track ? <Track track={track} /> : <Skeleton variant='rect' />}
          </TableCell>
        </TableRow>
      )}
    </Draggable>
  )
}
