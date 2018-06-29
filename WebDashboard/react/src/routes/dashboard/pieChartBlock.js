import React from 'react'
import { Chart } from './pieChart'

export const PieChartFun = props => {
  return (
    <div className="acb-pieChart-wrapper">
      {props.countData.MaleCount._allUsersMeta &&
      props.countData.FemaleCount._allUsersMeta ? (
        <Chart
          size={200}
          innerHoleSize={100}
          data={[
            {
              key: 'Male',
              value: props.countData.MaleCount._allUsersMeta.count
            },
            {
              key: 'Female',
              value: props.countData.FemaleCount._allUsersMeta.count
            }
          ]}
          title="people_count"
          firstParameter="no_of_males"
          secondParameter="no_of_females"
        />
      ) : null}
      {props.countData.IosCount._allUsersMeta &&
      props.countData.AndroidCount._allUsersMeta ? (
        <Chart
          size={200}
          innerHoleSize={100}
          data={[
            { key: 'IOS', value: props.countData.IosCount._allUsersMeta.count },
            {
              key: 'Android',
              value: props.countData.AndroidCount._allUsersMeta.count
            }
          ]}
          title="devices_installed"
          firstParameter="no_of_ios"
          secondParameter="no_of_android"
        />
      ) : null}
    </div>
  )
}
