import React from 'react'
import TableBody from '@material-ui/core/TableBody'
import { Droppable } from 'react-beautiful-dnd'
import TrackEntry from './TrackEntry'
import { Track } from '../types'

export default function (props: { id?: string; tracks: Track[], isDropDisabled?: boolean, isDragDisabled?: boolean, isDragClone?: boolean }) {
  return (
    <Droppable droppableId={props.id || 'unknown'} isDropDisabled={props.isDropDisabled} >
      {(provided, snapshot) => (
        <TableBody ref={provided.innerRef} {...provided.droppableProps}>
          {props.tracks.map((track, idx) => (
            <TrackEntry track={track} index={idx} key={track.id} isDragDisabled={props.isDragDisabled} />
          ))}
          {provided.placeholder}
        </TableBody>
      )}
    </Droppable>
  )
}
