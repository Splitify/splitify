import React, { useState } from 'react'
import { Button, Menu, MenuItem, makeStyles } from '@material-ui/core'
import SortIcon from '@material-ui/icons/Sort'

import { Track as TrackObj } from '../../../types/Track'

export default function SortButton (props: { onSort: (type: string) => void }) {
  const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1)
    }
  }))

  const classes = useStyles()

  const [anchorEl, setAnchorEl] = useState(null)
  const handleMenuClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const doClick = (val: string) => {
    props.onSort(val)
    handleMenuClose()
  }

  return (
    <>
      <Button
        className={classes.formControl}
        onClick={handleMenuClick}
        aria-haspopup='true'
        // variant='contained'
        startIcon={<SortIcon />}
      >
        Sort
      </Button>

      <Menu
        id='sort-select'
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => doClick('Track Name')}>Track Name</MenuItem>
        <MenuItem onClick={() => doClick('Artist')}>Artist</MenuItem>
        <MenuItem onClick={() => doClick('Album')}>Album</MenuItem>
        <MenuItem onClick={() => doClick('Popularity')}>Popularity</MenuItem>
      </Menu>
    </>
  )
}

function padNumber (n: Number): string {
  return n.toString().padStart(5, '0')
}

export function sortFunction (
  type: string,
  track1: TrackObj,
  track2: TrackObj
): number {
  let var1: string = ''
  let var2: string = ''

  switch (type) {
    case 'Track Name':
      var1 = track1.name
      var2 = track2.name
      break
    case 'Artist':
      var1 = track1.artists[0].name
      var2 = track2.artists[0].name
      break
    case 'Album':
      if (track1.album) {
        var1 = track1.album.name + padNumber(track1.track_number)
      }
      if (track2.album) {
        var2 = track2.album.name + padNumber(track2.track_number)
      }
      break
    case 'Popularity':
      var1 = padNumber(track2.popularity)
      var2 = padNumber(track1.popularity)
      break
    default:
      var1 = track1.name
      var2 = track2.name
  }
  return var1.localeCompare(var2)
}
