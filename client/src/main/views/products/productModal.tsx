import * as React from 'react'
import { useContext } from 'react'

import { Modal, Button } from 'antd'
import AppContext from 'context'

const ProductModal = () => {
  const appContext  = useContext(AppContext)

  const onClose = () => appContext.setCurrentProduct(undefined)
  const { currentProduct } = appContext.state

  return <Modal
    title={currentProduct && currentProduct.name}
    visible={currentProduct !== undefined}
    onCancel={onClose}
    footer={[<Button key="submit" type="primary" onClick={onClose}>
        Ok
      </Button>
    ]}
  >
    {
      currentProduct &&
      <>
        <p>Assembled : {currentProduct.assembled ? 'yes' : 'no'}</p>
        <p>Description : {currentProduct.description}</p>
        <p>Weight : {currentProduct.weight}</p>
        { currentProduct.date && <p>Date : {currentProduct.date}</p> }
        { currentProduct.price && <p>Price : {currentProduct.price}</p> }
        {
          <p>Dimensions (height-width-depth) : {currentProduct.dimension.height}-{currentProduct.dimension.width}-{currentProduct.dimension.depth}
          </p>
        }
        { currentProduct.ean && <p>EAN : {currentProduct.ean}</p> }
      </>
    }
  </Modal>
}

export default ProductModal
