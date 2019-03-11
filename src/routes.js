import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Cube from './components/Cube/Cube';
import Sphere from './components/Sphere/Sphere';
import Home from './components/Home/Home';
import Cone from './components/Cone/Cone';
import Contact from './components/Contact/Contact';

export default function routes() {
  return (
    <div>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route exact path='/cube/:preset_id' component={Cube}/>
        <Route exact path='/cube/' component={Cube}/>
        <Route exact path='/sphere/:preset_id' component={Sphere}/>
        <Route exact path='/sphere/' component={Sphere}/>
        <Route exact path='/cone/:preset_id' component={Cone}/>
        <Route exact path='/cone/' component={Cone}/>
        <Route exact path='/contact' component={Contact}/>
      </Switch>
    </div>
  )
}
