import * as React from 'react'
import {useContext} from 'react'

import { Card } from 'antd'

import {Product} from 'models/product'
import AppContext from 'context'

interface Props {
  product: Product
  width?: string
  dateLabel?: string
}
const ProductCard = (props: Props) => {
  const appContext = useContext(AppContext)
  const { product, dateLabel = "Date : " } = props
  return <Card
    title={product.name}
    bordered
    style={{width: props.width}}
    hoverable
    onClick={() => appContext.setCurrentProduct(product)}
  >
    <p>Price : {product.price}</p>
    <p>Description : { product.description}</p>
    { 
      product.date &&
      <p>{dateLabel}{new Date(product.date).toLocaleDateString()} at {new Date(product.date).toLocaleTimeString() }</p>
    }
  </Card>
}

export default ProductCard
