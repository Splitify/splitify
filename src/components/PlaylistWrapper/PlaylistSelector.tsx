/* UI component to select a playlist */

import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import {
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
  Paper,
  TextField,
  InputAdornment
} from '@material-ui/core'

import SearchIcon from '@material-ui/icons/Search'

import { Playlist } from '../../types'
import { getPlaylist, getPlaylists } from '../../helpers/helpers'

const useStyles = makeStyles({
  root: {
    minWidth: 300
  },
  content: {
    padding: 0
  }
})

let playlistCache: Playlist[] = [];

export default function (props: { onSelect: (playlist: Playlist) => void }) {
  const classes = useStyles()

  async function handleRefresh () {
    setLoading(true)
    setPlaylists((playlistCache = await getPlaylists()))
    setLoading(false)
  }
  
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
          <TextField
            label='Search'
            fullWidth
            variant='outlined'
            margin='normal'
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
            {playlists.filter(p =>
              p.name.toLowerCase().includes(search.toLowerCase())
            ).length > 0 ? (
              playlists.map(playlist => (
                <ListItem
                  button
                  disabled={loading}
                  key={playlist.id}
                  onClick={async () =>
                    props.onSelect(await getPlaylist(playlist.id))
                  }
                >
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
        <LinearProgress />
      </Fade>

      <CardActions>
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
