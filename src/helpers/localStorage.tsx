import storage from 'localforage'

const defaults = {
  name: 'Splitify'
}

export function getStorage (storeName?: string): LocalForage {
  return storage.createInstance({ ...defaults, storeName })
}
