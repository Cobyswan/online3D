import React, { Component } from 'react'
import axios from 'axios'
import './Contact.css'

export default class Contact extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       firstName: '',
       lastName: '',
       email: '',
       message: '',
       confirmation: ''
    }
  }
  
  handleFirstName = (val) => {
    this.setState({firstName: val})
  }
  handleLastName = (val) => {
    this.setState({lastName: val})
  }
  handleEmail = (val) => {
    this.setState({email: val})
  }
  handleMessage = (val) => {
    this.setState({message: val})
  }

  handleSubmit(e) {
    const {firstName, lastName, email, message} = this.state
    const form = axios.post('/api/form', {
      firstName,
      lastName,
      email,
      message
    }).then(res => {
      console.log(res)
      if(res.status === 200){
        this.setState({confirmation: 'Message was sent succesfully!'})
      }
      else if(res.status === 500) {
        this.setState({confirmation: 'Error sending message'})
      }
    })
  }
  
  render() {
    return (
      <main className='main-contact'>
        <section className='section-contact'>
          <h1>Contact</h1>
          <p>If you find any bugs with the site or just want to say hi, Let me know below and I'll get back to you ASAP.</p>
        </section>
      <div className='ui equal width form'>
        <div className='fields'>
          <div className='field'>
            <input onChange={e => this.handleFirstName(e.target.value)} type='text' placeholder='First Name'/>
          </div>
          <div className='field'>
            <input onChange={e => this.handleLastName(e.target.value)} type='text' placeholder='Last Name'/>
          </div>
          <div className='field'>
            <input onChange={e => this.handleEmail(e.target.value)} type='text' placeholder='Email'/>
          </div>
        </div>
      </div>
        <div className='fields'>
          <div className='field'>
            <textarea onChange={e => this.handleMessage(e.target.value)} type='text' placeholder='Enter Text...'></textarea>
          </div>
      </div>
      <button onClick={e => this.handleSubmit()} class="large ui inverted primary button">Submit</button>
      <p className='confirmation-message'>{this.state.confirmation}</p>
      </main>
    )
  }
}
