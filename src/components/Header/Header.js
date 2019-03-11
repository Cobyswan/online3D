import React, { Component } from 'react'
import './Header.css'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios';
import { connect } from 'react-redux'
import { getUser, getPreset } from '../../ducks/reducer'
import StripeCheckout from 'react-stripe-checkout'

class Header extends Component{  
  
  componentDidMount = () => {
    axios.get(`/api/user_data`).then(res => {
      this.props.getUser(res.data)
    })
  }
  
  onToken = token => { 
    axios.post('/api/payment', {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: token.id
    })
  };

  
  

  login = () => {
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth`)
    window.location = `https://${process.env.REACT_APP_AUTH_DOMAIN}/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&scope=openid%20email%20profile&redirect_uri=${redirectUri}&response_type=code`
  }

  logout = () => {
    axios.get('/api/logout').then(res => {
      this.props.getUser(res.data)
      this.props.getPreset(JSON.stringify("default"))
    })
  }

  render(){
    return (
      <div>
        <div className='ui inverted menu'>
            <Link className='link item' to='/'>Home</Link>
            <Link className='link item' to='/contact'>Contact</Link>
            <StripeCheckout label='Donate' amount={100} token={this.onToken} stripeKey="pk_test_wvkmftuGg05ET736pnOCflQs"><Link to='#' className='link item' >Donate</Link></StripeCheckout>
              {
                !this.props.user
                ?
              <button id='login-button' className='link item' onClick={() => this.login()}>Login</button>
                :
              <Link to='/'><button id='login-button' className='link item' onClick={() => this.logout()}>Logout</button></Link>
              }
        </div>
      </div>
    )
  }
}

let mapStateToProps = (state) => {
  return {
      user: state.user,
      preset: state.preset
  }
}

export default connect(mapStateToProps, {getUser, getPreset})(Header)
