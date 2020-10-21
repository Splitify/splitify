/* UI component to select a playlist */

import React, { useState } from 'react'

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
  TextField,
  InputAdornment
} from '@material-ui/core'

import SearchIcon from '@material-ui/icons/Search'

import { Playlist } from '../../types'
import { getPlaylists } from '../../helpers/helpers'

const useStyles = makeStyles({
  root: {
    minWidth: 300
  },
  content: {
    padding: 0
  }
})

export default function (props: { onSelect: (playlist: Playlist) => void }) {
  const classes = useStyles()

  async function handleRefresh () {
    setLoading(true)
    let res = await getPlaylists()
    setPlaylists(res)
    setLoading(false)
  }

  let [playlists, setPlaylists] = useState<Playlist[]>([])
  let [loading, setLoading] = useState(false)
  let [search, setSearch] = useState('')

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
        <List>
          {playlists
          .filter(p => p.name.toLowerCase()
          .includes(search))
          .length > 0 
          ? (
            playlists.map(playlist => (
              <ListItem
                button
                disabled={loading}
                key={playlist.id}
                onClick={() => props.onSelect(playlist)}
              >
                <ListItemText primary={playlist.name} />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary={'No playlists exist!'} />
            </ListItem>
          )}
        </List>
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
