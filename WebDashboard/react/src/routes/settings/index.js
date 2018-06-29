// stable
import React, { Component } from 'react'
import TimezonePicker from 'react-timezone'
import { withRouter } from 'react-router-dom'
import {
  FormBuilder,
  FieldGroup,
  FieldControl,
  Validators
} from 'react-reactive-form'
import { graphql, compose } from 'react-apollo'
import { toast } from 'react-toastify'
import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import { SETTINGS_QUERY, UPDATE_SETTING, CREATE_SETTING } from './graphql'
import ErrorHandler from '../../components/errorHandler'
import './styles.css'

class Settings extends Component {
  settingsForm = FormBuilder.group({
    googleLink: ['', Validators.required],
    appleLink: ['', Validators.required],
    timezone: ['', Validators.required]
  })

  componentWillReceiveProps(nextProps) {
    const settings = _.get(nextProps, 'data.allSettings[0]')
    if (settings) {
      this.settingsForm.patchValue({
        googleLink: settings.googlePlayStoreLink,
        appleLink: settings.iosAppStoreLink,
        timezone: settings.timezone
      })
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    this.handleSave()
  }
  handleSave = () => {
    if (this.props.data.allSettings[0]) {
      const id = this.props.data.allSettings[0].id
      this.update(id)
    } else {
      this.create()
    }
  }
  create = async () => {
    try {
      await this.props.CreateSetting({
        variables: this.settingsForm.value
      })
      this.props.history.push('/')
    } catch (e) {
      //
      toast.error('Error in saving settings.')
    }
  }

  update = async id => {
    try {
      const result = await this.props.UpdateSetting({
        variables: {
          id,
          ...this.settingsForm.value
        }
      })
      let data = result.data.updateSetting
      this.settingsForm.patchValue({
        googleLink: data.googlePlayStoreLink,
        appleLink: data.iosAppStoreLink,
        timezone: data.timezone
      })
      this.settingsForm.reset()
      this.props.history.push('/')
    } catch (e) {
      //
      toast.error('Error in saving settings.')
    }
  }

  render() {
    const { data: { loading, error } } = this.props
    if (loading) {
      return null
    }
    if (error) {
      return <ErrorHandler />
    }
    return (
      <div className="dp-settings-container">
        <h4 className="Settings-page-head">
          <FormattedMessage id={'settings'} defaultMessage={'Settings'} />
        </h4>
        <div className="settings-info-cont">
          <div className="settinfs-form-div">
            <FieldGroup
              className="form-settings"
              control={this.settingsForm}
              render={({ get, invalid, pristine }) => (
                <form onSubmit={this.handleSubmit}>
                  <FieldControl
                    name="googleLink"
                    render={({ handler, touched, hasError }) => (
                      <div>
                        <div className="dp-title">
                          <FormattedMessage
                            id={'google_play_store_link'}
                            defaultMessage={'Google Play Store link'}
                          />
                        </div>
                        <input className="dp-input" {...handler()} />
                        <span className="field-error">
                          {touched &&
                            hasError('required') &&
                            'GoogleLink is required'}
                        </span>
                      </div>
                    )}
                  />
                  <FieldControl
                    name="appleLink"
                    render={({ handler, touched, hasError }) => (
                      <div>
                        <div className="dp-title">
                          <FormattedMessage
                            id={'iOS_apple_store_link'}
                            defaultMessage={'iOS Apple Store link'}
                          />
                        </div>
                        <input className="dp-input" {...handler()} />
                        <span className="field-error">
                          {touched &&
                            hasError('required') &&
                            'AppleLink is required'}
                        </span>
                      </div>
                    )}
                  />
                  <FieldControl
                    name="timezone"
                    render={({ handler, touched, hasError }) => (
                      <div>
                        <div className="dp-title">
                          <FormattedMessage
                            id={'timezone'}
                            defaultMessage={'Timezone'}
                          />
                        </div>
                        <TimezonePicker
                          {...handler()}
                          className="dp-input dp-left"
                        />
                      </div>
                    )}
                  />
                  <button
                    type="submit"
                    disabled={invalid || pristine}
                    className="dp-save-button"
                  >
                    <FormattedMessage id={'save'} defaultMessage={'Save'} />
                  </button>
                </form>
              )}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default compose(
  graphql(SETTINGS_QUERY),
  graphql(UPDATE_SETTING, { name: 'UpdateSetting' }),
  graphql(CREATE_SETTING, { name: 'CreateSetting' })
)(withRouter(Settings))
