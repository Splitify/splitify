import { FeatureSliderData } from './FeatureSliderData'

const options: FeatureSliderData[] = [
  {
    id: 'acousticness',
    name: 'Acousticness',
    min: 0,
    max: 100,
    currentMin: 0,
    currentMax: 100,
    units: '%',
    description : 'Acousticness is a confidence measure of whether the track is acoustic.'
  },
  {
    id: 'danceability',
    name: 'Danceability',
    min: 0,
    max: 100,
    currentMin: 0,
    currentMax: 100,
    units: '%',
    description : 'Danceability describes how suitable a track is for dancing'
  },
  {
    id: 'energy',
    name: 'Energy',
    min: 0,
    max: 100,
    currentMin: 0,
    currentMax: 100,
    units: '%',
    description : 'Energy represents a perceptual measure of intensity and activity.'
  },
  {
    id: 'instrumentalness',
    name: 'Instrumentalness',
    min: 0,
    max: 100,
    currentMin: 0,
    currentMax: 100,
    units: '%',
    description: 'Instrumentalness predicts whether a track contains no vocals.'
  },
  {
    id: 'liveness',
    name: 'Liveness',
    min: 0,
    max: 100,
    currentMin: 0,
    currentMax: 100,
    units: '%',
    description: 'Liveness detects the presence of an audience in the recording'
  },
  {
    id: 'speechiness',
    name: 'Speechiness',
    min: 0,
    max: 100,
    currentMin: 0,
    currentMax: 100,
    units: '%',
    description : 'Speechiness detects the presence of spoken words in a track'
  },
  {
    id: 'valence',
    name: 'Valence',
    min: 0,
    max: 100,
    currentMin: 0,
    currentMax: 100,
    units: '%',
    description: 'Valence describes the musical positiveness conveyed by a track'
  },
  {
    id: 'loudness',
    name: 'Loudness',
    min: -60,
    max: 0,
    currentMin: -60,
    currentMax: 0,
    units: 'dB',
    description : 'The overall loudness of a track in decibels'
  },
  {
    id: 'tempo',
    name: 'Tempo',
    min: 50,
    max: 220,
    currentMin: 50,
    currentMax: 220,
    units: 'BPM',
    description : 'The overall estimated tempo of a track in beats per minute'
  }
]

export default options
