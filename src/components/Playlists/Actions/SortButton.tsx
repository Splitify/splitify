import React, { useState } from 'react'
import { Button, Menu, MenuItem, makeStyles } from '@material-ui/core'
import SortIcon from '@material-ui/icons/Sort'

export default function SortButton (props: {
  onSort: (type: string) => void
}) {
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
        variant='contained'
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