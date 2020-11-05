import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { Track } from '../types'
import TrackEntry from './TrackEntry'
import { VariableSizeList as List } from 'react-window'

export default function (props: { id?: string; tracks: Track[], isDropDisabled?: boolean, isDragDisabled?: boolean, isDragClone?: boolean, component: React.ElementType, childComponent: React.ElementType}) {
  const Wrapper = props.component;
  return (
    <Droppable
      droppableId={props.id || 'unknown'}
      mode='virtual'
      isDropDisabled={props.isDropDisabled}
    >
      {(provided, snapshot) => (
        <List
          outerRef={provided.innerRef}
          {...provided.droppableProps}
          innerElementType={Wrapper}
          height={400}
          itemCount={props.tracks.length}
          itemData={props.tracks}
          itemSize={() => 60}
          width='100%'
        >
          {({ data, index, style }) => (
            <TrackEntry
              key={data[index].id}
              parent={props.id}
              track={data[index]}
              index={index}
              isDragDisabled={props.isDragDisabled}
              style={style}
            />
          )}
        </List>
        // {provided.placeholder}
      )}
    </Droppable>
  )
}
