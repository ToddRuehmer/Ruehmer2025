import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

import { Background } from './background';
import { Title } from './title';
import Coords from './coords';
import { updateCameraAspect } from './utility';

class Scene {
  
  Background: Background|null = null;
  Title: Title|null = null;
  Scene: THREE.Scene = new THREE.Scene();
  Renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  Camera: THREE.OrthographicCamera|THREE.PerspectiveCamera;
  Composer: EffectComposer = new EffectComposer(this.Renderer);
  Mouse: Coords;
  Smooth: Coords;
  InitialState: boolean = true;
  InitialCameraPos: Coords;
  LerpFactor: number = 0.01;
  OrbitScale: number = 1;

  $Wrapper: HTMLElement;

  constructor($wrapper:HTMLElement) {
    this.$Wrapper = $wrapper;

    this.Camera = new THREE.PerspectiveCamera(50, this.$Wrapper.offsetWidth/this.$Wrapper.offsetHeight, 0.1, 1000);
    this.Mouse = { X: this.$Wrapper.offsetWidth/2, Y: 0 };
    this.InitialCameraPos = new Coords(this.$Wrapper.offsetWidth/2, -this.$Wrapper.offsetHeight);
    this.Smooth = this.InitialCameraPos;

    this.Renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.Renderer.autoClear = false;

    this.init();
  }

  init():void {
    var self = this;

    self.Resize();
    self.AddMeshes();
    self.AddComposerPasses()
    self.BindEvents();
  }

  BindEvents():void {
    var self = this;

    window.addEventListener('resize', () => { self.Resize() });

    window.addEventListener('mousemove', (e:MouseEvent) => {
      if(self.Scene != null && self.$Wrapper != null) {
        self.Mouse = { X: e.pageX, Y: e.pageY }
      }
    });
  }

  AddMeshes():void {
    var self = this;

    //Background
    const texture = new THREE.TextureLoader().load('images/desert-night.jpg', () => {
      self.Background = new Background(texture);
      self.Scene.add(self.Background.Mesh);
    },
    undefined,
    (error) => {
      console.error('Error loading texture:', error);
    });

    //Button
    //self.Scene.add(self.Button.Mesh);

    //Title
    const titleTexture = new THREE.TextureLoader().load('images/toddruehmer.png', () => {
      self.Title = new Title(titleTexture);
      self.Scene.add(self.Title.Mesh);
    },
    undefined,
    (error) => {
      console.error('Error loading texture:', error);
    });
  }

  AddComposerPasses():void {
    var self = this;

    self.Composer.addPass(new RenderPass(self.Scene, self.Camera));
  }

  Resize():void {
    var self = this;

    self.Renderer.setSize(self.$Wrapper.offsetWidth, self.$Wrapper.offsetHeight);
    var aspect = self.$Wrapper.offsetWidth / self.$Wrapper.offsetHeight;
    
    updateCameraAspect(self.Camera, aspect);

    self.Camera.updateProjectionMatrix();
    self.Composer.setSize(self.$Wrapper.offsetWidth, self.$Wrapper.offsetHeight);
  }
  
  Update(scale:number):void {
    this.Title?.Update(scale);
    this.PositionCamera();
    this.RenderScene();
  }

  PositionCamera():void {
    var self = this;
    
    if(self.InitialState == false) {
      self.Smooth.X += (self.Mouse.X - self.Smooth.X) * self.LerpFactor;
      self.Smooth.Y += (self.Mouse.Y - self.Smooth.Y) * self.LerpFactor;
    } else {
      this.InitialState = false;
      self.Smooth = self.InitialCameraPos;
    }
    self.Camera.position.set( 
      ( self.Smooth.X - self.$Wrapper.offsetWidth/2 ) / self.$Wrapper.offsetWidth * self.OrbitScale,
      ( self.Smooth.Y - self.$Wrapper.offsetHeight/2 ) / self.$Wrapper.offsetHeight * -self.OrbitScale,
      1
    );
    self.Camera.lookAt(0,0,0)
    
    self.Camera.updateProjectionMatrix();
  }

  RenderScene():void {
    var self = this;
  
    self.Renderer.clear();
    
    self.Camera?.layers.set(0);
    self.Composer.render();
    
    self.Renderer.clearDepth();
    self.Camera?.layers.set(1);
    self.Renderer.render(self.Scene, self.Camera);
  }
}

export { Scene };