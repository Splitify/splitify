// accumulator
export default class Accumulumatorinator<T> {
  callback: Function
  limit: Number

  _accumulator: string[]
  _promise: Promise<T[]>
  _resolve: Function

  constructor (limit: Number, callback: (ids: string[]) => any) {
    this.callback = callback
    this.limit = limit

    /* BEGIN Stubs */
    this._accumulator = []
    this._promise = new Promise((resolve, reject) => {})
    this._resolve = function () {}
    /* END Stubs */

    this.newPromise()
  }

  newPromise () {
    this._accumulator = []
    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve
    })
  }

  request (id: string, instant?: boolean) {
    let accumulator = this._accumulator
    let position = accumulator.push(id) - 1
    let currentPromise = this._promise

    if (position + 1 === this.limit || instant) {
      this.finish() // Reset accumulator and promise
    }

    return async () => (await currentPromise)[position]
  }

  async finish () {
    // Get accumulator and resolve function
    let currentAccumulator = this._accumulator
    let currentResolver = this._resolve

    // Create a new promise structure in the mean time
    this.newPromise()

    // Resolve the promise
    currentResolver(await this.callback(currentAccumulator))
  }
}
