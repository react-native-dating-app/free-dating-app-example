import React from 'react'
import { PieChart } from 'react-easy-chart'
import { FormattedMessage } from 'react-intl'

export const Chart = props => {
  return (
    <div className="acb-pieChart-block">
      <div className="acb-pieChart">
        <PieChart
          size={props.size}
          innerHoleSize={props.innerHoleSize}
          data={props.data}
        />
      </div>
      <div className="acb-pieChart-details">
        <div className="acb-pieChart-title">
          <FormattedMessage id={props.title} defaultMessage={'--'} />
        </div>
        <div className="acb-pieChart-desc">
          <div className="acb-pieChart-desc-info">
            <span className="info-block1" />
            <FormattedMessage
              id={props.firstParameter}
              defaultMessage={'--'}
            />{' '}
            : {props.data[0].value}{' '}
          </div>
          <div className="acb-pieChart-desc-info">
            <span className="info-block2" />
            <FormattedMessage
              id={props.secondParameter}
              defaultMessage={'--'}
            />{' '}
            : {props.data[1].value}{' '}
          </div>
        </div>
      </div>
    </div>
  )
}
