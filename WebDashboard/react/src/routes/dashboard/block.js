// stable
import React from 'react'
import FontAwesome from 'react-fontawesome'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

export const Block = ({ title, stats, imgSrc, color }) => {
  return (
    <div className="acb-details-block">
      <div className="acb-details-data">
        <div className="acb-details-desc">
          <FormattedMessage id={title} defaultMessage={'--'} />
        </div>
        <div className="acb-details-desc desc-info">{stats}</div>
      </div>
      <div className="acb-details-img">
        <FontAwesome
          name={imgSrc}
          size="3x"
          style={{
            textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)',
            color: color
          }}
        />
      </div>
    </div>
  )
}
Block.propTypes = {
  title: PropTypes.string,
  stats: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  imgSrc: PropTypes.string,
  color: PropTypes.string
}
