import React, { useState } from 'react';
import { FeatureSliderData } from './FeatureSliderData'
import { Box, Button,  List,  ListItem,  makeStyles, Menu, MenuItem, Paper, Popover } from '@material-ui/core';
import { Info as InfoIcon } from '@material-ui/icons';

import Options from "./Defaults"

const useStyles = makeStyles(theme => ({
  popover: {
    pointerEvents: 'none'
  },
  paper: {
    padding: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1),
    whiteSpace: "nowrap"
  },
  root: {
    width: '100%',
    minWidth: 200
  }
}))

export default function FeatureMenu(props: {
    onSelect: (option: FeatureSliderData) => void
    hidden: string[]
  }) {
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClose = () => {
      setAnchorEl(null);
    };
    const handleMenuOpen = (event: any) => {
      setAnchorEl(event.currentTarget);
    };
    const [popupAnchor, setPopupAnchor] = useState(null)
    
    return (
      <div className = {classes.root}>
        <List component={Paper} disablePadding={true}>
            <ListItem style={{justifyContent:"space-between"}}> 
              <Button className={classes.button}  aria-controls="feature-menu" aria-haspopup="true" onClick={handleMenuOpen} >
                Add Feature Filter
              </Button>
              <Menu
                id="feature-menu"
                anchorEl={anchorEl}
                keepMounted
                open={!!anchorEl}
                onClose={handleClose}
              >
                {Options.filter(o => !props.hidden.includes(o.name)).map((o, index) => (<MenuItem key={index} onClick={() => props.onSelect(o)}>{o.name}</MenuItem>))}
              </Menu>

              <Box style={{ padding: 12 }}>
                  <InfoIcon
                    onMouseEnter={(event: any) => setPopupAnchor(event.currentTarget)}
                    onMouseLeave={() => setPopupAnchor(null)}
                  />
                </Box>
              <Popover
                  id='mouse-over-popover'
                  className={classes.popover}
                  classes={{
                    paper: classes.paper
                  }}
                  open={!!popupAnchor}
                  anchorEl={popupAnchor}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                  }}
                  disableRestoreFocus
                 >
                {popupAnchor == null ? "" : "These features make up a song"}
              </Popover>
            </ListItem>
         </List>
      </div>
    );
  }
  