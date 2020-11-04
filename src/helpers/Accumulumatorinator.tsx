import { getStorage } from './localStorage'

// accumulator
export class Accumulumatorinator<T> {
  callback: Function
  limit: Number

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

export class CachingAccumulumatorinator<T> extends Accumulumatorinator<T> {
  private readonly cache: LocalForage
  private readonly cacheName: string
  constructor (
    cacheName: string,
    limit: Number,
    callback: (ids: string[]) => any
  ) {
    super(limit, callback)
    this.cache = getStorage((this.cacheName = cacheName))
  }

  async request (id: string, instant?: boolean): Promise<T> {
    let hit = await this.cache.getItem(id)
    if (hit) {
      // console.info(`${this.cacheName}:${id} found in cache`);
      return hit as T
    }

    let data = await super.request(id, instant)
    this.cache.setItem(id, data)
    return data
  }
  
  
  async requestURL (id: string, urlparams: string, instant?: boolean): Promise<T> {
    let hit = await this.cache.getItem(id)
    if (hit) {
      console.info(`${this.cacheName}:${id} found in cache`);
      return hit as T
    }
    console.log(id, urlparams)

    let data = await super.request(urlparams, instant)
    console.log(data);
    this.cache.setItem(id, data)
    return data
  }
}
