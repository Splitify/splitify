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
  Card,
  CardActions,
  CardContent
} from '@material-ui/core'

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

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <List>
          {playlists.length > 0 ? (
            playlists.map(playlist => (
              <ListItem
                button
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
