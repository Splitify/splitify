import React, { useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

export default function Subplaylist (props: {
  onSort: (type: string) => void
}) {
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      formControl: {
        margin: theme.spacing(1),
        minWidth: 120
      }
    })
  )

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
      </Menu>
    </>
  )
}
