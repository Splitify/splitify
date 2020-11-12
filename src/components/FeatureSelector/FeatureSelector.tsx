import React, { useEffect, useState } from 'react'
import { IconButton, ListItemSecondaryAction } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import { TrackFilter } from '../../types'

import { FeatureSliderData } from './FeatureSliderData'
import FeatureMenu from './FeatureMenu'
import AudioFeatureSlider from './AudioFeatureSlider'
import options from './Defaults'

export default function (props: {
  onUpdateFilterFunction: (f: TrackFilter) => void
  component: React.ElementType
  childComponent: React.ElementType
  filterIsActive?: (v: boolean) => void
}) {
  const Wrapper = props.component
  const ChildWrapper = props.childComponent

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

    if(props.filterIsActive && sliders.length === 0){
      props.filterIsActive(false)
    }else if(props.filterIsActive){
      props.filterIsActive(true)
    }

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
    <Wrapper>
      {sliders.length === options.length ? "" : (
        <ChildWrapper>
          <FeatureMenu onSelect={addSlider} hidden={sliders.map(el => el.name)} />
        </ChildWrapper>
      )}
      {sliders.map((p, index) => (
        <ChildWrapper key={index} style={{ paddingTop: 0, paddingBottom: 0 }}>
          <AudioFeatureSlider
            feature={p}
            delete={() => deleteSlider(p.name)}
            onFeatureUpdate={updateSlider}
          />
          <ListItemSecondaryAction >
            <IconButton onClick={() => deleteSlider(p.name)}>
              <CloseIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ChildWrapper>
      ))}
    </Wrapper>
  )
}
