import React, { useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Auth from '../../auth'
import PlaylistWrapper from '../../components/PlaylistWrapper/'
import Subplaylist from '../../components/Subplaylist'
import { allGenresFromPlaylist, asPlaylistTrack, isTrackCustom, touchTrack } from "../../helpers/helpers";
import { Blacklist, Playlist as PlaylistObj, Track as TrackObj } from "../../types";
import { Grid, Button, makeStyles} from '@material-ui/core';
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
  const [checked, setChecked] = useState<Blacklist[]>([{id: "", tracks: []}])

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
  const [blacklists, setBlacklists] = useState<Blacklist[]>([{id: "", tracks: []}])

  const addPlaylist = () => {
    const playlist = createPlaylist()
    console.log('Adding playlist', playlist.id)
    setPlaylists([...playlists, playlist])
    var blacklist = {
      id: playlist.id,
      tracks: []
    }
    setBlacklists([...blacklists, blacklist])
  }

  const deletePlaylist = (playlist: PlaylistObj) => {
    console.log('Deleting playlist', playlist.id)
    delete filteredLists[playlist.id]
    setPlaylists(playlists.filter(p => p.id !== playlist.id))
  }

  // Find playlist object given its ID
  const findPlaylist = (id: string) => (id === masterPlaylist?.id && masterPlaylist) || playlists.find(p => p.id === id)
  const findBlacklist = (id: string) => (blacklists.find(blacklist => blacklist.id === id))
  const findChecked = (id: string) => (checked.find(playlist => playlist.id === id))

  // Resolves filter index to track source index
  const getPlaylistIndexFromFilterIndex = (playlist: PlaylistObj, fIDX: number) => {
    let filterList = filteredLists[playlist.id]
    let key = asPlaylistTrack(filterList[fIDX])
    let targetTrackUUID = asPlaylistTrack(key).uuid
    return playlist.tracks.findIndex(t => asPlaylistTrack(t).uuid === targetTrackUUID)
  }

  const toggleChecked = (id: string, track: TrackObj) => () => {
    let checkedPlaylist = findChecked(id)
    if (!checkedPlaylist) throw new Error("Failed to find checked list")

    const currentIndex = checkedPlaylist!.tracks.indexOf(track);

    if (currentIndex === -1) {
      checkedPlaylist.tracks.push(track);
    } else {
      checkedPlaylist.tracks.splice(currentIndex, 1);
    }
    setChecked([...checked]);
    console.log(checked)
  };

  const updateBlacklist = () => {
    let playlistID
    let tracks: TrackObj[]
    let sourceBlacklist: Blacklist | undefined
    checked.map((playlist) => {
      playlistID = playlist.id
      tracks = playlist.tracks
      sourceBlacklist = findBlacklist(playlistID)
      if (!sourceBlacklist) throw new Error("Failed to find checked list")
      tracks.map((track) => {if (!sourceBlacklist!.tracks.includes(track)) {
        sourceBlacklist!.tracks.push(track)
      }})
    })
    setBlacklists([...blacklists])
    let allChecked = checked
    allChecked.map((checkedPlaylist) => checkedPlaylist.tracks = [])
    setChecked([...checked])
  }

  const usedTracks = Array.from(new Set(playlists.map((p: PlaylistObj) => p.tracks).flat()));

  return (
    <div className={classes.root}>
      <Button
        variant='contained'
        color='primary'
        onClick={() =>
          Auth.logout().then(() => {
            window.location.href = window.location.origin + '/'
          })
        }
      >
        Logout
      </Button>
      <Button
        variant='contained'
        onClick={updateBlacklist}
      >
        Remove Selected Songs
      </Button>
      <Grid style={{ padding: '5%' }} container spacing={5}>
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
              if (isTrackCustom(removed)) {
                if (asPlaylistTrack(removed).sourceID === destPlaylist.id) {
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
                    toggleChecked={toggleChecked}
                    genres={genres}
                    source={p.sourcePool}
                    playlist={p}
                    onDelete={() => deletePlaylist(p)}
                    onFilterUpdate={tracks => filteredLists[p.id] = tracks}
                    checked = {checked}
                  />
                </Grid>
              ))}
              <Grid item xs={2}>
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
