import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as Loaders from "../libs/CS559-Framework/loaders.js";
import { GrCube } from "../libs/CS559-Framework/SimpleObjects.js";
import { GrBulldozer, GrSnowman } from "../src/objects.js"


/**
 * This is a really simple track - just a circle
 * But in addition to having geometry, objects on the track can ask for their
 * position (given their U value).
 * They can also ask for the direction vector.
 */
let crcounter = 1;
export class CircularTrack extends GrObject {
  constructor(params = {}) {
    let radius = params.radius || 6;
    let width = params.width || 1;
    let ring = new T.RingGeometry(radius - width, radius + width, 20, 3);
    let material = new T.MeshStandardMaterial({
      side: T.DoubleSide,
      color: "#909090",
      roughness: 1.0,
    });
    let mesh = new T.Mesh(ring, material);
    mesh.rotateX(Math.PI / 2);
    let group = new T.Group();
    group.add(mesh);
    group.translateX(params.x || 0);
    group.translateY(params.bias || 0.3); // raise track above ground to avoid z-fight
    group.translateZ(params.z || 0);
    super("CircularTrack-" + crcounter++, group);

    this.x = params.x || 0;
    this.z = params.z || 0;
    this.y = params.bias || 0.1;
    this.r = radius;
  }
  eval(u) {
    let p = u * 2 * Math.PI;
    return [
      this.x + this.r * Math.cos(p),
      this.y,
      this.z + this.r * Math.sin(p),
    ];
  }
  tangent(u) {
    let p = u * 2 * Math.PI;
    // unit tangent vector - not the real derivative
    return [Math.sin(p), 0, -Math.cos(p)];
  }
}

/**
 * Simple linear track for an object to move back and forth.
 */
let linearctr = 1;
export class LinearTrack extends GrObject {
    constructor(params = {}) {
        let length = params.length || 20; 
        let width = params.width || 4; 

        // How much the bulldozer rotate when it is halfway through.
        let rotation = params.rotation || 0
        let geometry = new T.BoxGeometry(length, 0.1, width);
        let material = new T.MeshStandardMaterial({
            color: "#606060",
            roughness: 1.0,
        });
        let mesh = new T.Mesh(geometry, material);
        let group = new T.Group();
        group.add(mesh);

        // Set the position and rotation based on the parameters.
        group.translateX(params.x || 0); 
        group.translateY(params.bias || 0.5);
        group.translateZ(params.z || 0); 
        group.rotateY(rotation * Math.PI / 180); 
        
        super("LinearTrack-" + linearctr++, group);
        this.group = group;
        this.length = length;
        this.x = params.x || 0;
        this.z = params.z || 0;
        this.y = params.bias || 0.1;
        this.rotation = rotation;
    }
    eval(u) {
        // u is expected to be between 0 and 1, where 0 is one end of the track and 1 is the other end
        // calculate position taking rotation into account
        let angle = this.rotation * Math.PI / 180;
        let x = this.length * (u - 0.5);
        let z = 0;
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        return [
            this.group.position.x + cos * x - sin * z,
            this.group.position.y,
            this.group.position.z + sin * x + cos * z
        ];
    }
    tangent(u) {
        // Return the tangent vector taking rotation into account
        let angle = this.rotation * Math.PI / 180;
        return [Math.cos(angle), 0, Math.sin(angle)]
    }
}

/**
 * A figure 8 track for bouncing snowmen.
 */
let f8ctr = 1;
export class FigureEightTrack extends GrObject {
  constructor(params = {}) {
      let group = new T.Group();
      super("FigureEightTrack-" + f8ctr++, group);

      // crossHeight: how high the snowmen jump.
      this.crossHeight = params.crossHeight || 5; 

      this.radius = params.radius || 20;
      this.x = params.x || 0;
      this.y = params.y || 0;
      this.z = params.z || 0;

      // Create the track material
      let material = new T.MeshStandardMaterial({
          color: "#606060",
          side: T.DoubleSide,
          roughness: 0.8
      });
  }

