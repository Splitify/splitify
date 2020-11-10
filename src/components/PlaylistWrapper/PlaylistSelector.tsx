/* UI component to select a playlist */

import React, { useState, useEffect } from 'react'

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
  InputAdornment,
  makeStyles
} from '@material-ui/core'

import SearchIcon from '@material-ui/icons/Search'

import { Playlist } from '../../types'
import { getPlaylist, getPlaylists } from '../../helpers/helpers'
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon'
import Checkbox from '@material-ui/core/Checkbox/Checkbox'

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

  async function handleRefresh() {
    setLoading(true)
    setPlaylists((playlistCache = await getPlaylists()))
    setLoading(false)
  }

  const [checked, setChecked] = React.useState<string[]>([]);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleSelection = async () => {
    console.log(checked);
    const playlists = await Promise.all(checked.map(async (s: string) => await getPlaylist(s, true)));
    const tracks = playlists.map((p: Playlist) => p.tracks).flat();
    const name = playlists.map((p: Playlist) => p.name).join(" + ");

    await props.onSelect({
      id: playlists[0].id,
      name: name,
      description: playlists[0].description,
      image: playlists[0].image,
      owner: playlists[0].owner,
      snapshot_id: playlists[0].snapshot_id,
      tracks: tracks,
      uri: playlists[0].uri,
      expand: playlists[0].expand, // TODO this doesn't make sense...
    })
  }
  
  const restrictSearch = (p: Playlist) =>
    p.name.toLowerCase().includes(search.toLowerCase())
    || checked.includes(p.id);

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
                        edge="start"
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
        <LinearProgress />
      </Fade>

      <CardActions>
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
