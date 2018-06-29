import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import './styles.scss'

const ErrorMessages = {
  networkError: 'No Internet Connection',
  default: 'Something went wrong'
}

const ErrorHandler = ({ error }) => {
  let errorMsg = ErrorMessages.default

  if (_.get(error, 'networkError')) {
    errorMsg = ErrorMessages.networkError
  }
  return (
    <div className="error-container">
      <span className="error-text">{errorMsg}</span>
    </div>
  )
}
ErrorHandler.propTypes = {
  error: PropTypes.object
}
export default ErrorHandler
