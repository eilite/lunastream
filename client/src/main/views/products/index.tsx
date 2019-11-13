import * as React from 'react'
const styles = require('./index.styl')

import { Switch, Route, Redirect } from 'react-router'
import { routes } from 'context'
import LiveProducts from './liveProducts'
import SearchProducts from './searchProducts'
import TopProducts from './topProducts'
import ProductModal from './productModal'

const Products = () => {
  return <div className={styles.productsContent}>
    <ProductModal />
    <Switch>
      <Route exact path={'/*/live'}>
        <LiveProducts />
      </Route>
      <Route exact path={'/*/search'}>
        <SearchProducts />
      </Route>
      <Route exact path={'/*/top'}>
        <TopProducts />
      </Route>
      <Route path={'*'}>
        <Redirect to={routes.notFound}/>
      </Route>
    </Switch>
  </div>
}

export default Products
