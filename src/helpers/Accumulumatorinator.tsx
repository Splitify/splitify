// accumulator
export default class Accumulumatorinator<T> {
  private readonly callback: Function
  private readonly limit: Number

  private _accumulator: string[]
  private _promise: Promise<T[]>
  private _resolve: Function
  private _timeout?: number

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

  private newPromise () {
    this._accumulator = []
    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve
    })
  }

  /**
   * Request for an id. 
   * Returns a promise that will be resolved when the current accumulation finishes
   */
  request (id: string, instant?: boolean) {
    let accumulator = this._accumulator
    let length = accumulator.push(id)
    let currentPromise = this._promise

    if (length === 1) {
      this._timeout = setTimeout(() => this.finish(), 500)
    }
    if (length === this.limit || instant) {
      this.finish() // Reset accumulator and promise
    }

    return currentPromise.then(arr => arr[length - 1])
  }

  /**
   * Force the finalisation of the current accumulation
   */
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
