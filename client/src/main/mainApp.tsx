import * as React from 'react'
import {useContext, useEffect, useState} from 'react'
import { useHistory, Route, Switch, Redirect, useParams } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd'
import "antd/dist/antd.css"
import { Item } from 'rc-menu'
import AppContext, { routes, AppState, initState, Mode, RouteProps, isMode } from 'context'
import Products from 'views/products'

const styles = require('app.styl')

const { Content, Header, Sider, } = Layout

const stores : Array<{store: string, label: string}> = [{
  store: 'all',
  label: 'all stores'
}, {
  store: '0',
  label: 'store 0'
}, {
  store: '1',
  label: 'store 1'
}]

const modes: Array<{mode: Mode, label: string, icon: string}> = [{
  mode: 'live',
  label: 'Live',
  icon: 'thunderbolt'
}, {
  mode: 'search',
  label: 'Search',
  icon: 'search'
}, {
  mode: 'top',
  label: 'Top sells',
  icon: 'bar-chart'
}]

const App = () => {
  const params = useParams<RouteProps>()
  const init: AppState = {
    currentStore: stores.map(i => i.store).includes(params.store || '') && params.store || initState.currentStore,
    currentMode: params.mode && isMode(params.mode) && params.mode || initState.currentMode
  }
  const [state, setState] = useState<AppState>(init)
  const history = useHistory()

  useEffect(() => {
    history.push(`/${state.currentStore}/${state.currentMode}`)
  }, [state.currentMode, state.currentStore])

  return <AppContext.Provider value={{
    state,
    setMode: mode => setState({...state, currentMode: mode}),
    setStore: store => stores.map(s => s.store).includes(store) && setState({...state, currentStore: store}),
    setCurrentProduct: currentProduct => setState({...state, currentProduct})
  }}>
    <Header className={styles.title}>
      Lunastream
    </Header>
    <Layout>
      <AppSider />
      <AppContent>
        <Products />
      </AppContent>
    </Layout>
  </AppContext.Provider>
}

const AppSider = () => {
  const appContext = useContext(AppContext)
  const { currentStore } = appContext.state

  return <Sider>
    <Menu
      mode="inline"
      defaultSelectedKeys={[currentStore]}
      style={{ height: '100%', borderRight: 0 }}
      onSelect={item => appContext.setStore(item.key)}
    >
      {
        stores.map(s =>
          <Item id={`store-${s.store}`} key={s.store}>
            <span>{s.label}</span>
          </Item>
        )
      }
    </Menu>
  </Sider>
}

const AppContent = (props: {children: React.ReactNode}) => {
  const appContext = useContext(AppContext)
  const { currentMode } = appContext.state

  return <Layout>
    <Content style={{padding: '10px'}}>
      <Menu 
        onClick={item => appContext.setMode(item.key as Mode)}
        style={{display: 'flex', justifyContent: 'center'}}
        selectedKeys={[currentMode]}
        mode="horizontal"
      >
        {
          modes.map(mode =>
            <Item key={mode.mode}>
              <Icon type={mode.icon} />
              <span>{mode.label}</span>
            </Item>
          )
        }
      </Menu>
      {
        props.children
      }
    </Content>
  </Layout>
}

export default () => <BrowserRouter>
  <Layout className={styles.layout}>
    <Switch>
      <Route exact path={routes.notFound}>
        Not found
      </Route>
      <Route exact path={[routes.storeMode, routes.store, routes.home]}>
        <App />
      </Route>
      <Route path={'*'}>
        <Redirect to={routes.notFound}/>
      </Route>
    </Switch>
  </Layout>
</BrowserRouter>
