import * as React from 'react'
import {useContext, useEffect, useState} from 'react'
import AppContext from 'context'

import { TopProduct } from 'models/product'
import { topProducts } from 'services/apiClient'
import { List, Card } from 'antd'

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
        <Card title={top.product.name} bordered style={{width: '75%'}}>
          <p>price: {top.product.price}</p>
          <p>Description : { top.product.description}</p>
          <p>Number of products : { top.numberOfProducts }</p>
        </Card>
      </List.Item>
    }
    style={{width: '75%'}}
  />
}

export default TopProducts