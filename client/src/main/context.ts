import { createContext } from 'react'

import { Product } from 'models/product'

export const routes = {
  home: '/',
  store: '/:store',
  storeMode : '/:store/:mode',
  notFound: '/notfound'
}

export type Mode = 'live' | 'search' | 'top'

export function isMode(input: string): input is Mode {
  return input === 'live' || input === 'search' || input === 'top'
}

export type RouteProps = { store?: string, mode?: Mode }

export interface AppState {
  currentStore: string
  currentMode: Mode
  currentProduct?: Product
}

export const initState: AppState = {
  currentMode: 'live',
  currentStore: 'all'
}

const AppContext = createContext({
  state: initState,
  setMode: (_: Mode) => {},
  setStore: (_: string) => {},
  setCurrentProduct: (_?: Product) => {}
})

export default AppContext