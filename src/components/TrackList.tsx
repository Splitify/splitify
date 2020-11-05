import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { Track } from '../types'
import TrackEntry from './TrackEntry'

export default function (props: { id?: string; tracks: Track[], isDropDisabled?: boolean, isDragDisabled?: boolean, isDragClone?: boolean, component: React.ElementType, childComponent: React.ElementType}) {
  const Wrapper = props.component;
  return (
    <Droppable droppableId={props.id || 'unknown'} isDropDisabled={props.isDropDisabled} >
      {(provided, snapshot) => (
        <Wrapper ref={provided.innerRef} {...provided.droppableProps}>
          {props.tracks.map((track, idx) => (
            <TrackEntry key={track.id} parent={props.id} track={track} index={idx} isDragDisabled={props.isDragDisabled} />
          ))}
          {provided.placeholder}
        </Wrapper>
      )}
    </Droppable>
  )
}