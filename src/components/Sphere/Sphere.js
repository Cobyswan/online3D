import React, { Component } from 'react'
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import * as dat from 'dat.gui'
import './Sphere.css'
import axios from 'axios'
import {connect} from 'react-redux'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

class Sphere extends Component {

  componentDidMount(){
    let url = `/api/sphere_presets/0`
    if(this.props.user){
      url = `/api/sphere_presets/${this.props.user.user_id}`
    }
    axios.get(url).then(res => {
      let spherePreset = res.data.filter(preset => {
        return preset.preset_id == this.props.match.params.preset_id
    })
      if(spherePreset.length){
      this.props.getPreset(spherePreset[0].preset_json)
      this.props.getPresetId(spherePreset[0].preset_id)
      this.props.getIsPreset(true)
    }      

        const width = this.mount.clientWidth
        const height = this.mount.clientHeight
        
        //ADD SCENE
        this.scene = new THREE.Scene()
        
        //ADD RENDERER
        this.renderer = new THREE.WebGLRenderer({ antialias: false })
        this.renderer.setClearColor('#000000')
        this.renderer.setSize(width, height)
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFShadowMap
        this.mount.appendChild(this.renderer.domElement)
        
        //ADD CAMERA
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.camera.position.z = 20  
        
        //ADD LIGHTS
        this.spotLight = new THREE.SpotLight(0xffffff, 0.1, 50, 0.5, 0.5);
        this.spotLight.position.set(0,9,0)
        this.spotLight.castShadow = true
        this.spotLight.shadow.mapSize.width = 2000;
        this.spotLight.shadow.mapSize.height = 2000;
        this.spotLight.shadow.camera.near = 0.5;
        this.spotLight.shadow.camera.far = 21000;
        this.scene.add(this.spotLight)

        //ADD PLANE/FLOOR
        const floorGeometry = new THREE.BoxGeometry(2000,1, 2000)
        const floorMaterial = new THREE.MeshStandardMaterial({color: 0x808080, emissive: 0x808080 })
        this.floor = new THREE.Mesh(floorGeometry, floorMaterial)
        this.floor.position.set(0, - 20, 0)
        this.floor.receiveShadow = true
        this.scene.add(this.floor);

        
        //ADD sphere
        const geometry = new THREE.SphereGeometry(3, 36, 36)
        const material = new THREE.MeshStandardMaterial({ 
          color: 0xffffff,
            roughness: 0.5,
            metalness: 0.5,
            emissive: 0x000000,
            emissiveIntensity: .5,
            metalness: 0,
        })
        this.sphere = new THREE.Mesh(geometry, material)
        this.sphere.geometry.computeVertexNormals()
        this.sphere.geometry.mergeVertices()
        this.sphere.castShadow = true
        material.wireframe = false;
        this.scene.add(this.sphere)
        console.log(this.sphere)

        //ADD GUI
        this.controller = {
          preset: '',
          scaleX: 1,
          scaleY: 1,
          scaleZ: 1,
          wireframe: false,
          emissiveColor: 0x000000,
          spotLightIntensity: 0.1,
          lightPositionX: 0,
          lightPositionY: 9,
          lightPositionZ: 0,
          xRotation: 0,
          yRotation: 0,
          zRotation: 0,
          animate: false,
          save: () => {
            if(this.props.user){
            axios.post(`/api/preset`, {
              preset_json: JSON.stringify({
                preset: this.controller.preset,
                closed: false,
                remembered: {
                  Default: {
                    0: {
                      scaleX: this.controller.scaleX,
                      scaleY: this.controller.scaleY,
                      scaleZ: this.controller.scaleZ,
                      wireframe: this.controller.wireframe,
                      emissiveColor: this.controller.emissiveColor,
                      spotLightIntensity: this.controller.spotLightIntensity,
                      lightPositionX: this.controller.lightPositionX,
                      lightPositionY: this.controller.lightPositionY,
                      lightPositionZ: this.controller.lightPositionZ,
                      xRotation: this.controller.xRotation,
                      yRotation: this.controller.yRotation,
                      zRotation: this.controller.yRotation,
                      animate: this.controller.animate
                    }
                  }
                },
                folders: {}
            }), 
              preset_shape: 'sphere',
              preset_name: this.controller.preset,
            }).then(res => {
              console.log(res.data)
            })
            if(this.controller.preset !== '')
            toast.success('Preset saved successfuly!', {
              position: toast.POSITION.BOTTOM_RIGHT
            })
            else{
              toast.warning('Saved without name! default name will be used.', {
                position: toast.POSITION.BOTTOM_RIGHT
              })
          }
          }
          else {
            toast.error('Must be logged in to save!', {
              position: toast.POSITION.BOTTOM_RIGHT
            });
          }
          },
          overwrite: () => {
            axios.put(`/api/preset/${this.props.presetId}`, {
              preset: this.controller.preset,
              preset_json: JSON.stringify({
                preset: this.controller.preset,
                closed: false,
                remembered: {
                  Default: {
                    0: {
                      scaleX: this.controller.scaleX,
                      scaleY: this.controller.scaleY,
                      scaleZ: this.controller.scaleZ,
                      wireframe: this.controller.wireframe,
                      emissiveColor: this.controller.emissiveColor,
                      spotLightIntensity: this.controller.spotLightIntensity,
                      lightPositionX: this.controller.lightPositionX,
                      lightPositionY: this.controller.lightPositionY,
                      lightPositionZ: this.controller.lightPositionZ,
                      xRotation: this.controller.xRotation,
                      yRotation: this.controller.yRotation,
                      zRotation: this.controller.yRotation,
                      animate: this.controller.animate
                    }
                  }
                },
                folders: {}
            })
            })
            if(this.controller.preset !== '')
            toast.success('Overwrite successful!', {
              position: toast.POSITION.BOTTOM_RIGHT
            })
            else{
              toast.warning('Saved without name! default name will be used.', {
                position: toast.POSITION.BOTTOM_RIGHT
              })
            }
          }
        }


        this.gui = new dat.GUI({width: 287, load: JSON.parse(this.props.preset)})
        this.gui.domElement.id = 'gui'
        this.gui.remember(this.controller)
        this.gui.add(this.controller, 'preset').name('Preset Name')
        let folder1 = this.gui.addFolder('Sphere')
        folder1.add(this.controller, 'scaleX', 1, 5, .5).onChange(() => {this.sphere.scale.x = this.controller.scaleX}).name('Sphere Scale X').listen()
        folder1.add(this.controller, 'scaleY', 1, 5, .5).onChange(() => {this.sphere.scale.y = this.controller.scaleY}).name('Sphere Scale Y').listen()
        folder1.add(this.controller, 'scaleZ', 1, 5, .5).onChange(() => {this.sphere.scale.z = this.controller.scaleZ}).name('Sphere Scale Z').listen()
        folder1.addColor(this.controller, 'emissiveColor').onChange(() => {this.sphere.material.emissive.set(this.controller.emissiveColor)}).name('Color')
        folder1.add(this.controller, 'wireframe').onChange(() => {material.wireframe = this.controller.wireframe}).name('Wireframe').listen();
        let folder2 = this.gui.addFolder('Lighting')
        folder2.add(this.controller, 'spotLightIntensity', 0, 1, 0.1).onChange(() => {this.spotLight.intensity = this.controller.spotLightIntensity}).name('Light Intensity')
        folder2.add(this.controller, 'lightPositionX', -25, 25, 1).onChange(() => {this.spotLight.position.x = this.controller.lightPositionX}).name('X Position')
        folder2.add(this.controller, 'lightPositionY', 9, 50, 1).onChange(() => {this.spotLight.position.y = this.controller.lightPositionY}).name('Y Position')
        folder2.add(this.controller, 'lightPositionZ', -25, 25, 1).onChange(() => {this.spotLight.position.z = this.controller.lightPositionZ}).name('Z Position')
        let folder3 = this.gui.addFolder('Animation')
        folder3.add(this.controller, 'xRotation', 0, 0.1, 0.01).onChange(() => {this.sphere.rotation.x = this.controller.xRotation}).name('X Rotation')
        folder3.add(this.controller, 'yRotation', 0, 0.1, 0.01).onChange(() => {this.sphere.rotation.y = this.controller.yRotation}).name('Y Rotation')
        folder3.add(this.controller, 'zRotation', 0, 0.1, 0.01).onChange(() => {this.sphere.rotation.z = this.controller.zRotation}).name('Z Rotation')
        folder3.add(this.controller, 'animate').onChange(this.controller.animate != this.controller.animate).name('Animate Light')
        if(this.props.isPreset === false)
        {
          this.gui.add(this.controller, 'save').name('Save Preset')
        }
        else {
          this.gui.add(this.controller, 'overwrite').name('Overwrite Preset')
        }
        this.gui.revert()
        this.start()
      })
      }

