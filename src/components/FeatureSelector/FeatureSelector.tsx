import React, { useEffect, useState } from 'react'
import { Button } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import { TrackFilter } from '../../types'

import { FeatureSliderData } from './FeatureSliderData'
import FeatureMenu from './FeatureMenu'
import AudioFeatureSlider from './AudioFeatureSlider'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'


export default function (props: {
  onUpdateFilterFunction: (f: TrackFilter) => void
}) {
  const [sliders, setSliders] = useState<FeatureSliderData[]>([])

  useEffect(() => {
    props.onUpdateFilterFunction(track => {
      // If track does not have features, pass it through
      if (!track.features) return true

      return sliders.every(slider => {
        let value = track!.features![slider.id]

        if (slider.id === 'loudness' || slider.id === 'tempo') {
          return value >= slider.currentMin && value <= slider.currentMax
        }

        return (
          value >= slider.currentMin / 100 && value <= slider.currentMax / 100
        )
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliders])

  // Append a slider
  const addSlider = (option: FeatureSliderData) => {
    if (!sliders.find(slider => slider.name === option.name)) {
      setSliders([...sliders, option])
    }
  }

  // Remove a slider
  const deleteSlider = (id: string) => {
    setSliders(sliders.filter(k => k.name !== id))
  }

  // Update the value of a slider
  const updateSlider = (id: string, range: number[]) => {
    setSliders(
      sliders.map(el =>
        el.name === id
          ? { ...el, currentMin: range[0], currentMax: range[1] }
          : el
      )
    )
  }

  return (
    <>
      <ListItem>
        <FeatureMenu onSelect={addSlider} hidden={sliders.map(el => el.name)} />
      </ListItem>
      {sliders.map(p => (
        <ListItem>
          <AudioFeatureSlider
            feature={p}
            delete={() => deleteSlider(p.name)}
            onFeatureUpdate={updateSlider}
          />
          <Button
            variant='contained'
            color='secondary'
            onClick={() => deleteSlider(p.name)}
            size={'small'}
            startIcon={<DeleteIcon />}
          />
        </ListItem>
      ))}
    </>
  )
}
