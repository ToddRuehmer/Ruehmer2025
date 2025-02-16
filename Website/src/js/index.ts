import "../scss/styles.scss"

import * as THREE from 'three';

import { Scene } from './scene';
import { getScreenPosition } from './utility';
import Coords from "./coords";

new class App {
  $Wrapper  : HTMLElement|null;
  $Button   : HTMLElement|null;
  $Subtitle : HTMLElement|null;

  Scene     : Scene|null = null;
  Mouse     : Coords;

  constructor() {
    var self = this;

    this.$Wrapper = document.querySelector('[data-canvas-area]');
    this.$Subtitle = document.querySelector('[data-subtitle]');
    this.$Button = document.querySelector('[data-button]');

    if(self.$Wrapper != null) {
      this.Scene = new Scene(self.$Wrapper);
    }
    this.Mouse = new Coords(-window.innerWidth,-window.innerHeight);

    self.Init();
    self.Animate();
  }

  Init():void {
    var self = this;

    this.BindEvents();
    this.AddToContainer();
    this.PositionButton();
    this.PositionSubtitle();
    this.Animate();
  }

  BindEvents():void {
    var self = this;

    window.addEventListener('mousemove', (e:MouseEvent) => {
      this.Mouse = new Coords(e.pageX,e.pageY);
    });
  }

  AddToContainer():void {
    var self = this;

    if(self.Scene != null) {
      self.$Wrapper?.appendChild(self.Scene.Renderer.domElement);
    }
  }

  PositionButton():void {
    var self =this;

    if(self.$Button != null && self.Scene != null) {
      var position = getScreenPosition(new THREE.Vector3(0,-.35,0), self.Scene.Camera, self.Scene.Renderer);
      self.$Button.style.left = position.x + "px";
      self.$Button.style.top = position.y + "px";
    }
  }

  PositionSubtitle():void {
    var self =this;

    if(self.$Subtitle != null && self.Scene != null) {
      var position = getScreenPosition(new THREE.Vector3(0,.35,0), self.Scene.Camera, self.Scene.Renderer);
      self.$Subtitle.style.left = position.x + "px";
      self.$Subtitle.style.top = position.y + "px";
    }
  }

  GetDistanceToButton():number {
    var self = this;
    if(self.Scene != null && self.$Wrapper != null && self.$Button != null) {
      const distance = Math.sqrt(
        Math.pow(self.Mouse.X - parseInt(self.$Button.style.left), 2) + Math.pow(self.Mouse.Y - parseInt(self.$Button.style.top), 2)
      );
      return distance;
    } else {
      return window.innerWidth;
    }
  }

  GetAnimationScale():number {
    const threshold = 0.1 * window.innerWidth;
    const distance = this.GetDistanceToButton();
    const normalized = Math.min(1, Math.max(.1, (threshold - distance) / threshold));
    return normalized;
  }

  Animate() {
    var self = this;
    window.requestAnimationFrame(self.Animate.bind(self));

    self.PositionButton();
    self.PositionSubtitle();

    self.Scene?.Update(this.GetAnimationScale());
  }
}