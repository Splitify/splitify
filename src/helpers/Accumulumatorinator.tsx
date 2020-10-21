// accumulator
export default class Accumulumatorinator<T> {
  callback: Function
  limit: Number

  _accumulator: string[]
  _promise: Promise<T[]>
  _resolve: Function
  _timeout?: number

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
    let length = accumulator.push(id)
    let currentPromise = this._promise

    if (length === 1) {
      this._timeout = setTimeout(() => this.finish(), 1000)
    }
    if (length === this.limit || instant) {
      this.finish() // Reset accumulator and promise
    }

    return async () => (await currentPromise)[length - 1]
  }

  async finish () {
    if (this._timeout !== undefined) {
      clearTimeout(this._timeout as number)
      this._timeout = undefined
    }

    // Get accumulator and resolve function
    let currentAccumulator = this._accumulator
    let currentResolver = this._resolve

    // Create a new promise structure in the mean time
    this.newPromise()

    // Resolve the promise
    currentResolver(await this.callback(currentAccumulator))
  }
}
