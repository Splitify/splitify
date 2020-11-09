import React from 'react';
import { FeatureSliderData } from './FeatureSliderData'
import { Button, Menu, MenuItem } from '@material-ui/core';
import Options from "./Defaults"

export default function FeatureMenu(props: {
    onSelect: (option: FeatureSliderData) => void
    hidden: string[]
  }) {
    
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClose = () => {
      setAnchorEl(null);
    };
    const handleMenuOpen = (event: any) => {
      setAnchorEl(event.currentTarget);
    };
    
    return (
      <div>
        <Button aria-controls="feature-menu" aria-haspopup="true" onClick={handleMenuOpen}>
          Add Feature Filter
        </Button>
        <Menu
          id="feature-menu"
          anchorEl={anchorEl}
          keepMounted
          open={!!anchorEl}
          onClose={handleClose}
        >
          {Options.filter(o => !props.hidden.includes(o.name)).map(o => (<MenuItem onClick={() => props.onSelect(o)}>{o.name}</MenuItem>))}
        </Menu>
      </div>
    );
  }
  