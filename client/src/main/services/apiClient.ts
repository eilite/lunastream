import { PagedProducts, TopProduct } from "models/product"

export const liveProducts = (store?: string) => {
  return new EventSource(`/api/liveproducts?${store && store !== "all" && "store=" + store || ""}`)
}

export const searchProducts = (query?: string, store?: string, from?: number) => {
  const url = `/search?${queryParam("q", query)}${queryParam("store", store)}${queryParam("from", from)}`
  return fetch(encodeURI(url))
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json().then(json => json as PagedProducts)
      } else {
        return Promise.reject()
      }
    })
}

export const topProducts = (numberOfProducts: number, store?: string) => {
  const url = `/top/${numberOfProducts}?${queryParam("store", store)}`
  return fetch(encodeURI(url))
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json().then(json => json as Array<TopProduct>)
      } else {
        return Promise.reject()
      }
    })
}

const queryParam = <T>(key: string, part?: T) => part !== undefined ? `${key}=${part}&` : ''