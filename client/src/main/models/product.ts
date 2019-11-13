export interface Product {
  id: number
  ean: string
  name: string
  description: string
  price?: number
  assembled: boolean
  weight: number
  dimension: Dimension
  date?: Date
}

export interface PagedProducts {
  total: number,
  from: number,
  products: Array<Product>
}

export interface TopProduct {
  numberOfSells: number
  product: Product
}

interface Dimension {
  width: number
  depth: number
  height: number
}