    componentWillUnmount(){
        this.stop()
        this.gui.destroy()
        this.mount.removeChild(this.renderer.domElement)
      }
    start = () => {
        if (!this.frameId) {
          this.frameId = requestAnimationFrame(this.animate)
        }
      }
    stop = () => {
        cancelAnimationFrame(this.frameId)
      }
    animate = () => {
      let time = Date.now() * 0.00025;
      if(this.controller.animate === true){
        this.spotLight.position.x = Math.sin( time * 0.9 ) * 10;
      }
      this.sphere.rotation.x += this.controller.xRotation
      this.sphere.rotation.y += this.controller.yRotation 
      this.sphere.rotation.z += this.controller.zRotation
      this.renderScene()
      this.frameId = window.requestAnimationFrame(this.animate)
     }
    renderScene = () => {
      this.renderer.render(this.scene, this.camera)
      this.controls.update()
    }

    

    render(){
      console.log(this.sphere)
        return(
          <div
            style={{ width: '100vw', height: '100vh' }}
            ref={(mount) => { this.mount = mount }}
          ><ToastContainer/></div>
        )
      }
    }

    const mapStateToProps = (state) => {
      return {
        user: state.user,
        preset: state.preset,
        isPreset: state.isPreset,
        presetId: state.presetId
      }
    }
    export default connect(mapStateToProps, null)(Sphere)
