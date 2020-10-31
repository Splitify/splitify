import React, { useEffect, useState } from 'react'
import { TableCell, TableRow, Button } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import { TrackFilter } from '../../types'

import { FeatureSliderData } from './FeatureSliderData'
import FeatureMenu from './FeatureMenu'
import AudioFeatureSlider from './AudioFeatureSlider'

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
      <TableRow>
        <TableCell colSpan={100}>
          <FeatureMenu
            onSelect={addSlider}
            hidden={sliders.map(el => el.name)}
          />
        </TableCell>
      </TableRow>
      {sliders.map(p => (
        <TableRow>
          <TableCell size='small' colSpan={2}>
            <AudioFeatureSlider
              feature={p}
              delete={() => deleteSlider(p.name)}
              onFeatureUpdate={updateSlider}
            />
          </TableCell>
          <TableCell colSpan={1}>
            <Button
              variant='contained'
              color='secondary'
              onClick={() => deleteSlider(p.name)}
              size={'small'}
              startIcon={<DeleteIcon />}
            />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}
