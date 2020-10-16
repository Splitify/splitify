import storage from 'localforage'

const defaults = {
  name: 'Splitify'
}

export function getStorage (storeName?: string) {
  return storage.createInstance({ ...defaults, storeName })
}
