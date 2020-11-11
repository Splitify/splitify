import React, { useState } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { Track as TrackObj } from '../types'
import TrackEntry from './TrackEntry'
import Track from './Track'
import { ListItem, Button } from '@material-ui/core'

import { VariableSizeList as VirtualList } from 'react-window'

export default function (props: { id?: string; tracks: TrackObj[], isDropDisabled?: boolean, isDragDisabled?: boolean, isDragClone?: boolean, component: React.ElementType, showActions?: boolean}) {

  const [height, setHeight] = useState(0);

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

  return <>
    <Droppable
      droppableId={props.id || 'unknown'}
      mode='virtual'
      isDropDisabled={props.isDropDisabled}
      renderClone={TrackInvariant}
    >
      {(provided, snapshot) => (
        <VirtualList
          outerRef={provided.innerRef}
          {...provided.droppableProps}
          innerElementType={props.component}
          ref={el => {
            // FIXME: Refactor to make it nice
            
            if (!el || height) return
            let elem = (el as any)?._outerRef as HTMLElement
            const wh = window.innerHeight
            let h = wh - (elem.getBoundingClientRect().top + window.pageYOffset || document.documentElement.scrollTop)
            h = ((h%wh)+wh)%wh - (props.showActions ? 40 : 0) - 50
            setHeight(h)
          }}
          height={height}
          itemCount={props.tracks.length + (snapshot.isUsingPlaceholder ? 1 : 0)}
          itemData={props.tracks}
          itemSize={() => 60}
          width='100%'
        >
          {EntryInvariant}
        </VirtualList>
      )}
    </Droppable>
    {props.showActions && <ListItem style={{height: 40, padding: 0}}>
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </ListItem>}
  </>
}
