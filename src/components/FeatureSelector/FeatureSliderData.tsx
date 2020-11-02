import { Features } from "../../types/Features"

export interface FeatureSliderData {
  id: keyof Features
  name: string
  min: number
  max: number
  currentMin: number
  currentMax: number
  units: string
}
