import { FeatureSliderData } from './FeatureSliderData'

const options: FeatureSliderData[] = [
  {
    id: 'acousticness',
    name: 'Acousticness',
    min: 0,
    max: 100,
    currentMin: 0,
    currentMax: 100,
    units: '%'
  },
  {
    id: 'danceability',
    name: 'Danceability',
    min: 0,
    max: 100,
    currentMin: 0,
    currentMax: 100,
    units: '%'
  },
  {
    id: 'energy',
    name: 'Energy',
    min: 0,
    max: 100,
    currentMin: 0,
    currentMax: 100,
    units: '%'
  },
  {
    id: 'instrumentalness',
    name: 'Instrumentalness',
    min: 0,
    max: 100,
    currentMin: 0,
    currentMax: 100,
    units: '%'
  },
  {
    id: 'liveness',
    name: 'Liveness',
    min: 0,
    max: 100,
    currentMin: 0,
    currentMax: 100,
    units: '%'
  },
  {
    id: 'speechiness',
    name: 'Speechiness',
    min: 0,
    max: 100,
    currentMin: 0,
    currentMax: 100,
    units: '%'
  },
  {
    id: 'valence',
    name: 'Valence',
    min: 0,
    max: 100,
    currentMin: 0,
    currentMax: 100,
    units: '%'
  },
  {
    id: 'loudness',
    name: 'Loudness',
    min: -60,
    max: 0,
    currentMin: -60,
    currentMax: 0,
    units: 'dB'
  },
  {
    id: 'tempo',
    name: 'Tempo',
    min: 50,
    max: 220,
    currentMin: 50,
    currentMax: 220,
    units: 'BPM'
  }
]

export default options
