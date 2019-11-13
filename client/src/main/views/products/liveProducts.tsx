import * as React from 'react'
const { useContext, useEffect, useState } = React

import { liveProducts } from 'services/apiClient'
import AppContext from 'context'
import { Product } from 'models/product'
import { List } from 'antd'
import ProductCard from './productCard'

const LiveProducts = () => {
  const appContext = useContext(AppContext)

  const [products, setProducts] = useState<Array<Product>>([])
  const [liveProductsES, setliveProductsES] = useState<EventSource | undefined>()

  const addProducts = (newProducts: Array<Product>) => {
    setProducts([...newProducts, ...products].slice(0, 20))
  }

  useEffect(() => {
    const liveProductsES = liveProducts(appContext.state.currentStore)
    setliveProductsES(liveProductsES)
    liveProductsES.onmessage = e => addProducts(parseProducts(e.data))
    return () => liveProductsES.close()
  }, [])

  useEffect(() => {
    if(liveProductsES !== undefined) {
      liveProductsES.close()
      const newLiveProductsES = liveProducts(appContext.state.currentStore)
      setliveProductsES(newLiveProductsES)
      newLiveProductsES.onmessage = e => addProducts(parseProducts(e.data))
    }
    setProducts([])
  }, [appContext.state.currentStore])

  useEffect(() => {
    if(liveProductsES !== undefined) {
      liveProductsES.onmessage = e => addProducts(parseProducts(e.data))
    } 
  }, [products])

  return <List
    dataSource={products}
    renderItem={product =>
      <List.Item style={{display: 'flex', justifyContent: 'center'}}>
        <ProductCard product={product} width="75%"/>
      </List.Item>
    }
    style={{width: '75%'}}
  />
}

const parseProducts = (data: any | undefined) => {
  const jsonBody = data !== undefined && data as string || undefined
  return jsonBody && JSON.parse(jsonBody) as Array<Product> || []
}

export default LiveProducts