import React, { useState, useEffect } from 'react'
import { ListItemText, Typography } from '@material-ui/core'

import { Track as TrackObj } from '../../types'

import { isTrackCustom } from '../../helpers/helpers'
import TrackPopup from './TrackPopup'

let globalAudioPlayers: HTMLAudioElement[] = []

export default function Track (props: {
  track: TrackObj
  isDragging?: boolean
}): JSX.Element {
  const [popupAnchor, setPopupAnchor] = useState(null)

  const audio = props.track.preview_url && new Audio(props.track.preview_url)

  const handlePopoverOpen = (event: any) => {
    props.isDragging || setPopupAnchor(event.currentTarget)
  }

  const handlePopoverClose = () => {
    stopAudio()
    setPopupAnchor(null)
  }

  function stopAudio () {
    if (!audio) return
    globalAudioPlayers.forEach(a => a.pause())
    globalAudioPlayers = []
    audio.pause()
    audio.currentTime = 0
    audio.volume = 0
  }

  function startAudio () {
    if (!audio) return
    audio.currentTime = 0
    globalAudioPlayers.push(audio)
    audio.play()

    audio.volume = 0
    var fadeAudio = setInterval(function () {
      audio.volume += 0.04
      if (audio.volume >= 0.5) {
        clearInterval(fadeAudio)
      }
    }, 50)
  }

  const handlePreviewClick = () => {
    audio && (!audio.paused || audio.currentTime ? stopAudio : startAudio)()
  }

  useEffect(() => {
    return () => {
      stopAudio()
    }
    // eslint-disable-next-line
  }, [])

  return (
    <ListItemText disableTypography={true}>
      <Typography
        aria-haspopup='true'
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        onClick={handlePreviewClick}
        align='center'
        style={{
          userSelect: 'none',
          ...(isTrackCustom(props.track) && { textDecoration: 'underline' })
        }}
      >
        {props.track.name}
      </Typography>
      <TrackPopup track={props.track} anchor={popupAnchor} />
    </ListItemText>
  )
}
