import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import gql from 'graphql-tag'
import FontAwesome from 'react-fontawesome'
import _ from 'lodash'
import './styles.scss'

class UserList extends Component {
  state = {
    filter: 'All',
    searchParam: '',
    index: null
  }
  activate = async (id, activationStatus) => {
    await this.props.ActivateMutation({
      variables: {
        id,
        activationStatus
      }
    })
    this.setState({ index: null })
  }
  handleActivation(item) {
    const id = _.get(item, 'id', null)
    const activationStatus = _.get(item, 'active')
    if (id) {
      this.setState(
        {
          index: id
        },
        () => this.activate(id, !activationStatus)
      )
    }
  }

  handleFilterChange = event => {
    this.setState({ filter: event.target.value })
  }

  //----------------------------------------- event handlers end ---------------------------------------//

  renderFilter() {
    return (
      <div className="dp-filter">
        <select
          type="search"
          data-table="panelTable"
          className="dp-filter-select"
          onChange={this.handleFilterChange}
          value={this.state.value}
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    )
  }

  renderSearch() {
    return (
      <div className="dp-search inner-addon left-addon">
        <i className="glyphicon glyphicon-search search-icon" />
        <input
          className="dp-search-input"
          type="text"
          placeholder="search"
          id="search"
          onKeyUp={e => this.Search(e)}
        />
      </div>
    )
  }

  Search(event) {
    let input = event.target.value
    let searchParam = input.toUpperCase()
    this.setState({ searchParam: searchParam })
  }

  renderTableHeadings() {
    return (
      <tr className="panelTableHead">
        <th className="col-md-2">
          <FormattedMessage id={'name'} defaultMessage={'Name'} />
        </th>
        <th className="col-md-5">
          {' '}
          <FormattedMessage id={'email_id'} defaultMessage={'Email Id'} />
        </th>
        <th className="col-md-1.5">
          {' '}
          <FormattedMessage id={'gender'} defaultMessage={'Gender'} />
        </th>
        <th className="col-md-1.5">
          <FormattedMessage id={'age'} defaultMessage={'Age'} />
        </th>
        <th className="col-md-2">
          <FormattedMessage id={'action'} defaultMessage={'Action'} />
        </th>
      </tr>
    )
  }

  renderTableData() {
    if (this.state.filter === 'All') return this.renderAllUsers()
    else if (this.state.filter === 'Active') return this.renderActiveUsers()
    else if (this.state.filter === 'Inactive') return this.renderInactiveUsers()
  }

  renderAllUsers() {
    let searchParam = this.state.searchParam
    return this.props.User.allUsers
      ? this.props.User.allUsers.map(
          (item, index) =>
            item.name.toUpperCase().indexOf(searchParam) > -1
              ? this.renderUserInfo(index, item)
              : null
        )
      : null
  }

  renderActiveUsers() {
    let searchParam = this.state.searchParam
    return this.props.User.allUsers
      ? this.props.User.allUsers.map(
          (item, index) =>
            item.active === true &&
            item.name.toUpperCase().indexOf(searchParam) > -1
              ? this.renderUserInfo(index, item)
              : null
        )
      : null
  }

  renderInactiveUsers() {
    let searchParam = this.state.searchParam
    return this.props.User.allUsers
      ? this.props.User.allUsers.map(
          (item, index) =>
            item.active === false &&
            item.name.toUpperCase().indexOf(searchParam) > -1
              ? this.renderUserInfo(index, item)
              : null
        )
      : null
  }

  renderSecureEmail(email) {
    var re = new RegExp('.{4}(?=@)')
    var em = email.replace(re, '******')
    return em
  }

  renderUserInfo(index, item) {
    return (
      <tr key={index} id={'userData' + index}>
        <td id={'name' + index}>{item.name}</td>
        <td id={'email' + index}>{this.renderSecureEmail(item.email)}</td>
        <td id={'gender' + index}>{item.gender}</td>
        <td id={'age' + index}>{item.averageAge}</td>
        <td>{this.renderActionButtons(index, item)}</td>
      </tr>
    )
  }

  renderActionButtons(index, item) {
    return (
      <div className="action-button-wrapper">
        <div
          className="action-button-activate"
          onClick={() => this.handleActivation(item)}
        >
          {this.state.index === item.id ? (
            <div className="loader" />
          ) : item.active ? (
            <div className="check-active-cont">
              <FontAwesome
                className="Action-icon"
                name="check"
                style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
              />
            </div>
          ) : (
            <div className="check-inactive-cont">
              <FontAwesome
                className="Action-icon"
                name="check"
                style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="userContainer">
        <h4 className="user-page-head">
          <FormattedMessage id={'Users'} defaultMessage={'Users'} />
        </h4>
        <div className="user-list-container">
          <div className="dp-toolbar">
            {this.renderSearch()}
            {this.renderFilter()}
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="panel panel-primary panel-users">
              <div className="panel-body panelTableBody">
                <table className="col-xs-12 panelTable" id="userList">
                  <thead>{this.renderTableHeadings()}</thead>
                  <tbody className="panelTableTBody">
                    {this.renderTableData()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export const ACTIVATE_MUTATION = gql`
  mutation ActivateMutation($id: ID!, $activationStatus: Boolean!) {
    updateUser(id: $id, active: $activationStatus) {
      active
    }
  }
`
export default compose(
  graphql(ACTIVATE_MUTATION, { name: 'ActivateMutation' })
)(UserList)
