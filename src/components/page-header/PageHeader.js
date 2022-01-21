import React from 'react'

import './page-header.scss'

import bg from '../../assets/footer-bg.jpg'

const PageHeader = props => {
  return (
    <div>
      <div className="page__header" style={{ backgroundImage: `url(${bg})` }}>
        <h2>{ props.children }</h2>
      </div>
    </div>
  )
}

export default PageHeader
