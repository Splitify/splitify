import React, { useState } from 'react'
import {
  Grid,
  Button,
  makeStyles,
  GridList,
  GridListTile
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

import {
  Playlist as PlaylistObj,
  Track as TrackObj
} from '../../types'
import {
  allGenresFromPlaylist,
  asPlaylistTrack,
  touchTrack,
} from '../../helpers/helpers'

import '../../gradientBG.css'

import { RouteComponentProps, withRouter } from 'react-router-dom'
import { DragDropContext } from 'react-beautiful-dnd'
import { v4 as uuid } from 'uuid'

import Auth from '../../auth'
import PlaylistWrapper from '../../components/PlaylistWrapper/'
import Subplaylist from '../../components/Playlists/Subplaylist'

export const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  playlist: {
    //Add styling for playlists here
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)'
  },
  gridListTileRoot: {
    paddingLeft: 20,
    paddingRight: 20,
    padding: 2,
    width: '45%'
  },
  gridListTileTile: {
    overflow: 'visible'
  }
}))

interface IDashboardProps extends RouteComponentProps {}

const Dashboard: React.FC<IDashboardProps> = () => {
  //The width of the grids have to be dynamic, not a fixed width
  const classes = useStyles()

  const [masterPlaylist, setMasterPlaylist] = useState<PlaylistObj>()
  const [genres, setGenres] = useState<string[]>([])
  const [usedTracks, setUsedTracks] = useState<TrackObj[]>([])

  const filteredLists: { [id: string]: TrackObj[] } = useState({})[0]

  function loadPlaylist (playlist: PlaylistObj) {
    Promise.all(playlist.tracks.map(t => t.expand())).then(() => {
      setMasterPlaylist(playlist)
      setPlaylists([])
      setGenres(allGenresFromPlaylist(playlist))
    })
  }

  interface PlaylistObjectPP extends PlaylistObj {
    sourcePool: TrackObj[]
  }

  const createPlaylist = (): PlaylistObjectPP => {
    return {
      id: 'temp:' + uuid(),
      name: 'Sub-playlist',
      description: '',
      image: '',
      owner: { id: 'owner', display_name: 'Owner' },
      snapshot_id: '',
      tracks: [],
      uri: '',
      public: false,
      collaborative: false,
      sourcePool: masterPlaylist!.tracks.map(t => asPlaylistTrack(t).clone!()),
      expand: async function () {
        return this
      }
    }
  }

  const [playlists, setPlaylists] = useState<PlaylistObjectPP[]>([])

  const addPlaylist = () => {
    const playlist = createPlaylist()
    console.log('Adding playlist', playlist.id)
    setPlaylists([...playlists, playlist])
  }

  const deletePlaylist = (playlist: PlaylistObj) => {
    console.log('Deleting playlist', playlist.id)
    delete filteredLists[playlist.id]
    setPlaylists(playlists.filter(p => p.id !== playlist.id))
  }

  // Find playlist object given its ID
  const findPlaylist = (id: string) =>
    (id === masterPlaylist?.id && masterPlaylist) ||
    playlists.find(p => p.id === id)

  // Resolves filter index to track source index
  const getPlaylistIndexFromFilterIndex = (
    playlist: PlaylistObj,
    fIDX: number
  ) => {
    let filterList = filteredLists[playlist.id]
    if (fIDX === filterList.length) return -1 // Drag to the end
    let key = asPlaylistTrack(filterList[fIDX])
    let targetTrackUUID = asPlaylistTrack(key).uuid
    return playlist.tracks.findIndex(
      t => asPlaylistTrack(t).uuid === targetTrackUUID
    )
  }

  const updateTracks = () => {
    setUsedTracks(
      Array.from(new Set(playlists.map((p: PlaylistObj) => p.tracks).flat()))
    )
  }

  const removeTracksFromPlaylist = (playlist: PlaylistObj, ids: string[]) => {
    let targetPlaylist = findPlaylist(playlist.id)
    targetPlaylist!.tracks = targetPlaylist!.tracks.filter(
      t => !ids.includes(asPlaylistTrack(t).uuid!)
    )
    setPlaylists([...playlists])
  }

  // const groupTracks = () => {
  //   let checkedTracks: PlaylistTrack[] = []
  //   let sourcePlaylist: PlaylistObj | undefined
  //   let source_newTracks: TrackObj[]
  //   let index: number
  // checked.forEach(checkedList => {
  //   sourcePlaylist = findPlaylist(checkedList.id)
  //   if (!sourcePlaylist) throw new Error('Failed to get playlist')
  //   source_newTracks = [...sourcePlaylist!.tracks]
  //   checkedList.tracks.forEach((track, index) => {
  //     if (track) {
  //       checkedTracks.push(asPlaylistTrack(track))
  //     }
  //   })
  //   //we have a list of all selected tracks
  //   let newGroup = createTrackGroup(...checkedTracks)
  //   //remove tracks
  //   checkedTracks.forEach(track => {
  //     index = source_newTracks
  //       .map(function (e) {
  //         return e.id
  //       })
  //       .indexOf(track.id)
  //     source_newTracks!.splice(index, 1)
  //   })
  //   //add in track group
  //   source_newTracks.unshift(newGroup)
  //   sourcePlaylist.tracks = source_newTracks
  //   setPlaylists([...playlists])
  // })
  // let allChecked = checked
  // allChecked.map(checkedPlaylist => (checkedPlaylist.tracks = []))
  // setChecked([...checked])
  // }

  return (
    <div className={`${classes.root} gradientAnim`}>
      <Button
        variant='contained'
        color='primary'
        style={{ float: 'right', margin: 5 }}
        onClick={() =>
          Auth.logout().then(() => {
            window.location.href = window.location.origin + '/'
          })
        }
      >
        Logout
      </Button>
      {/* <DeleteTracksButton /> */}
      <Grid style={{ width: '100%', margin: 0 }} container spacing={5}>
        <DragDropContext
          onDragEnd={evt => {
            if (!evt.destination) return

            let sourcePlaylist = findPlaylist(evt.source.droppableId)
            let destPlaylist = findPlaylist(evt.destination.droppableId)
            if (!sourcePlaylist || !destPlaylist)
              throw new Error('Failed to find playlist')

            let sourceIdx = getPlaylistIndexFromFilterIndex(
              sourcePlaylist,
              evt.source.index
            )
            let destIdx = getPlaylistIndexFromFilterIndex(
              destPlaylist,
              evt.destination.index
            )

            if (sourcePlaylist === masterPlaylist) {
              console.log('drag from master')

              let trackCopy = asPlaylistTrack(masterPlaylist.tracks[sourceIdx])
                .clone!({
                isCustom: true,
                sourceID: masterPlaylist.id,
                sourceName: () => 'Master Playlist'
              })

              const dest_newTracks = [...destPlaylist.tracks]
              dest_newTracks.splice(
                destIdx !== -1 ? destIdx : dest_newTracks.length,
                0,
                trackCopy
              )
              destPlaylist.tracks = dest_newTracks

              setPlaylists([...playlists])
              return
            }
            const source_newTracks = [...sourcePlaylist.tracks]
            let removed = source_newTracks.splice(sourceIdx, 1)[0]

            if (sourcePlaylist !== destPlaylist) {
              // Move between playlists, also updating the destination playlist
              const dest_newTracks = [...destPlaylist.tracks]

              let removedPP = asPlaylistTrack(removed)
              if (removedPP.isCustom) {
                if (removedPP.sourceID === destPlaylist.id) {
                  // Dragged back to the original playlist
                  removed = touchTrack(removed, {
                    isCustom: false
                  })
                }
              } else {
                // Dragged from original to new playlist
                removed = touchTrack(removed, {
                  isCustom: true,
                  sourceID: sourcePlaylist.id,
                  sourceName: () => sourcePlaylist?.name
                })

                // Remove item from source pool
                let sourcePlaylistPP = sourcePlaylist as PlaylistObjectPP
                let poolIdx = sourcePlaylistPP.sourcePool.findIndex(
                  t => asPlaylistTrack(t).uuid === removedPP.uuid
                )
                if (poolIdx > -1) {
                  sourcePlaylistPP.sourcePool.splice(poolIdx, 1)
                }
              }
              dest_newTracks.splice(
                destIdx !== -1 ? destIdx : dest_newTracks.length,
                0,
                removed
              )
              destPlaylist.tracks = dest_newTracks
            } else {
              source_newTracks.splice(destIdx, 0, removed)
            }

            sourcePlaylist.tracks = source_newTracks

            setPlaylists([...playlists])
          }}
        >
          <Grid item xs={4}>
            <PlaylistWrapper
              usedTracks={usedTracks}
              onSelect={p => loadPlaylist(p)}
              onFilterUpdate={tracks =>
                masterPlaylist && (filteredLists[masterPlaylist.id] = tracks)
              }
            />
          </Grid>
          <Grid item xs={8} style={{ paddingRight: 0, overflowX: 'hidden' }}>
            <GridList className={classes.gridList} cols={2}>
              {masterPlaylist ? (
                <>
                  {playlists.map(p => (
                    <GridListTile
                      key={p.id}
                      classes={{
                        root: classes.gridListTileRoot,
                        tile: classes.gridListTileTile
                      }}
                    >
                      <Subplaylist
                        genres={genres}
                        source={p.sourcePool}
                        playlist={p}
                        onAction={(action, data) => {
                          switch (action) {
                            case 'groupTracks':
                              break
                            case 'sortTracks':
                              // TODO: Sort tracks
                              break
                            case 'deleteTracks':
                              removeTracksFromPlaylist(p, data)
                              break
                            case 'deletePlaylist':
                              deletePlaylist(p)
                              break
                            case 'filterUpdate':
                              filteredLists[p.id] = data
                              break
                            case 'trackUpdate':
                              updateTracks()
                              break
                          }
                        }}
                      />
                    </GridListTile>
                  ))}
                  <GridListTile style={{ paddingRight: 15 }}>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => addPlaylist()}
                      startIcon={<AddIcon />}
                    >
                      Add
                    </Button>
                  </GridListTile>
                </>
              ) : null}
            </GridList>
          </Grid>
        </DragDropContext>
      </Grid>
    </div>
  )
}

export default withRouter(Dashboard)
