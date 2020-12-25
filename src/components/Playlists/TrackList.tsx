import React, { useState, useEffect } from 'react'
import { Button, ListItem } from '@material-ui/core'

import { Track as TrackObj } from '../../types'

import { Droppable } from 'react-beautiful-dnd'
import { VariableSizeList as VirtualList } from 'react-window'

import TrackEntry from '../Tracks/TrackEntry'
import Track from '../Tracks/Track'
import { asPlaylistTrack, _PlaylistTrackGroup } from '../../helpers/helpers'

import DeleteTracksButton from './Actions/DeleteTracksButton'

export default function (props: {
  id: string
  tracks: TrackObj[]
  component: React.ElementType
  isDropDisabled?: boolean
  isDragDisabled?: boolean
  isCheckEnabled?: boolean
  showActions?: boolean
  showTrackCount?: boolean
  _refresh?: boolean
}) {
  const [height, setHeight] = useState(0)

  const [checkedItems, setCheckedItems] = useState<string[]>([])

  const [ref, setRef] = useState<HTMLElement>()
  useEffect(() => {
    const checkHeight = function () {
      if (!ref) return
      const wh = window.innerHeight

      // Check height of the parent rectangle to see if there are more components below the TrackList.
      // If so, adjust the TrackList height accordingly
      let parentRect = ref.parentElement!.getBoundingClientRect()
      let refRect = ref.getBoundingClientRect()

      let h =
        wh -
        (Math.max(
          refRect.top,
          parentRect.top + parentRect.height - refRect.height
        ) + window.pageYOffset || document.documentElement.scrollTop)

      h = (((h % wh) + wh) % wh) - 50
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
  }, [props.tracks])

  useEffect(() => {
    //expand tracks here
    let allTracks = tracks
    let newTracks = allTracks
    allTracks.forEach((track, index) => {
      if (track instanceof _PlaylistTrackGroup) {
        newTracks.splice(index, 1, ...track.tracks)
      }
    })
    setExpandedTracks(newTracks)
  }, [tracks])

  const EntryInvariant = React.memo(
    ({
      data,
      index,
      style
    }: {
      data: TrackObj[]
      index: number
      style: any
    }) => {
      if (data[index]) {
        let uuid = asPlaylistTrack(data[index]).uuid!

        return (
          <TrackEntry
            key={data[index].id}
            track={data[index]}
            index={index}
            isDragDisabled={props.isDragDisabled}
            style={style}
            canCheck={props.isCheckEnabled}
            isChecked={checkedItems.includes(uuid)}
            toggleChecked={state =>
              setCheckedItems(
                state
                  ? [...checkedItems, uuid]
                  : checkedItems.filter(id => id !== uuid)
              )
            }
          />
        )
      }
      return null
    }
  )

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
    <>
      <Droppable
        droppableId={props.id || 'unknown'}
        mode='virtual'
        isDropDisabled={props.isDropDisabled}
        renderClone={TrackInvariant}
      >
        {(provided, snapshot) => (
          <VirtualList
            outerRef={node => {
              setRef(node)
              provided.innerRef(node)
            }}
            {...provided.droppableProps}
            innerElementType={props.component}
            height={height}
            itemCount={
              expandedTracks.length + (snapshot.isUsingPlaceholder ? 1 : 0)
            }
            itemData={expandedTracks}
            itemSize={() => 60}
            width='100%'
          >
            {EntryInvariant}
          </VirtualList>
        )}
      </Droppable>
      {props.showActions && (
        <ListItem style={{ height: 40, padding: 8 }}>
          {checkedItems.length > 0 && <DeleteTracksButton />}
          <Button>Two</Button>
          <Button>Three</Button>
        </ListItem>
      )}
      {props.showTrackCount && (
        <ListItem dense={true}>Total Tracks: {props.tracks.length}</ListItem>
      )}
    </>
  )
}
