import React, { useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Auth from '../../auth'
import PlaylistWrapper from '../../components/PlaylistWrapper/'
import Subplaylist from '../../components/Subplaylist'
import { allGenresFromPlaylist, asPlaylistTrack, touchTrack } from "../../helpers/helpers";
import { Playlist as PlaylistObj, Track as TrackObj } from "../../types";
import { Grid, Button, makeStyles } from '@material-ui/core';
import { v4 as uuid } from 'uuid';
import AddIcon from '@material-ui/icons/Add';
import { DragDropContext } from 'react-beautiful-dnd';

export const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  playlist: {
    //Add styling for playlists here
  }
}))

interface IDashboardProps extends RouteComponentProps { }

const Dashboard: React.FC<IDashboardProps> = () => {
  //The width of the grids have to be dynamic, not a fixed width
  const classes = useStyles()

  const [masterPlaylist, setMasterPlaylist] = useState<PlaylistObj>()
  const [genres, setGenres] = useState<string[]>([])

  const filteredLists: { [id: string]: TrackObj[] } = useState({})[0]; 
  
  function loadPlaylist(playlist: PlaylistObj) {
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
  const findPlaylist = (id: string) => (id === masterPlaylist?.id && masterPlaylist) || playlists.find(p => p.id === id)

  // Resolves filter index to track source index
  const getPlaylistIndexFromFilterIndex = (playlist: PlaylistObj, fIDX: number) => {
    let filterList = filteredLists[playlist.id]
    let key = asPlaylistTrack(filterList[fIDX])
    let targetTrackUUID = asPlaylistTrack(key).uuid
    return playlist.tracks.findIndex(t => asPlaylistTrack(t).uuid === targetTrackUUID)
  }

  const usedTracks = Array.from(new Set(playlists.map((p: PlaylistObj) => p.tracks).flat()));

  return (
    <div className={classes.root}>
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
      <Grid style={{ padding: '2%', width: '100%', paddingTop: 0 }} container spacing={5}>
        <DragDropContext
          onDragEnd={evt => {
            if (!evt.destination) return

            let sourcePlaylist = findPlaylist(evt.source.droppableId)
            let destPlaylist = findPlaylist(evt.destination.droppableId)
            if (!sourcePlaylist || !destPlaylist) throw new Error("Failed to find playlist")

            let sourceIdx = getPlaylistIndexFromFilterIndex(sourcePlaylist, evt.source.index)
            let destIdx = getPlaylistIndexFromFilterIndex(destPlaylist, evt.destination.index)

            if (sourcePlaylist === masterPlaylist) {

                console.log('drag from master');
  
                let trackCopy = asPlaylistTrack(masterPlaylist.tracks[sourceIdx]).clone!({
                  isCustom: true,
                  sourceID: masterPlaylist.id
                })

                const dest_newTracks = [...destPlaylist.tracks];
                dest_newTracks.splice(destIdx !== -1 ? destIdx : dest_newTracks.length, 0, trackCopy);
                destPlaylist.tracks = dest_newTracks

                setPlaylists([...playlists]) 

                return
            }

           
            const source_newTracks = [...sourcePlaylist.tracks];
            let removed = source_newTracks.splice(sourceIdx, 1)[0];

            if (sourcePlaylist !== destPlaylist) {
              // Move between playlists, also updating the destination playlist
              const dest_newTracks = [...destPlaylist.tracks];

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
                  sourceID: sourcePlaylist.id
                })

                // Remove item from source pool
                let sourcePlaylistPP = sourcePlaylist as PlaylistObjectPP
                let poolIdx = sourcePlaylistPP.sourcePool.findIndex(t => asPlaylistTrack(t).uuid === removedPP.uuid)
                if (poolIdx > -1) {
                  sourcePlaylistPP.sourcePool.splice(poolIdx, 1)
                }
              }

              dest_newTracks.splice(destIdx !== -1 ? destIdx : dest_newTracks.length, 0, removed);
              destPlaylist.tracks = dest_newTracks
            } else {
              source_newTracks.splice(destIdx, 0, removed);
            }
            
            sourcePlaylist.tracks = source_newTracks

            setPlaylists([...playlists])
          }}
        >
          <Grid item xs={4}>
            <PlaylistWrapper
              usedTracks={usedTracks}
              onSelect={p => loadPlaylist(p)}
              onFilterUpdate={tracks => masterPlaylist && (filteredLists[masterPlaylist.id] = tracks)}
            />
          </Grid>

          {masterPlaylist ? (
            <>
              {playlists.map(p => (
                <Grid item xs={4} key={p.id}>
                  <Subplaylist
                    genres={genres}
                    source={p.sourcePool}
                    playlist={p}
                    onDelete={() => deletePlaylist(p)}
                    onFilterUpdate={tracks => filteredLists[p.id] = tracks}
                  />
                </Grid>
              ))}
              <Grid item xs={1}>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => addPlaylist()}
                  startIcon={<AddIcon />}
                >
                  Add
              </Button>
              </Grid>
            </>
          ) : null}
        </DragDropContext>
      </Grid>
    </div>
  )
}

export default withRouter(Dashboard)
