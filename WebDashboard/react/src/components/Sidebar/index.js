// stable
import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import FontAwesome from 'react-fontawesome'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'
import './styles.scss'
import PropTypes from 'prop-types'

const Sidebar = ({ sidelarge }) => (
  <aside className={classNames('sidebar', sidelarge ? 'sidebar-large' : null)}>
    <div className="sidenav-outer sidenavOuter">
      <ul style={{ listStyleType: 'none' }}>
        <li className="sidemenuListTab">
          <Link to="/" onClick={() => {}}>
            <div className="icon-div">
              <FontAwesome
                className="sidebar-icon"
                name="tachometer"
                size="2x"
                style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
              />
              <span
                className={classNames(
                  'sidebar-ex',
                  !sidelarge ? 'sidebar-ex-view' : null,
                  sidelarge ? 'sidebar-ex-visible' : null
                )}
              >
                <FormattedMessage
                  id={'dashboard'}
                  defaultMessage={'Dashboard'}
                />
              </span>
            </div>
          </Link>
        </li>
        <li className="sidemenuListTab">
          <Link to="/users" onClick={() => {}}>
            <div className="icon-div">
              <FontAwesome
                className="sidebar-icon"
                name="user"
                size="2x"
                style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
              />
              <span
                className={classNames(
                  'sidebar-ex',
                  !sidelarge ? 'sidebar-ex-view' : null,
                  sidelarge ? 'sidebar-ex-visible' : null
                )}
              >
                <FormattedMessage id={'users'} defaultMessage={'Users'} />
              </span>
            </div>
          </Link>
        </li>
        <li className="sidemenuListTab">
          <Link to="/settings" onClick={() => {}}>
            <div className="icon-div">
              <FontAwesome
                className="sidebar-icon"
                name="cog"
                size="2x"
                style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
              />
              <span
                className={classNames(
                  'sidebar-ex',
                  !sidelarge ? 'sidebar-ex-view' : null,
                  sidelarge ? 'sidebar-ex-visible' : null
                )}
              >
                <FormattedMessage id={'settings'} defaultMessage={'Settings'} />
              </span>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  </aside>
)

Sidebar.propTypes = {
  sidelarge: PropTypes.bool
}
export default withRouter(Sidebar)
