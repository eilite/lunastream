import * as React from 'react'
import {useContext, useEffect, useState} from 'react'

const styles = require('./index.styl')

import Search from 'antd/lib/input/Search'
import { List, Card, Statistic } from 'antd'
import { PagedProducts } from 'models/product'
import { searchProducts } from 'services/apiClient'
import AppContext from 'context'
import { PaginationConfig } from 'antd/lib/table'

const SearchProducts = () => {
  const appContext = useContext(AppContext)
  
  const [pagedProducts, setPagedProducts] = useState<PagedProducts>({from: 0, total: 0, products: []})
  const [query, setQuery] = useState<string | undefined>()
  const [page, setPage] = useState<number>(0)

  const pageSize = 20
  
  useEffect(() => { search() }, [])
  
  useEffect(() => {
    search()
  }, [appContext.state.currentStore])

  useEffect(() => {
    search(page)
  }, [page])

  const search = (page?: number) => {
    const store = appContext.state.currentStore !== "all" && appContext.state.currentStore || undefined
    const from = page !== undefined && 20 * page || undefined
    searchProducts(query, store, from).then(products => setPagedProducts(products))
  }
  
  const paginationConfig: PaginationConfig = {
    position: 'bottom',
    total: pagedProducts.total,
    defaultPageSize: pageSize,
    onChange: setPage,
    style: { display: 'flex', justifyContent: 'center'}
  }
  const listHeader = <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    <Search
      placeholder="input search text"
      onSearch={() => search(0)}
      onChange={search => {
        const value = search.target.value
        setQuery(value !== "" && value || undefined)
      }}
      style={{ width: 200, marginRight: 20, display: 'flex', justifyContent: 'center' }}
    />
    <span>
      Total : {pagedProducts.total}
    </span>
  </div>

  return <List
    header={listHeader}
    grid={{ gutter: 16, column: 4 }}
    dataSource={pagedProducts.products}
    renderItem={product => (
      <List.Item>
        <Card title={product.name} bordered>
          <p>price: {product.price}</p>
          <p>Description : { product.description}</p>
        </Card>
      </List.Item>
    )}
    pagination={paginationConfig}
  />
}

export default SearchProducts