  eval(u) {

      // Calculate the position on the figure eight
      let p = u * 2 * Math.PI;
      let r = this.radius;

      let x = r * Math.sin(p);
      let z = r * Math.sin(p) * Math.cos(p);
      let y = this.y; 

      // Normalize u for repeating pattern detection
      // Normalize u to 0-1 for repetitive pattern
      let normalizedU = u % 1; 

      // Halfway through the figure 8, between u = 0.4 and 0.6, make the snowman jump.
      let u1 = 0.4; let u2 = 0.6;
      if (normalizedU >= u1 && normalizedU < u2) {
          let phaseU = (normalizedU - u1) / (u2 - u1); 
          y += Math.sin(phaseU * Math.PI) * this.crossHeight; // Rise and fall effect.
      }

      // When the figure 8 is done being drawn, do a second jump.
      let u3 = 0.9; let u4 = 0.1;
      if (normalizedU >= u3 || normalizedU < u4) {
          let phaseU;

          // Make the snowman rise up.
          if (normalizedU >= u3) {
              phaseU = (normalizedU - u3) / (1.0 - u3 + u4);
          } 
          
          // Make the snowman go back down after jumping.
          else { 
              phaseU = (normalizedU + (1.0 - u3)) / (1.0 - u3 + u4);
          }
          y += Math.sin(phaseU * Math.PI) * this.crossHeight;
      }

      return [this.x + x, y, this.z + z];
  }

  tangent(u) {
      // Compute the tangent for the rotation of objects on the figure 8 track
      let p = u * 2 * Math.PI;
      let dx = Math.cos(p);
      let dz = Math.cos(p) * Math.cos(p) - Math.sin(p) * Math.sin(p);
      return [-dx, 0, -dz];
  }
}

/**
 * Moving bulldozer.
 */
export class TrackDozer extends GrBulldozer {
  constructor(track, params = {}) {
      super(params);
      this.track = track;
      this.u = params.u || 0;  // Start position on the track
      this.direction = 1;  // Direction of movement: 1 for forward, -1 for backward
      this.rideable = this.objects[0];
      this.halfway_rot = params.halfway || 0;

      // Variables to stop the bulldozer when it is at u = 0 or u = 1.
      // Used to create a pattern of waiting before a block is received or given
      // before moving.
      this.isStopped = true;
      this.stopTimer = 0;
      this.stopTimeZero = params.stopZeroTime || 0;
      this.stopTimeOne = params.stopOneTime || 0;
      this.cubeGoesForward = params.cubeGoesForward || true;
  }
  stepWorld(delta, timeOfDay) {
      // Manage stopping at u = 0
      if (this.u === 0 && !this.isStopped) {
        this.isStopped = true;
        this.stopTimer = this.stopTimeZero;
      }
      // Manage stopping at u = 1
      else if (this.u === 1 && !this.isStopped) {
          this.isStopped = true;
          this.stopTimer = this.stopTimeOne;
      }

      // Handle the stop logic
      if (this.isStopped) {
          if (this.stopTimer > 0) {
              this.stopTimer -= delta;
              return; // Skip moving while stopped
          } else {
              this.isStopped = false; // Reset the stop flag
              // Toggle direction after stop
              this.direction = this.u === 0 ? 1 : -1;
          }
      }

      // Speed of movement along the track
      const speed = 0.0005;  
      this.u += this.direction * delta * speed;

      // Reverse direction if u = 0 or 1.
      if (this.u > 1) {
          this.u = 1;
          this.direction = -1;
      } else if (this.u < 0) {
          this.u = 0;
          this.direction = 1;
      }

      // If bulldozer is about to give a block, make the cube visible.
      this.cube.visible = this.direction < 0;

      // Get the position from the track, and set the bulldozer's position accordingly.
      let pos = this.track.eval(this.u);  
      this.objects[0].position.set(pos[0], pos[1], pos[2]);

      // Get the tangent direction from the track
      let dir = this.track.tangent(this.u);  

      // Compute the rotation angle based on the tangent
      let zAngle = Math.atan2(dir[2], dir[0]);  

       // Rotate 180 degrees at the halfway point. 
      if (this.u > 0.5) {
          this.objects[0].rotation.y = this.halfway_rot;
      } else {
          this.objects[0].rotation.y = -zAngle - Math.PI / 2; // Normal rotation adjustment
      }
  }
}

/**
 * Moving and jumping snowman.
 */
export class TrackSnowman extends GrSnowman {
  constructor(track, params = {}) {
    super(params);
    this.track = track;
    this.u = params.u || 0;
    this.rideable = this.objects[0];
  }
  // Copied from the TrackCar.
  stepWorld(delta, timeOfDay) {
    let speed = 5000;
    this.u += delta / speed;
    let pos = this.track.eval(this.u);
    // remember, the center of the cube needs to be above ground!
    this.objects[0].position.set(pos[0], 0.5 + pos[1], pos[2]);
    let dir = this.track.tangent(this.u);
    // since we can't easily construct the matrix, figure out the rotation
    // easy since this is 2D!
    let zAngle = Math.atan2(dir[2], dir[0]);
    // turn the object so the Z axis is facing in that direction
    this.objects[0].rotation.y = -zAngle - Math.PI / 2;
    
    super.stepWorld(delta);
  }
}


