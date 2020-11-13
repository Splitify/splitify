import React, { useState, useEffect } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { Track as TrackObj, CheckedList, PlaylistTrackGroup } from '../types'
import TrackEntry from './TrackEntry'
import Track from './Track'
import { ListItem } from "@material-ui/core"
import {_PlaylistTrackGroup} from '../helpers/helpers'

import { VariableSizeList as VirtualList } from 'react-window'

export default function (props: { 
  id: string; 
  tracks: TrackObj[], 
  isDropDisabled?: boolean, 
  isDragDisabled?: boolean, 
  isDeletable: boolean, 
  isDragClone?: boolean, 
  component: React.ElementType, 
  showActions?: boolean, 
  showTrackCount?: boolean, 
  checked: CheckedList[],  
  toggleChecked?: (id: string, track: TrackObj) => any
}){
  const [height, setHeight] = useState(0);

  const [ref, setRef] = useState<HTMLElement>();
  useEffect(() => {
    const checkHeight = function () {
      if (!ref) return
      const wh = window.innerHeight

      // Check height of the parent rectangle to see if there are more components below the TrackList.
      // If so, adjust the TrackList height accordingly
      let parentRect = ref.parentElement!.getBoundingClientRect();
      let refRect = ref.getBoundingClientRect()

      let h = wh - ((Math.max(refRect.top, parentRect.top + parentRect.height - refRect.height)) + window.pageYOffset || document.documentElement.scrollTop)
  
      h = ((h%wh)+wh)%wh - 50
      setHeight(h)
    }
    checkHeight()

    window.addEventListener('resize', checkHeight)

    return () => {
      window.removeEventListener('resize', checkHeight)
    }
  }, [ref])

  const [tracks, setTracks] = useState<TrackObj[]>([])
  const [expandedTracks, setExpandedTracks] = useState<TrackObj[]>([])
  // const [groupedTracks, setGroupedTracks] = useState<PlaylistTrackGroup>([])

  useEffect(() => {
    setTracks(props.tracks)
  })

  useEffect(() => {
    //expand tracks here
    let allTracks = tracks
    let newTracks = allTracks
    allTracks.map((track, index) => {
      if (track instanceof _PlaylistTrackGroup) {
        newTracks.splice(index, 1, ...track.tracks);
    }})
    setExpandedTracks(newTracks)
  }, [tracks])

  const EntryInvariant = React.memo(({ data, index, style }: any) => (
    data[index] && <TrackEntry
      key={data[index].id}
      track={data[index]}
      index={index}
      id={props.id}
      isDragDisabled={props.isDragDisabled}
      isDeletable={props.isDeletable}
      style={style}
      checked={props.checked}
      toggleChecked={props.toggleChecked!}
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
          outerRef={
            node => {
              setRef(node)
              provided.innerRef(node)
            }}
          {...provided.droppableProps}
          innerElementType={props.component}
          height={height}
          itemCount={expandedTracks.length + (snapshot.isUsingPlaceholder ? 1 : 0)}
          itemData={expandedTracks}
          itemSize={() => 60}
          width='100%'
        >
          {EntryInvariant}
        </VirtualList>
      )}
    </Droppable>
    {props.showTrackCount && <ListItem dense={true}>
      Total Tracks: {props.tracks.length}
    </ListItem>}
    {/*
    {props.showActions && <ListItem style={{height: 40, padding: 0}}>
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </ListItem>}
    */}
  </>
}
