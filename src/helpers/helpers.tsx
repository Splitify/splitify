export function getPlaylist() {
import { User } from '../types'
export async function getUserProfile (api: any) {
  // Get current user data
  api
    .getMe()
    .then(
      ({
        display_name,
export function parseUserJSON (json: any): User {
  return {
    id: json.id,
    display_name: json.display_name
  }
}
        id,
        images
      }: {
        display_name: string
        id: string
        images: Array<any>
      }) => {
        console.log(display_name)
        console.log(id)
        console.log(images)
      }
    )
}