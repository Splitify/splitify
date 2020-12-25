/* UI component to select a playlist */

import React, { useState, useEffect } from 'react'
import {
  Checkbox,
  Fade,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  ListItemIcon,
  Paper,
  TextField,
  InputAdornment,
  makeStyles,
  Typography
} from '@material-ui/core'

import SearchIcon from '@material-ui/icons/Search'

import { Playlist } from '../../types'
import {
  getPlaylist,
  getPlaylists,
  getUserProfile
} from '../../helpers/helpers'

import { getLikedSongs } from '../../helpers/parsers'

const useStyles = makeStyles({
  root: {
    minWidth: 300
  },
  content: {
    padding: 0
  },
  actions: {
    justifyContent: 'space-evenly'
  },
  colorPrimary: {
    backgroundColor: '#4dc088'
  },
  barColorPrimary: {
    backgroundColor: '#699fd5'
  }
})

const likedPlaylistStub: Playlist = {
  id: 'liked-songs',
  name: 'Liked Songs',
  description: '',
  image: '',
  owner: { id: '', display_name: '' },
  snapshot_id: '',
  tracks: [],
  uri: '',
  public: false,
  collaborative: false,
  expand: async function () {
    return this
  }
}

let playlistCache: Playlist[] = []

export default function (props: { onSelect: (playlist: Playlist) => void }) {
  const classes = useStyles()

  async function handleRefresh () {
    setLoading(true)
    setPlaylists(
      (playlistCache = [likedPlaylistStub].concat(await getPlaylists()))
    )
    setLoading(false)
  }

  const [checked, setChecked] = useState<string[]>([])

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  const handleSelection = async () => {
    setLoading(true)

    let playlists = await Promise.all(
      checked
        .filter(s => s !== likedPlaylistStub.id)
        .map(async (s: string) => await getPlaylist(s, true))
    )

    if (checked.includes(likedPlaylistStub.id)) {
      likedPlaylistStub.tracks = await getLikedSongs(true)
      likedPlaylistStub.owner = await getUserProfile()
      playlists = [likedPlaylistStub].concat(playlists)
    }

    const tracks = playlists.map((p: Playlist) => p.tracks).flat()
    const name = playlists.map((p: Playlist) => p.name).join(' + ')
    const id = playlists.map(p => p.id).join('')

    await props.onSelect({
      id: id,
      name: name,
      description: playlists[0].description,
      image: playlists[0].image,
      owner: playlists[0].owner,
      public: false,
      collaborative: false,
      snapshot_id: playlists[0].snapshot_id,
      tracks: tracks,
      uri: playlists[0].uri,
      expand: async function () {
        return this
      }
    })
    setLoading(false)
  }

  const restrictSearch = (p: Playlist) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    checked.includes(p.id)

  let [playlists, setPlaylists] = useState<Playlist[]>(playlistCache)
  let [loading, setLoading] = useState(false)
  let [search, setSearch] = useState('')

  useEffect(() => {
    handleRefresh()
  }, [])

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <Box m={1}>
          <Typography
            variant='h5'
            gutterBottom
            align='center'
            style={{ userSelect: 'none' }}
          >
            Select playlists to split from
          </Typography>
        </Box>
        <Box m={2}>
          <TextField
            label='Search'
            fullWidth
            // variant='outlined'
            margin='normal'
            disabled={loading}
            onChange={evt => setSearch(evt.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Box>
        <Paper
          elevation={0}
          square={true}
          style={{ maxHeight: 500, overflow: 'auto' }}
        >
          <List>
            {playlists.filter(restrictSearch).length > 0 ? (
              playlists.filter(restrictSearch).map(playlist => (
                <ListItem
                  button
                  disabled={loading}
                  key={playlist.id}
                  dense
                  onClick={handleToggle(playlist.id)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge='start'
                      checked={checked.indexOf(playlist.id) !== -1}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={playlist.name} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText
                  primary={'No playlists exist!'}
                  secondary={search ? 'Try a different search term' : ''}
                />
              </ListItem>
            )}
          </List>
        </Paper>
      </CardContent>
      <Fade in={loading}>
        <LinearProgress
          classes={{
            colorPrimary: classes.colorPrimary,
            barColorPrimary: classes.barColorPrimary
          }}
        />
      </Fade>

      <CardActions className={classes.actions}>
        <Button
          size='small'
          color='primary'
          onClick={handleSelection}
          disabled={loading || checked.length === 0}
        >
          Load
        </Button>
        <Button
          size='small'
          color='primary'
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </CardActions>
    </Card>
  )
}
