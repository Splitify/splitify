import React, { useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Auth from '../../auth'
import MasterPlaylist from '../../components/MasterPlaylist'
import PlaylistWrapper from '../../components/PlaylistWrapper/'
import Subplaylist from '../../components/Subplaylist'
import { allGenresFromPlaylist, touchTrack } from "../../helpers/helpers";
import { Playlist as PlaylistObj, Track as TrackObj, PlaylistTrack as PlaylistTrackObj } from "../../types";
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

interface IDashboardProps extends RouteComponentProps {}

const Dashboard: React.FC<IDashboardProps> = () => {
  //The width of the grids have to be dynamic, not a fixed width
  const classes = useStyles()

  const [masterPlaylist, setMasterPlaylist] = useState<PlaylistObj>()
  const [genres, setGenres] = useState<string[]>([])

  const [filteredLists, setFilteredLists] = useState<{[id: string]: TrackObj[]}>({})


  function loadPlaylist (playlist: PlaylistObj) {
    playlist.expand().then(p => {
      Promise.all(p.tracks.map(t => t.expand())).then(() => {
        setMasterPlaylist(p)
        setGenres(allGenresFromPlaylist(p))
      })
    })
  }

  const addPlaylist = () => {
    const playlist = createPlaylist()
    console.log('Adding playlist', playlist.id)
    setPlaylists([...playlists, playlist])
  }

  const createPlaylist = (): PlaylistObj => {
    return {
      id: 'temp:' + uuid(),
      name: 'Playlist',
      description: '',
      image: '',
      owner: { id: 'owner', display_name: 'Owner' },
      snapshot_id: '',
      tracks: [],
      uri: '',
      expand: async function () {
        return this
      }
    }
  }

  const [playlists, setPlaylists] = useState<PlaylistObj[]>([createPlaylist()])

  const deletePlaylist = (playlist: PlaylistObj) => {
    console.log('Deleting playlist', playlist.id)
    setPlaylists(playlists.filter(p => p.id !== playlist.id))
  }

  // Find playlist object given its ID
  const findPlaylist = (id: string) => playlists.find(p => p.id === id)
    
  // Resolves filter index to track source index
  const getPlaylistIndexFromFilterIndex = (playlist: PlaylistObj, fIDX: number) => {
    let filterList = filteredLists[playlist.id]
    let targetTrackID = filterList[fIDX]?.id
    return playlist.tracks.findIndex(t => t.id === targetTrackID)
  }

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
      <Grid style={{ padding: '5%' }} container spacing={5}>
      <DragDropContext
            onDragEnd={evt => {
              console.info(evt)
              if (!evt.destination) return

              let sourcePlaylist = findPlaylist(evt?.source?.droppableId)
              let destPlaylist   = findPlaylist(evt?.destination?.droppableId)

              if (!sourcePlaylist || !destPlaylist) throw new Error("Failed to find filtered playlist view")

              let sourceIdx = getPlaylistIndexFromFilterIndex(sourcePlaylist, evt.source.index)
              let destIdx = getPlaylistIndexFromFilterIndex(destPlaylist, evt.destination.index)
              
              const source_newTracks = [...sourcePlaylist.tracks];

              let removed = source_newTracks.splice(sourceIdx, 1)[0];
              
              if (sourcePlaylist !== destPlaylist) {
                // Move between playlists, also updating the destination playlist
                const dest_newTracks = [...destPlaylist.tracks];
                if (!(removed as PlaylistTrackObj).isCustom) {
                  // FIXME: If moved back into a playlist which has the right genre selector, then set `isCustom` to false?
                  removed = touchTrack(removed, {
                    isCustom: true
                  })
                }

                dest_newTracks.splice(destIdx, 0, removed);
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
            component={MasterPlaylist}
            onSelect={p => loadPlaylist(p)}
          />
        </Grid>

        {masterPlaylist ? (
          <>
            {playlists.map(p => (
              <Grid item xs={4} key={p.id}>
                <Subplaylist
                  genres={genres}
                  source={masterPlaylist}
                  playlist={p}
                  onDelete={() => deletePlaylist(p)}
                  onFilterUpdate={tracks => setFilteredLists(list => ({...list, [p.id]: tracks}))}
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
