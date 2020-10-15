export function getPlaylist() {
    
export async function getUserProfile (api: any) {
  // Get current user data
  api
    .getMe()
    .then(
      ({
        display_name,
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