import * as React from 'react'
import {useContext, useEffect, useState} from 'react'
import AppContext from 'context'

import { TopProduct } from 'models/product'
import { topProducts } from 'services/apiClient'
import { List } from 'antd'
import ProductCard from './productCard'

const TopProducts = () => {
  const appContext = useContext(AppContext)
  const [products, setTopProducts] = useState<Array<TopProduct>>([])

  const store = appContext.state.currentStore !== 'all' ? appContext.state.currentStore : undefined
  
  useEffect(() => {
    topProducts(10, store).then(products => setTopProducts(products))
  }, [])

  useEffect(() => {
    if(products !== undefined) {
      topProducts(10, store).then(products => setTopProducts(products))
    }
  }, [appContext.state.currentStore])

  return <List
    dataSource={products}
    renderItem={top =>
      <List.Item style={{display: 'flex', justifyContent: 'center'}}>
        <ProductCard product={top.product} width="75%" dateLabel="Last sale : "/>
      </List.Item>
    }
    style={{width: '75%'}}
  />
}

export default TopProducts