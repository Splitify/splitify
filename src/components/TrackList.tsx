import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { Track as TrackObj } from '../types'
import TrackEntry from './TrackEntry'
import Track from './Track'
import { VariableSizeList as List } from 'react-window'

export default function (props: { id?: string; tracks: TrackObj[], isDropDisabled?: boolean, isDragDisabled?: boolean, isDragClone?: boolean, component: React.ElementType, childComponent: React.ElementType}) {
  const Wrapper = props.component;

  const EntryInvariant = React.memo(({ data, index, style }: any) => (
    data[index] && <TrackEntry
      key={data[index].id}
      parent={props.id}
      track={data[index]}
      index={index}
      isDragDisabled={props.isDragDisabled}
      style={style}
    />
  ))

  const TrackInvariant = (provided: any, snapshot: any, rubric: any) => (
    <div
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
    >
      <Track track={props.tracks[rubric.source.index]} />
    </div>
  )

  return (
    <Droppable
      droppableId={props.id || 'unknown'}
      mode='virtual'
      isDropDisabled={props.isDropDisabled}
      renderClone={TrackInvariant}
    >
      {(provided, snapshot) => (
        <List
          outerRef={provided.innerRef}
          {...provided.droppableProps}
          innerElementType={Wrapper}
          height={400}
          itemCount={props.tracks.length + (snapshot.isUsingPlaceholder ? 1 : 0)}
          itemData={props.tracks}
          itemSize={() => 60}
          width='100%'
        >
          {EntryInvariant}
        </List>
        // {provided.placeholder}
      )}
    </Droppable>
  )
}
