import { FeatureSliderItem as FeatureSliderItemObj} from '../../types'
import React from 'react';
import { Button, Menu, MenuItem } from '@material-ui/core';



export default function FeatureMenu(props: {
    onSelect: (option: FeatureSliderItemObj) => void
    hidden: string[]
  }) {
    const options = [
      {name: 'Acousticness', min:0, max:100, currentMin:0, currentMax:100, units: '%'}, 
      {name: 'Danceability', min:0, max:100, currentMin:0, currentMax:100, units: '%'},
      {name: 'Energy', min:0, max:100, currentMin:0, currentMax:100, units: '%'},
      {name:'Instrumentalness', min:0, max:100, currentMin:0, currentMax:100, units: '%'},
      {name: 'Liveness', min:0, max:100, currentMin:0, currentMax:100, units: '%'},
      {name: 'Speechiness', min:0, max:100, currentMin:0, currentMax:100, units: '%'}, 
      {name: 'Valence', min :0, max:100, currentMin:0, currentMax:100, units: '%'},
      {name: 'Loudness', min: -60, max:0, currentMin:-60, currentMax:0, units: 'dB'},
      {name: 'Tempo', min:50, max:220, currentMin:50, currentMax:220, units: 'BPM'}].filter(o => !props.hidden.includes(o.name));
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
          Add Audio Feature
        </Button>
        <Menu
          id="feature-menu"
          anchorEl={anchorEl}
          keepMounted
          open={!!anchorEl}
          onClose={handleClose}
        >
          {options.map(o => (<MenuItem onClick={() => props.onSelect(o)}>{o.name}</MenuItem>))}
        </Menu>
      </div>
    );
  }
  