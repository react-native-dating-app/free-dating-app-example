import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import {
  FieldGroup,
  FieldControl,
  FormBuilder,
  Validators
} from 'react-reactive-form'
import { graphql, compose } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import { toast } from 'react-toastify'
import FontAwesome from 'react-fontawesome'
import cover from '../../assets/images/image.png'
import logo from '../../assets/images/Logo.png'
import { AUTH_TOKEN } from '../../constants'
import { LOGIN_MUTATION } from './graphql'
import './style.scss'

class Login extends Component {
  loginForm = FormBuilder.group({
    email: ['admin@datingapp.com', [Validators.required, Validators.email]],
    password: ['Password', Validators.required]
  })

  confirm = async () => {
    if (this.loginForm.valid) {
      try {
        const result = await this.props.LoginMutation({
          variables: this.loginForm.value
        })
        const token = result.data.authenticateUser.token
        this.saveUserData(token)
        this.props.history.push(`/`)
      } catch (e) {
        // Failed to login
        toast.error('Login failed')
      }
    }
  }

  saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token)
  }

  render() {
    return (
      <div className="dp-login-wrapper">
        <div className="dp-content-wrapper">
          <div className="dp-login-img-cover">
            <img
              src={cover}
              height="100%"
              width="100%"
              className="img-cover-opac"
              alt="cover_pic"
            />
            <img
              src={logo}
              height="23%"
              width="23%"
              className="img-cover-icon"
              alt="cover_icon"
            />
          </div>

          <div className="dp-login-form">
            <div className="dp-login-form-wrapper">
              <div className="dp-form">
                <p className="dp-login-title">
                  <FormattedMessage
                    id={'enter_email_passsword'}
                    defaultMessage={
                      'Please enter your username and password to Login'
                    }
                  />
                </p>
                <FieldGroup control={this.loginForm}>
                  {() => (
                    <div className="dp-login-conatiner">
                      <FieldControl name="email">
                        {({ handler, touched, hasError }) => (
                          <div>
                            <input
                              className="dp-login-email"
                              type="text"
                              placeholder="Username"
                              {...handler()}
                            />
                            <div className="error-div">
                              {touched &&
                                hasError('required') && (
                                  <span className="error-span">
                                    Email is required
                                  </span>
                                )}
                              {touched &&
                                hasError('email') && (
                                  <span className="error-span">
                                    Invalid Email
                                  </span>
                                )}
                            </div>
                          </div>
                        )}
                      </FieldControl>
                      <FieldControl name="password">
                        {({ handler, hasError, touched }) => (
                          <div>
                            <input
                              className="dp-login-password"
                              {...handler()}
                              type="password"
                              placeholder="Password"
                            />
                            <div className="error-div">
                              {touched &&
                                hasError('required') && (
                                  <span className="error-span">
                                    Password is required
                                  </span>
                                )}
                            </div>
                          </div>
                        )}
                      </FieldControl>
                    </div>
                  )}
                </FieldGroup>
              </div>
              <button
                className="dp-login-button"
                onClick={() => this.confirm()}
              >
                <FormattedMessage id={'login'} defaultMessage={'Login'} />
                <FontAwesome
                  name="arrow-right"
                  style={{
                    textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)',
                    color: '#fff',
                    marginLeft: 15,
                    fontWeight: 400
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(
  compose(graphql(LOGIN_MUTATION, { name: 'LoginMutation' }))(Login)
)
