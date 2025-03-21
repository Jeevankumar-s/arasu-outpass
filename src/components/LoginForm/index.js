import {Component} from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
    user: null,
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const {history} = this.props

    try {
      const res = await axios.post(
        'https://govt-server-3d3r.onrender.com/api/users/login',
        // 'http://localhost:3000/api/users/login',
        {
          username,
          password,
        },
      )
      console.log(res.data)

      if (res.data.validation) {
        let user = ''
        if (res.data.userType === 'student') {
          user = 'student'
        } else if (res.data.userType === 'staff') {
          user = 'staff'
        } else {
          user = 'hod'
        }

        Cookies.set('jwt_token', res.data.kiruthiToken)
        this.setState({showSubmitError: false, user})

        if (user === 'student') {
          history.replace('/', {username, user})
        } else {
          history.replace('/history', {username, user})
        }
      } else {
        this.setState({showSubmitError: true, errorMsg: res.data.Error})
      }
    } catch (error) {
      console.error('Login error:', error.message)
    }
  }

  renderPasswordField = () => {
    const {password} = this.state
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={this.onChangeUsername}
        />
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state

    return (
      <div className="login-form-container">
        <img
          src="https://res.cloudinary.com/dprxsgnqn/image/upload/v1694320298/vc9ukp7bdnvkhkvzkn3n.jpg"
          className="login-image"
          alt="website login"
        />
        <form className="form-container" onSubmit={this.submitForm}>
          <div className="login-image-container">
            <img
              src="/img/unnamed.jpg"
              className="login-website-logo-desktop-image"
              alt="website logo"
            />
          </div>
          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default withRouter(LoginForm)
