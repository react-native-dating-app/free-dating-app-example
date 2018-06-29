import React, { Component } from 'react'
import { DataBlock } from './dataBlock'
import { PieChartFun } from './pieChartBlock'
import { graphql, compose } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import {
  MALE_COUNT_QUERY,
  FEMALE_COUNT_QUERY,
  IOS_COUNT_QUERY,
  ANDROID_COUNT_QUERY,
  USERS_COUNT_QUERY,
  SWIPES_COUNT_QUERY,
  MATCHES_COUNT_QUERY,
  FEED_USERS,
  getBoundry
} from './graphql'
import './style.css'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = { cityList: [] }
  }

  getlocation = async object => {
    try {
      const res = await getBoundry([object.latitude, object.longitude])
      return res
    } catch (err) {
      console.error(err)
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (this.props.User.allUsers !== nextProps.User.allUsers) {
      if (nextProps.User.allUsers) {
        for (
          var object = 0;
          object < nextProps.User.allUsers.length;
          object++
        ) {
          try {
            const res = await this.getlocation(nextProps.User.allUsers[object])
            let cityList = this.state.cityList
            if (res) {
              cityList.push(res)
            }
            this.setState({ cityList: cityList })
            localStorage.setItem(
              'city_count',
              new Set(this.state.cityList).size
            )
          } catch (err) {
            console.error(err)
          }
        }
      }
    }
  }

  render() {
    return (
      <div className="dp-dashboard-container">
        <h4 className="dashboard-head">
          <FormattedMessage id={'dashboard'} defaultMessage={'Dashboard'} />
        </h4>
        <DataBlock
          countData={this.props}
          cityCount={localStorage.getItem('city_count')}
        />
        <PieChartFun countData={this.props} />
      </div>
    )
  }
}

export default compose(
  graphql(MALE_COUNT_QUERY, { name: 'MaleCount' }),
  graphql(FEMALE_COUNT_QUERY, { name: 'FemaleCount' }),
  graphql(IOS_COUNT_QUERY, { name: 'IosCount' }),
  graphql(ANDROID_COUNT_QUERY, { name: 'AndroidCount' }),
  graphql(USERS_COUNT_QUERY, { name: 'UsersCount' }),
  graphql(SWIPES_COUNT_QUERY, { name: 'SwipesCount' }),
  graphql(MATCHES_COUNT_QUERY, { name: 'MatchesCount' }),
  graphql(FEED_USERS, { name: 'User' })
)(Dashboard)
