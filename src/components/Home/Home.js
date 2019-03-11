import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'
import axios from 'axios';
import { connect } from 'react-redux'
import { getUser, getPreset, getIsPreset, getPresetId } from '../../ducks/reducer'

class Home extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       cubePresets: [],
       spherePresets: [],
       conePresets: [],
       loggedIn: false
    }
  }
   
  componentDidMount = () => {
    // this.getCubePresets();
    // this.getSpherePresets();
    // this.getConePresets();
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(prevProps.user !== this.props.user){
      this.getCubePresets();
      this.getSpherePresets();
      this.getConePresets();
      this.setState({loggedIn: false})
    }
  }
 
  // FUNCTIONS TO GET PRESET DATA FROM DB
  getCubePresets = () => {
    if(this.props.user){
    axios.get(`/api/cube_presets/${this.props.user.user_id}`).then(res => {
      this.setState({cubePresets: res.data})
    })
  }
  }
  getSpherePresets = () => {
    if(this.props.user){
    axios.get(`/api/sphere_presets/${this.props.user.user_id}`).then(res => {
      this.setState({spherePresets: res.data})
    })
  }
  }
  getConePresets = () => {
    if(this.props.user){
    axios.get(`/api/cone_presets/${this.props.user.user_id}`).then(res => {
      this.setState({conePresets: res.data})
    })
  }
  }


  render() {
    let {user} = this.props
    let mappedCubePresets = this.state.cubePresets.map((preset, index) => {
      return (
       <div key={preset.preset_id} className='inverted item'>
        <div className='content'>
          <Link onClick={ () => {
            this.props.getPreset(preset.preset_json); this.props.getIsPreset(true); this.props.getPresetId(preset.preset_id);}}
            className='header' to={`/cube/${preset.preset_id}`}>{`${preset.preset_name}` || `Cube ${index}` }</Link>
          <button className='ui inverted red button' onClick={() => {
            axios.delete(`/api/cube_preset/${preset.preset_id}`).then(res => {
              this.setState({cubePresets: res.data})
            })
          }}>X</button>
        </div>
        </div>
      )
    })
    let mappedSpherePresets = this.state.spherePresets.map((preset, index) => {
      return (
       <div key={preset.preset_id} className='inverted item'>
        <div className='content'>
          <Link onClick={ () => {
            this.props.getPreset(preset.preset_json); this.props.getIsPreset(true); this.props.getPresetId(preset.preset_id);}}
          className='header' to='/sphere'>{`${preset.preset_name}` || `Sphere ${index}` }</Link>
          <button className='ui inverted red button' onClick={() => {
            axios.delete(`/api/sphere_preset/${preset.preset_id}`).then(res => {
              this.setState({spherePresets: res.data})
            })
          }}>X</button>
        </div>
        </div>
      )
    })
    let mappedConePresets = this.state.conePresets.map((preset, index) => {
      return (
       <div key={preset.preset_id} className='inverted item'>
        <div className='content'>
          <Link onClick={ () => {
            this.props.getPreset(preset.preset_json); this.props.getIsPreset(true); this.props.getPresetId(preset.preset_id);}}
          className='header' to='/cone'>{`${preset.preset_name}` || `Cone ${index}` }</Link>
          <button className='ui inverted red button' onClick={() => {
            axios.delete(`/api/cone_preset/${preset.preset_id}`).then(res => {
              this.setState({conePresets: res.data})
            })
          }}>X</button>
        </div>
        </div>
      )
    })
    return (
      
      <main>
      {
          user

          ?
        
        <div>
        <section className='new-project-section'>
          <h1>Choose a shape to start</h1>
          <div className='ui inverted secondary menu'>
            <div>
              <Link onClick={e => {this.props.getPreset(JSON.stringify('default')); this.props.getIsPreset(false)}} className='item' to='/cube'>Cube</Link>
            </div>
            <div>
            < Link onClick={e => {this.props.getPreset(JSON.stringify('default')); this.props.getIsPreset(false)}} className='item' to='/sphere'>Sphere</Link>
            </div>
            <div>
            < Link onClick={e => {this.props.getPreset(JSON.stringify('default')); this.props.getIsPreset(false)}} className='item' to='/cone'>Cone</Link>
            </div>
          </div>
        </section>
        <section className='preset-section'>
          <div>
            <h3>
              Cube Presets
            </h3>
            <div className='ui inverted relaxed divided selection list'>
              {mappedCubePresets}
            </div>
          </div>
          <div>
          <h3>
              Sphere Presets
            </h3>
            <div className='ui inverted relaxed divided selection list'>
              {mappedSpherePresets}
            </div>
          </div>
          <div>
          <h3>
              Cone Presets
            </h3>
            <div className='ui inverted relaxed divided selection list'>
              {mappedConePresets}
            </div>
          </div>
        </section>
        </div>

        :

        <div>
        <section className='new-project-section'>
          <h1>Choose a shape to start</h1>
          <div className='ui inverted secondary menu'>
            <div>
              <Link className='item' to='/cube'>Cube</Link>
            </div>
            <div>
            < Link className='item' to='/sphere'>Sphere</Link>
            </div>
            <div>
            < Link className='item' to='/cone'>Cone</Link>
            </div>
          </div>
        </section>
        <h1 className='login-message'>
          Login to save presets.
        </h1>
        </div>

      }
      </main>
    )
  }
}


let mapStateToProps = (state) => {
  return {
    user: state.user,
    preset: state.preset,
    isPreset: state.isPreset,
    presetId: state.presetId
  }
}

export default connect(mapStateToProps, {getUser, getPreset, getIsPreset, getPresetId})(Home)