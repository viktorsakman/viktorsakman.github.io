import * as T from "../libs/CS559-Three/build/three.module.js";
import * as Loaders from "../libs/CS559-Framework/loaders.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";
import * as SimpleObjects from "../libs/CS559-Framework/SimpleObjects.js";

/**
 * Convert degrees to radians and return it. 
 */
function degrees(deg) {
    return (deg * Math.PI) / 180;
}

/**
 * Changes part of the ground to a given texture.
 */
let groundCtr = 1;
export class GrGround extends GrObject {
    constructor(params = {}) {
        let group = new T.Group();
        let groundGeometry = new T.BoxGeometry(50, 0.5, 50);

        const loader = new T.TextureLoader();
        const groundTexture = loader.load(params.textureURL);
        let groundMaterial = new T.MeshStandardMaterial({ map: groundTexture });

        let ground = new T.Mesh(groundGeometry, groundMaterial);
        group.add(ground);
        
        let name = params.name || "Ground-" + groundCtr++;
        super(name, group);
        this.setPos(params.x, params.y, params.z);
    }
}

/**
 * House taken from a previous workbook. 
 */
export class GrHouse extends GrObject {
    constructor(params = {}) {
        let geometry = new T.BufferGeometry();
        const vertices = new Float32Array([
            -4, 0, 0,
            -4, 0, 2,
            -2, 0, 0,
            -2, 0, 2,
            -4, 2, 0,
            -4, 2, 2,
            -2, 2, 0,
            -2, 2, 2,
            -3, 3, 1,
        ]);
        const indices = [
            0, 1, 3,  0, 3, 2,
            1, 3, 5,  5, 3, 7,
            3, 2, 7,  7, 2, 6,
            2, 0, 6,  6, 0, 4,
            0, 1, 4,  4, 1, 5,
            5, 7, 8,  7, 6, 8,  6, 4, 8,  8, 4, 5,
        ];
        const uvs = new Float32Array([
            0, 0, // 0 ✓
            1, 0, // 1 ✓
            1, 0, // 2
            0, 0, // 3 
            0, 1, // 4 ✓
            1, 1, // 5 ✓
            1, 1, // 6
            0, 1, // 7
            0, 0, // 8

        ]);
  
        geometry.setIndex(indices);
        geometry.setAttribute('position', new T.BufferAttribute(vertices, 3));
        geometry.setAttribute('uv', new T.BufferAttribute(uvs, 2));
        geometry.computeVertexNormals();
      
        // Define two groups: one for the roof, another for the rest
        geometry.addGroup(0, 30, 0); // First 30 indices for walls
        geometry.addGroup(30, 12, 1); // Next 12 indices for the roof

        // Create materials
        const txr = new T.TextureLoader().load("./textures/bricks.png");
        let brickMaterial = new T.MeshStandardMaterial({ 
            color: "white", 
            roughness: 0.75, 
            map: txr }
        );
        
        const roofMaterial = new T.MeshBasicMaterial({ color: new T.Color(1, 0, 1) });

        // Multi-material array
        const materials = [brickMaterial, roofMaterial];
        let mesh = new T.Mesh(geometry, materials);

        // Door geometry
        const doorGeometry = new T.BoxGeometry(0.5, 1, 0.1);
        const doorMaterial = new T.MeshStandardMaterial({ color: "brown" });
        const doorMesh = new T.Mesh(doorGeometry, doorMaterial);
        doorMesh.position.set(-3, 0.5, 1.955);  // Positioning the door on the front face

        // Window geometry
        const windowGeometry = new T.BoxGeometry(0.4, 0.4, 0.1);
        const windowMaterial = new T.MeshStandardMaterial({ color: "lightblue" });
        const windowMesh1 = new T.Mesh(windowGeometry, windowMaterial);
        windowMesh1.position.set(-3.5, 1.5, 1.955);  // Positioning the first window

        const windowMesh2 = new T.Mesh(windowGeometry, windowMaterial);
        windowMesh2.position.set(-2.5, 1.5, 1.955);  // Positioning the second window

        // Add all components to the group
        mesh.add(new T.Mesh(geometry, brickMaterial));
        mesh.add(doorMesh);
        mesh.add(windowMesh1);
        mesh.add(windowMesh2);

        super("House", mesh);
        this.vertices = vertices;
        this.indices = indices;

        this.setScale(params.sx, params.sy, params.sz);
        this.setPos(params.x, params.y, params.z);
    }
}

/**
 * Igloo taken from a previous workbook. 
 */
export class GrIgloo extends GrObject {
    constructor(params = {}) {
        let geometry = new T.BufferGeometry();
        const vertices = new Float32Array([
            -0.3, 0, 0,
            0.3, 0, 0,
            -0.5, 0.5, 0,
            0.5, 0.5, 0,
            -0.3, 1, 0,
            0.3, 1, 0,
            -0.3, 0, -0.2,
            0.3, 0, -0.2,
            -0.5, 0.5, -0.2,
            0.5, 0.5, -0.2,
            -0.3, 1, -0.2,
            0.3, 1, -0.2,
        ]);
        const indices = [
          0, 7, 1,  0, 6, 7,
          1, 7, 3,  3, 7, 9,
          3, 9, 5, 5, 9, 11,
          4, 5, 10,  10, 5, 11,
          2, 4, 8,  8, 4, 10,
          6, 0, 8,  8, 0, 2,
          0, 4, 2,  5, 1, 3,  0, 1, 4,  4, 1, 5,
          11, 9, 7,  10, 6, 8,  7, 6, 11,  11, 6, 10,
        ];
        const uvs = new Float32Array([
            0, 0,   // UV for Vertex 0
            1, 0,   // UV for Vertex 1
            0, 0,   // UV for Vertex 2
            1, 1,   // UV for Vertex 3
            1, 1,   // UV for Vertex 4
            1, 0,   // UV for Vertex 5
            0, 1,   // UV for Vertex 6 ✓
            1, 1,   // UV for Vertex 7
            0, 1,   // UV for Vertex 8 ✓
            0, 1,   // UV for Vertex 9
            0, 0,   // UV for Vertex 10 ✓
            1, 1,   // UV for Vertex 11 ✓
        ]);

        geometry.setIndex(indices);
        geometry.setAttribute('position', new T.BufferAttribute(vertices, 3));
        geometry.setAttribute('uv', new T.BufferAttribute(uvs, 2));
        geometry.computeVertexNormals();
        
        const iceTexture = new T.TextureLoader().load("./textures/ice.png");
        const material = new T.MeshStandardMaterial({ map: iceTexture });
        let mesh = new T.Mesh(geometry, material);

        // Create the entrance cylinder
        const entranceGeometry = new T.CylinderGeometry(0.1, 0.05, 0.9, 32); // radiusTop, radiusBottom, height, radialSegments
        const entranceMaterial = new T.MeshStandardMaterial({ color: "cyan" });
        const entranceMesh = new T.Mesh(entranceGeometry, entranceMaterial);

        // Position the entrance relative to the igloo
        entranceMesh.position.set(0, 1.0, -0.1); // Adjust these values to position correctly on your igloo
        entranceMesh.rotation.set(0, 0, 0);

        // Add the entrance to the igloo mesh or group
        mesh.add(entranceMesh);

        super("Igloo", mesh);
        this.vertices = vertices;
        this.indices = indices;

        this.setScale(params.sx || 1, params.sy || 1, params.sz || 1);
        this.setPos(params.x, params.y, params.z);
    }
    getVertices() {
        return this.vertices;
    }
    getIndices() {
      return this.indices;
    }
}

/**
 * Pine Tree taken from a previous workbook. 
 */
let PineTreeCtr = 1;
export class GrPineTree extends GrObject {
    constructor(params = {}) {
        let group = new T.Group();

        // Trunk
        const trunkGeometry = new T.CylinderGeometry(0.2, 0.2, 1, 16);
        const trunkMaterial = new T.MeshStandardMaterial({color: "sienna"});
        const trunkMesh = new T.Mesh(trunkGeometry, trunkMaterial);
        trunkMesh.position.y = 0.5; 
        group.add(trunkMesh);

        // Leaves
        const foliageGeometry = new T.ConeGeometry(0.8, 2, 16);
        const foliageMaterial = new T.MeshStandardMaterial({color: "lightgreen"});
        const foliageMesh = new T.Mesh(foliageGeometry, foliageMaterial);
        foliageMesh.position.y = 2; // Position on top of the trunk
        group.add(foliageMesh);

        super("PineTree-" + PineTreeCtr++, group);
        this.setScale(params.sx || 1, params.sy || 1, params.sz || 1);
        this.setPos(params.x, params.y, params.z);
    }
}

/**
 * Cherry picker taken from a previous workbook. 
 */
export class GrCherryPicker extends GrObject {
    constructor(params = {}) {
        let group = new T.Group();
  
        // Create the base of the cherry-picker.
        let geometry = new T.BoxGeometry(2, 1, 3);
        let material = new T.MeshStandardMaterial({ color: 'red' });
        let base = new T.Mesh(geometry, material);
        base.position.y = 1;
        group.add(base);
  
        // Create the tires of the cherry-picker.
        let tireMaterial = new T.MeshStandardMaterial({ color: 'black' });
        let tireGeometry = new T.SphereGeometry(0.52, 32, 32); 
        let tirePositions = [
            { x: -1, y: 0.5, z: 1 },  // Front left
            { x: 1, y: 0.5, z: 1 },   // Front right
            { x: -1, y: 0.5, z: -1 }, // Rear left
            { x: 1, y: 0.5, z: -1 }   // Rear right
        ];
  
        // Position the tires relative to the base.
        tirePositions.forEach(pos => {
            let tire = new T.Mesh(tireGeometry, tireMaterial);
            tire.position.set(pos.x, pos.y, pos.z);
            group.add(tire);
        });
  
        // The base arm group.
        let armGroup = new T.Group();
        group.add(armGroup);
        armGroup.position.set(0, 2.6, 0);
  
        // Create the base arm.
        let armGeometry = new T.BoxGeometry(0.5, 4, 0.5);
        let armMaterial = new T.MeshStandardMaterial({ color: 'brown' });
        let arm = new T.Mesh(armGeometry, armMaterial);
        armGroup.add(arm); // Add arm to armGroup
  
        // The forearm group.
        let forearmGroup = new T.Group();
        arm.add(forearmGroup);
        forearmGroup.position.y = 2;
  
        // Create the forearm.
        let forearmMaterial = new T.MeshStandardMaterial({ color: 'brown' });
        let forearmGeometry = new T.BoxGeometry(0.4, 3.5, 0.4);
        let forearm = new T.Mesh(forearmGeometry, forearmMaterial);
        forearm.position.y = 1.55; 
        forearmGroup.add(forearm);
  
        // The basket group.
        let basketGroup = new T.Group();
        forearmGroup.add(basketGroup);
        basketGroup.position.y = 3.75;
  
        // Create the basket.
        let basketMaterial = new T.MeshStandardMaterial({ color: 'cyan', side: T.DoubleSide });
        let basketGeometry = new T.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        let basket = new T.Mesh(basketGeometry, basketMaterial);
        basket.rotation.x = Math.PI;
        basket.position.y = 0.57;
        basketGroup.add(basket);

        // Creating the moving cube
        let cubeGeom = new T.BoxGeometry(1, 1, 1);
        let cubeMat = new T.MeshStandardMaterial({ color: 'brown' });
        let cube = new T.Mesh(cubeGeom, cubeMat);
        cube.position.set(0, 1, 0); // Initially place it in front of the bulldozer
        basketGroup.add(cube);
  
        // Implement the degrees of freedom for the cherry-picker.
        super("CherryPicker", group, [
            ["x_position", -10, 10, -4.3],
            ["z_position", -10, 10, 3.4],
            ["theta", 0, 360, 0],
            ["arm_position_z", -0.5, 0.5, 0], 
            ["arm_rotation_x", -20, 20, 0], 
            ["arm_rotation_z", -20, 20, 0], 
            ["forearm_rotation_x", -90, 90, 58],
            ["forearm_rotation_z", -90, 90, 0],
            ["basket_rotation_x", -90, 90, -45], 
            ["basket_rotation_z", -90, 90, 0]
        ]);
  
        this.time = 0;
        this.whole_ob = group;
        this.armGroup = armGroup;
        this.forearmGroup = forearmGroup;
        this.basketGroup = basketGroup;

        // Add a building block cube for when the cherrypicker
        // picks up a block.
        this.cube = cube;
        this.cube.visible = true;
        this.previousArmSwing = 0;
  
        let scale = params.size ? Number(params.size) : 1;
        group.scale.set(scale, scale, scale);
        this.setPos(params.x, params.y, params.z);
    }
  
    
    stepWorld(delta, timeOfDay) {
      // Increment the current time with time elapsed since the last frame.
      this.time += delta;
      
      // Adjust how fast the arm, forearm, and basket moves.
      let speed = 25;
      const armSwingSpeed = Math.sin(this.time / (10000/speed));
      
      // If the arm is moving forward, there should be a building block visible.
      // Otherwise, the block shouldn't be visible as it hasn't picked up the block yet.
      if (armSwingSpeed > this.previousArmSwingSpeed) {
          this.cube.visible = true;  
      } else {
          this.cube.visible = false; 
      }
      this.previousArmSwingSpeed = armSwingSpeed;
  
      // Oscillate the main arm up and down
      this.armGroup.rotation.x = armSwingSpeed * degrees(20); // Oscillates by ±45 degrees
  
      // Oscillate the forearm similarly
      this.forearmGroup.rotation.x = armSwingSpeed * degrees(120); // Oscillates by ±30 degrees
  
      // Oscillate the basket
      this.basketGroup.rotation.z = armSwingSpeed * degrees(-120); // Oscillates by ±22.5 degrees
    }
}

/**
 * Bulldozer taken from a previous workbook.
 */
export class GrBulldozer extends GrObject {
    constructor(params = {}) {
        let group = new T.Group();
  
        // The base of the bulldozer.
        let geometry = new T.BoxGeometry(3, 1, 4); // Cube geometry
        let base_color = params.base_color || "yellow"
        let material = new T.MeshStandardMaterial({ color: base_color });
        let base = new T.Mesh(geometry, material);
        base.position.y = 1;
        group.add(base);
  
        // Create and add the large (belt) wheels for the bulldozer.
        let wheelMaterial = new T.MeshStandardMaterial({ color: 'black' });      let wheelGeometry = new T.TorusGeometry(1, 0.2, 100, 100);
        let wheelPositions = [
            { x: -1.5, y: 1, z: 0 }, // Left side
            { x: 1.5, y: 1, z: 0 }   // Right side
        ];
  
        // Position the wheels relative to the base.
        wheelPositions.forEach(pos => {
            let wheel = new T.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(pos.x, pos.y, pos.z);
            wheel.scale.set(2, 1, 1);
            wheel.rotation.set(0, Math.PI / 2, 0); 
            group.add(wheel);
        });
  
        // Add the cab on top of the base.
        let cabGeometry = new T.BoxGeometry(2, 1, 2.5);
        let top_color = params.top_color || "#b3b015"
        let cabMaterial = new T.MeshStandardMaterial({ color: top_color });
        let cab = new T.Mesh(cabGeometry, cabMaterial);
        cab.position.set(0, 2, 0);
        group.add(cab);
  
        // Arm group used to rotate the arms.
        let armsGroup = new T.Group();
        group.add(armsGroup);
        armsGroup.position.set(0, 0.9, 2.5); 
  
        // Add arms in front of the bulldozer
        let armMaterial = new T.MeshStandardMaterial({ color: 'grey' });
        let armGeometry = new T.BoxGeometry(0.3, 0.5, 1.3); 
  
        // Left arm
        let leftArm = new T.Mesh(armGeometry, armMaterial);
        armsGroup.add(leftArm);
        leftArm.position.set(-1, 0, 0);
  
        // Right arm
        let rightArm = new T.Mesh(armGeometry, armMaterial);
        armsGroup.add(rightArm);
        rightArm.position.set(1, 0, 0);
  
        
        // Create a group for the basket in front of the bulldozer.
        let basketGroup = new T.Group(); 
  
        // Attach the basket to the arms.
        armsGroup.add(basketGroup);
        basketGroup.position.set(0, 0, 1.2); 
  
        // Create the basket material.
        let basketMaterial = new T.MeshStandardMaterial({ color: 'grey', side: T.DoubleSide });
        let basketGeometry = new T.SphereGeometry(1.5, 100, 100, 0, Math.PI * 2, 0, Math.PI / 2);
        
        // Add the basket.
        let basket = new T.Mesh(basketGeometry, basketMaterial);
        basket.rotation.x = -Math.PI / 2; 
        basket.scale.set(2, 0.6, 0.5);
        basketGroup.add(basket);

        // Creating the moving cube
        let cubeGeom = new T.BoxGeometry(2, 2, 2);
        let cubeMat = new T.MeshStandardMaterial({ color: 'brown' });
        let cube = new T.Mesh(cubeGeom, cubeMat);
        cube.position.set(0, 2, 4); // Place the cube in front of the bulldozer for when it's visible.
        group.add(cube);
  
        // Implement the degrees of freedom for the bulldozer.
        super("Bulldozer-" + base_color, group, [
            ["x_position", -10, 10, 3.6],
            ["z_position", -10, 10, 3.2],
            ["theta", 0, 360, 72.5],
            ["Arm_x_rotation", -30, 30, 0],
            ["Basket_x_rotation", -45, 45, 0], // New parameter for basket rotation on x-axis
            ["Basket_z_rotation", -10, 10, 0]
        ]);
  
        this.whole_ob = group;
        this.armsGroup = armsGroup;
        this.basketGroup = basketGroup; 

        this.cube = cube;
        this.cube.visible = false;
  
        let scale = params.size ? Number(params.size) : 1;
        group.scale.set(scale, scale, scale);
        this.setPos(params.x, params.y, params.z);
    }
  
    // Update the bulldozer.
    update(paramValues) {
        this.whole_ob.position.x = paramValues[0];
        this.whole_ob.position.z = paramValues[1];
        this.whole_ob.rotation.y = degrees(paramValues[2]);
        this.armsGroup.rotation.x = degrees(paramValues[3]);
        this.basketGroup.rotation.x = degrees(paramValues[4]);
        this.basketGroup.rotation.z = degrees(paramValues[5]);   
    }
}

/**
 * Roundabout taken from a previous workbook. This was a given example.
 */
export class GrColoredRoundabout extends GrObject {
    constructor(params = {}) {
      let roundabout = new T.Group();

      /**
       * Add the grey base that the roundabout spins on top of.
       */
      let base_geom = new T.CylinderGeometry(0.5, 1, 0.5, 16);
      let base_mat = new T.MeshStandardMaterial({
        color: "#888888",
        metalness: 0.5,
        roughness: 0.8
      });
      let base = new T.Mesh(base_geom, base_mat);
      base.translateY(0.25);
      roundabout.add(base);
  
      let platform_group = new T.Group();
      base.add(platform_group);
      platform_group.translateY(0.25);

      /**
       * Prepare the handle geometry and material so that it is added in the loop
       * below.
       */
      let handle_geom = buildHandle();
      let handle_mat = new T.MeshStandardMaterial({
        color: "#999999",
        metalness: 0.8,
        roughness: 0.2
      });
      let handle;
  
      // In the loop below, we add four differently-colored sections, with handles,
      // all as part of the platform group.

      /**
       * Create each of the sections. Add a handle bar in each iteration of the loop.
       */
      let section_geom = new T.CylinderGeometry(2, 1.8, 0.3, 8, 4, false, 0, Math.PI / 2);
      let section_mat; let section;
      let section_colors = ["red", "blue", "yellow", "green"];
      for (let i = 0; i < section_colors.length; i++) {
        section_mat = new T.MeshStandardMaterial({
          color: section_colors[i],
          metalness: 0.3,
          roughness: 0.6
        });
        section = new T.Mesh(section_geom, section_mat);
        handle = new T.Mesh(handle_geom, handle_mat);
        section.add(handle);
        handle.rotation.set(0, Math.PI / 4, 0);
        handle.translateZ(1.5);
        platform_group.add(section);
        section.rotateY((i * Math.PI) / 2);
      }
  
      // note that we have to make the Object3D before we can call
      // super and we have to call super before we can use this
      super("Roundabout", roundabout);
      this.whole_ob = roundabout;
      this.platform = platform_group;
  
      // put the object in its place
      this.whole_ob.position.x = params.x ? Number(params.x) : 0;
      this.whole_ob.position.y = params.y ? Number(params.y) : 0;
      this.whole_ob.position.z = params.z ? Number(params.z) : 0;
      roundabout.scale.set(params.sx || 1, params.sy || 1, params.sz || 1);
  
      /**
       * Creates each handle using a curve path.
       */
      function buildHandle() {
        let handle_curve = new T.CurvePath();
        handle_curve.add(
          new T.LineCurve3(new T.Vector3(-0.5, 0, 0), new T.Vector3(-0.5, 0.8, 0))
        );
        handle_curve.add(
          new T.CubicBezierCurve3(
            new T.Vector3(-0.5, 0.8, 0),
            new T.Vector3(-0.5, 1, 0),
            new T.Vector3(0.5, 1, 0),
            new T.Vector3(0.5, 0.8, 0)
          )
        );
        handle_curve.add(
          new T.LineCurve3(new T.Vector3(0.5, 0.8, 0), new T.Vector3(0.5, 0, 0))
        );
        return new T.TubeGeometry(handle_curve, 64, 0.1, 8);
      }
    }

    /**
     * Rotate the roundabout around its y-axis to create a spinning effect.
     */
    stepWorld(delta, timeOfDay) {
      this.platform.rotateY(0.005 * delta);
    }
  
  
}

/**
 * Roundabout taken from a previous workbook. This was a given example.
 */
export class GrSwing extends GrObject {
    /**
     * @param {SimpleSwingProperties} params
     */
    constructor(params = {}) {
      let simpleSwing = new T.Group();
      addPosts(simpleSwing);
  
      // Here, we create a "hanger" group, which the swing chains will hang from.
      // The "chains" for the simple swing are just a couple thin cylinders.

      /**
       * Create the chains that hold the seat.
       */
      let hanger = new T.Group();
      simpleSwing.add(hanger);
      hanger.translateY(1.8);
      let chain_geom = new T.CylinderGeometry(0.05, 0.05, 1.4);
      let chain_mat = new T.MeshStandardMaterial({
        color: "#777777",
        metalness: 0.8,
        roughness: 0.2
      });
      let l_chain = new T.Mesh(chain_geom, chain_mat);
      let r_chain = new T.Mesh(chain_geom, chain_mat);
      hanger.add(l_chain);
      hanger.add(r_chain);
      l_chain.translateY(-0.75);
      l_chain.translateZ(0.4);
      r_chain.translateY(-0.75);
      r_chain.translateZ(-0.4);
  
      /**
       * Create the seat and add it.
       */
      let seat_group = new T.Group();
      let seat_geom = new T.BoxGeometry(0.4, 0.1, 1);
      let seat_mat = new T.MeshStandardMaterial({
        color: "#554433",
        metalness: 0.1,
        roughness: 0.6
      });
      let seat = new T.Mesh(seat_geom, seat_mat);
      seat_group.add(seat);
      seat_group.position.set(0, -1.45, 0);
      hanger.add(seat_group);
  
      // note that we have to make the Object3D before we can call
      // super and we have to call super before we can use this
      super("Swing", simpleSwing);
      this.whole_ob = simpleSwing;
      this.hanger = hanger;
      this.seat = seat_group;
  
      // put the object in its place
      this.whole_ob.position.x = params.x ? Number(params.x) : 0;
      this.whole_ob.position.y = params.y ? Number(params.y) : 0;
      this.whole_ob.position.z = params.z ? Number(params.z) : 0;
      simpleSwing.scale.set(params.sx || 1, params.sy || 1, params.sy || 1);
  
      this.swing_max_rotation = Math.PI / 4;
      this.swing_direction = 1;
  
      /**
       * A method that creates the red posts that make up the structure of the swing.
       */
      function addPosts(group) {
        let post_material = new T.MeshStandardMaterial({
          color: "red",
          metalness: 0.6,
          roughness: 0.5
        });
        let post_geom = new T.CylinderGeometry(0.1, 0.1, 2, 16);
        let flPost = new T.Mesh(post_geom, post_material);
        group.add(flPost);
        flPost.position.set(0.4, 0.9, 0.9);
        flPost.rotateZ(Math.PI / 8);
        let blPost = new T.Mesh(post_geom, post_material);
        group.add(blPost);
        blPost.position.set(-0.4, 0.9, 0.9);
        blPost.rotateZ(-Math.PI / 8);
        let frPost = new T.Mesh(post_geom, post_material);
        group.add(frPost);
        frPost.position.set(0.4, 0.9, -0.9);
        frPost.rotateZ(Math.PI / 8);
        let brPost = new T.Mesh(post_geom, post_material);
        group.add(brPost);
        brPost.position.set(-0.4, 0.9, -0.9);
        brPost.rotateZ(-Math.PI / 8);
        let topPost = new T.Mesh(post_geom, post_material);
        group.add(topPost);
        topPost.position.set(0, 1.8, 0);
        topPost.rotateX(-Math.PI / 2);
      }
    }
    /**
     * Make the swing swing back and forth.
     */
    stepWorld(delta, timeOfDay) {
        // if we swing too far forward or too far backward, switch directions.
        if (this.hanger.rotation.z >= this.swing_max_rotation)
            this.swing_direction = -1;
        else if (this.hanger.rotation.z <= -this.swing_max_rotation)
            this.swing_direction = 1;
        this.hanger.rotation.z += this.swing_direction * 0.003 * delta;
    }
  
}

/**
 * Snowman from a previous workbook.
 */
export class GrSnowman extends GrObject {
    constructor(params = {}) {
        let group = new T.Group();

        const bodyColor = params.bodyColor || "white";
        const hatColor = params.hatColor || "black";

        // Create the lower body.
        let lowerBodyGeometry = new T.SphereGeometry(4, 32, 32);
        let lowerBodyMaterial = new T.MeshPhongMaterial({ color: bodyColor }); 
        let lowerBody = new T.Mesh(lowerBodyGeometry, lowerBodyMaterial);
        lowerBody.position.set(params.x || 0, params.y || 4, 0);
        group.add(lowerBody);

        // Create the middle body.
        let bodyGeometry = new T.SphereGeometry(3, 32, 32);
        let bodyMaterial = new T.MeshPhongMaterial({ color: bodyColor }); 
        let body = new T.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(0, 5.5, 0);
        lowerBody.add(body);

        // Create the head.
        let headGeometry = new T.SphereGeometry(2, 32, 32);
        let headMaterial = new T.MeshPhongMaterial({ color: bodyColor }); 
        let head = new T.Mesh(headGeometry, headMaterial);
        head.position.set(0, 9.5, 0);
        lowerBody.add(head);

        // Create the dots that will be used for the eyes and buttons.
        let dotGeometry = new T.SphereGeometry(0.25, 32, 32);
        let dotMaterial = new T.MeshPhongMaterial({ color: "black" });

        // Create the left eye.
        let left_eye = new T.Mesh(dotGeometry, dotMaterial);
        left_eye.position.set(-0.6, 0.5, 2);
        head.add(left_eye);

        // Create the right eye.
        let right_eye = new T.Mesh(dotGeometry, dotMaterial);
        right_eye.position.set(0.7, 0.5, 2);
        head.add(right_eye);

        // Add the three buttons.
        let button = new T.Mesh(dotGeometry, dotMaterial);
        button.position.set(0, 2, 2.5);
        body.add(button);
        button = new T.Mesh(dotGeometry, dotMaterial);
        button.position.set(0, 1.2, 2.9);
        body.add(button);
        button = new T.Mesh(dotGeometry, dotMaterial);
        button.position.set(0, 0.4, 3.1);
        body.add(button);

        // Create the nose.
        let noseGeometry = new T.ConeGeometry(0.5, 3, 32);
        let noseMaterial = new T.MeshPhongMaterial({ color: "orange" });
        let nose = new T.Mesh(noseGeometry, noseMaterial);
        nose.position.set(0, 0, 2);
        nose.rotation.set(Math.PI / 2, 0, 0);
        head.add(nose);

        // Create the mouth.
        let mouthGeometry = new T.TorusGeometry(0.5, 0.1, 2, 100, Math.PI); 
        let mouthMaterial = new T.MeshPhongMaterial({ color: "black" });
        let mouth = new T.Mesh(mouthGeometry, mouthMaterial);
        mouth.position.set(0, -0.25, 1.92);
        mouth.rotation.set(Math.PI, 0, 0);
        head.add(mouth);

        // Create the hat visor.
        let visorGeometry = new T.CylinderGeometry(2.5, 2.5, 0.1, 100);
        let visorMaterial = new T.MeshPhongMaterial({ color: hatColor });
        let visor = new T.Mesh(visorGeometry, visorMaterial);
        visor.position.set(0, 1.4, 0);
        head.add(visor);

        // Create the hat crown.
        let crownGeometry = new T.CylinderGeometry(1.5, 1.5, 2, 100);
        let crownMaterial = new T.MeshPhongMaterial({ color: hatColor });
        let crown = new T.Mesh(crownGeometry, crownMaterial);
        crown.position.set(0, 2.4, 0);
        head.add(crown);

        // Create the left arm.
        let leftArmGeometry = new T.CylinderGeometry(0.25, 0.25, 4, 100);
        let leftArmMaterial = new T.MeshPhongMaterial({ color: "brown" });
        let leftArm = new T.Mesh(leftArmGeometry, leftArmMaterial);
        leftArm.position.set(-4, 0.5, 0);
        leftArm.rotation.set(0, 0, Math.PI / 2);
        body.add(leftArm);

        // Create the right arm.
        let rightArmGeometry = new T.CylinderGeometry(0.25, 0.25, 4, 100);
        let rightArmMaterial = new T.MeshPhongMaterial({ color: "brown" });
        let rightArm = new T.Mesh(rightArmGeometry, rightArmMaterial);
        rightArm.position.set(4, 0.5, 0);
        rightArm.rotation.set(0, 0, Math.PI / 2);
        body.add(rightArm);

        // Create the left hand.
        let leftHandGeometry = new T.CylinderGeometry(0.25, 0.25, 1.7, 100);
        let leftHandMaterial = new T.MeshPhongMaterial({ color: "brown" });
        let leftHand = new T.Mesh(leftHandGeometry, leftHandMaterial);
        leftHand.position.set(0, 1.15, 0);
        leftHand.rotation.set(0, 0, Math.PI / 2);
        leftArm.add(leftHand);

        // Create the right hand.
        let rightHandGeometry = new T.CylinderGeometry(0.25, 0.25, 1.7, 100);
        let rightHandMaterial = new T.MeshPhongMaterial({ color: "brown" });
        let rightHand = new T.Mesh(rightHandGeometry, rightHandMaterial);
        rightHand.position.set(0, 1.15, 0);
        rightHand.rotation.set(0, 0, Math.PI / 2);
        rightArm.add(rightHand);

        super("Snowman-" + hatColor, group);
        this.setScale(params.sx || 1, params.sy || 1, params.sz || 1);
        this.setPos(params.x, params.y, params.z);
        this.leftArm = leftArm;
        this.rightArm = rightArm;
    }

    // Move the arms, like in the previous workbook.
    stepWorld(delta) {
        let currentTime = performance.now();
        let speed = 0.005; 
        let range = 0.6; 
        let rotation = Math.sin(currentTime * speed) * range + 2;
    
        this.leftArm.rotation.set(0, 0, Math.PI / rotation)
        this.rightArm.rotation.set(0, 0, -Math.PI / rotation)    
    }
}

// Person: https://free3d.com/3d-model/boy-3d-model-88773.html
/**
 * I consulted the example car in order to load this "Person" object in.
 */
let personCtr = 1;
export class GrPerson extends Loaders.FbxGrObject {
  constructor(params = {}) {
    super({
      fbx: "./person.fbx",
      norm: 2.0,
      name: "Person-" + personCtr++,
    });
    this.setPos(params.x, params.y, params.z);
    this.setScale(params.size || 1, params.size || 1, params.size || 1);
    this.objects.forEach((obj) => {
      obj.rotation.x = params.rx || 0;
      obj.rotation.y = params.ry || 0; 
      obj.rotation.z = params.rz || 0; 
    });
  }
}

/**
 * A newly created object for this project, a table.
 */
export class GrTable extends GrObject {
  constructor(params = {}) {
      let group = new T.Group();

      /**
       * Create the table top.
       */
      const tableMaterial = new T.MeshStandardMaterial({ color: "brown", roughness: 0.6 });
      const topGeometry = new T.BoxGeometry(5, 0.2, 3);
      const top = new T.Mesh(topGeometry, tableMaterial);
      top.position.y = 2; 
      group.add(top);

      /**
       * Create the table legs.
       */
      const legGeometry = new T.BoxGeometry(0.3, 2, 0.3); 
      // Use a for loop to add all 4 legs.
      for (let i = -1; i <= 1; i += 2) {
        for (let j = -1; j <= 1; j += 2) {
          const leg = new T.Mesh(legGeometry, tableMaterial);
          leg.position.set(i * 2.25, 1, j * 1.25);
          group.add(leg);
        }
      }

      super("Table", group);
      this.setScale(params.size || 1, params.size || 1, params.size || 1);
      this.setPos(params.x || 0, params.y || 0, params.z || 0);
  }
}

/**
 * A laptop taken from a previous workbook.
 */
export class GrLaptop extends GrObject {
  constructor(params = {}) {

      // Textures for the laptop
      const textureLoader = new T.TextureLoader();
      let keyboard_texture = textureLoader.load('./textures/mac_keyboard.jpeg');
      let screen_texture = textureLoader.load('./textures/mac_screen.jpeg');
      let back_texture = textureLoader.load('./textures/mac_back.jpeg');

      // Materials
      let baseMaterial = new T.MeshStandardMaterial({ color: "white" });
      let topMaterial = new T.MeshStandardMaterial({ color: "white" });
      let keyboardMaterial = new T.MeshStandardMaterial({ map: keyboard_texture });
      let screenMaterial = new T.MeshStandardMaterial({ map: screen_texture });
      let backMaterial = new T.MeshStandardMaterial({ map: back_texture });

      // Geometries
      let baseGeometry = new T.BoxGeometry(2, 0.1, 1.5);
      let topGeometry = new T.BoxGeometry(2, 0.1, 1.5);
      let keyboardGeometry = new T.BoxGeometry(2, 0.05, 1.5); 
      let screenGeometry = new T.BoxGeometry(2, 0.05, 1.4); 
      let backGeometry = new T.BoxGeometry(2, 0.05, 1.4); 
      
      // Meshes
      let base = new T.Mesh(baseGeometry, baseMaterial)
      let top = new T.Mesh(topGeometry, topMaterial);;
      let keyboard = new T.Mesh(keyboardGeometry, keyboardMaterial);
      let screen = new T.Mesh(screenGeometry, screenMaterial);
      let back = new T.Mesh(backGeometry, backMaterial);

      // Adjust this box to make the laptop appear open
      top.rotation.x = -Math.PI / 4; 
      top.position.y = 0.5;
      top.position.z = 1.15;

      keyboard.position.y = 0.05; 

      screen.rotation.x = -Math.PI / 4;
      screen.position.y = 0.564;
      screen.position.z = 1.15;

      back.rotation.x = -Math.PI / 4;
      back.position.y = 0.5;
      back.position.z = 1.22;

      const group = new T.Group();
      group.add(base);
      group.add(top);
      group.add(keyboard);
      group.add(screen);
      group.add(back);

      super("Laptop", group);
      this.setScale(params.size, params.size, params.size);
      this.setPos(params.x || 0, params.y || 0, params.z || 0);
  }
}

/**
 * A newly created object for this project, a chair.
 */
export class GrChair extends GrObject {
  constructor(params = {}) {
    let group = new T.Group();
    const chairMaterial = new T.MeshStandardMaterial({ color: params.color || "navy" });
    
    // Create the seat.
    const seatGeometry = new T.BoxGeometry(2, 0.2, 2);
    const seat = new T.Mesh(seatGeometry, chairMaterial);
    seat.position.y = 1.4; 
    group.add(seat);

    // Create the legs.
    const legGeometry = new T.BoxGeometry(0.2, 2, 0.2);
    const legPositions = [
      { x: -0.9, z: -0.9 },
      { x: 0.9, z: -0.9 },
      { x: -0.9, z: 0.9 },
      { x: 0.9, z: 0.9 }
    ];
    legPositions.forEach(pos => {
      let leg = new T.Mesh(legGeometry, chairMaterial);
      leg.position.set(pos.x, 0.75 / 2, pos.z);
      group.add(leg);
    });

    // Create the backrest.
    const backrestGeometry = new T.BoxGeometry(2, 1.5, 0.2);
    const backrest = new T.Mesh(backrestGeometry, chairMaterial);
    backrest.position.set(0, 2.2, 1); // Position it at the back edge of the seat
    group.add(backrest);

    super("Chair", group);
    this.setScale(params.size || 1, params.size || 1, params.size || 1);
    this.setPos(params.x || 0, params.y || 0, params.z || 0);
  }
}

export class GrConstruction extends GrObject {
  constructor(params = {}) {
      let group = new T.Group();

      // Material for the columns and roof
      const material = new T.MeshStandardMaterial({ color: params.color || "saddlebrown" });

      // Column geometry
      const columnGeometry = new T.BoxGeometry(0.3, 3, 0.3);  // Adjust size as needed

      // Define positions for columns
      const positions = [
        { x: -2, y: 1.5, z: -2 },
        { x: 2, y: 1.5, z: -2 },
        { x: -2, y: 1.5, z: 2 },
        { x: 2, y: 1.5, z: 2 }
      ];

      // Add columns to the group
      positions.forEach(pos => {
        let column = new T.Mesh(columnGeometry, material);
        column.position.set(pos.x, pos.y, pos.z);
        group.add(column);
      });

      // Roof beam geometry (similar to the table legs but used for the roof)
      const beamGeometry = new T.BoxGeometry(4.5, 0.3, 0.3); // Adjust dimensions as needed

      // Add roof beams, rotated to form a simple truss structure
      const beamPositions = [
        { x: -0.5, y: 4, z: -1, rotXZ: degrees(35) },
        { x: -0.5, y: 4, z: 1, rotXZ: degrees(135) },
        { x: 0.5, y: 4, z: -1, rotY: degrees(0), rotXZ: degrees(-135) },
        { x: 0.5, y: 4, z: 1, rotXZ: degrees(-35) }
      ];

      beamPositions.forEach(pos => {
        let beam = new T.Mesh(beamGeometry, material);
        beam.position.set(pos.x, pos.y, pos.z);
        beam.rotation.set(pos.rotXZ || 0, pos.rotY || 0, pos.rotXZ || 0);
        group.add(beam);
      });

      super("IncompleteHouse", group);
      this.setScale(params.size || 1, (params.height || params.size) || 1, params.size || 1);
      this.setPos(params.x || 0, params.y || 0, params.z || 0);
  }
}

/**
 * A sphere with the applied shader taken from a previous workbook.
 */
export class GrSphere extends GrObject {
  constructor(params = {}) {
      let group = new T.Group(); 

      // Define the shader material
      let shaderMat = shaderMaterial("./shaders/shader.vs", "./shaders/shader.fs", {
          side: T.DoubleSide,
          uniforms: {
              time: { value: 0.0 },
              bounce: { value: 0.30 },
              lightDirection: { value: new T.Vector3(0, 0.01, 0) },
              color1: { value: new T.Vector3(0.0, 0.9, 0.9) },
              color2: { value: new T.Vector3(0.9, 0.2, 0.2) },
              color3: { value: new T.Vector3(1.0, 0.2, 1.0) },
          },
      });

      // Create the sphere mesh
      const geometry = new T.SphereGeometry(params.radius || 1, params.widthSegments || 32, params.heightSegments || 32);
      const mesh = new T.Mesh(geometry, shaderMat);
      group.add(mesh);

      super("Ball", group); 
      this.shaderMat = shaderMat; 
      this.mesh = mesh; 
      this.time = 0; 
      this.rotationSpeed = params.rotationSpeed || 0.005;

      this.mesh.position.set(params.x || 0, params.y_value || 0, params.z || 0);
      this.mesh.scale.set(params.size || 1, params.size || 1, params.size || 1);

      /**
       * Animation variables;
       */

      // Record the initial position of where the sphere was created.
      this.initialPosition = new T.Vector3(params.x || 0, params.y_value || 15, params.z || 0);
      
      // Phase 0 is the sphere hitting the ground, phase 1 is the sphere bouncing back up,
      // phase 2 is the overhead pass.
      this.phase = 0;
      this.time = 0;

      // How far the ball will bounce up and down.
      this.bounceDistance = 20; 

      // How fast will the ball move while it bounces up and down.
      this.bounceSpeed = params.bounceSpeed || 0.05; 

      // How high the ball will bounce too.
      this.maxHeight = params.y_value || 15;

      // How fast the ball will move during the overhead pass.
      this.overheadSpeed = params.overheadSpeed|| 0.001;
  }

  stepWorld(delta, timeOfDay) {
      let speed;
      switch (this.phase) {
          // The ball is about to hit the ground. Implement phase 0.
          case 0:
              speed = this.bounceSpeed;
              this.shaderMat.uniforms.time.value = this.time / 100;
              if (this.mesh.position.y > 0) {
                  this.mesh.position.y = Math.max(0, this.maxHeight - this.time * speed);
                  this.mesh.position.x = this.initialPosition.x + (this.time * speed / this.maxHeight) * this.bounceDistance;
              } else {
                  this.mesh.position.y = 0;
                  this.time = 0;
                  this.phase = 1;
              }
              break;
          // The ball is bouncing back up. Implement phase 1.
          case 1:
              this.shaderMat.uniforms.time.value = this.time / 100;
              speed = this.bounceSpeed;
              if (this.mesh.position.y < this.maxHeight) {
                  this.mesh.position.y = Math.min(this.maxHeight, this.time * speed);
                  this.mesh.position.x = this.initialPosition.x + this.bounceDistance + (this.time * speed / this.maxHeight) * this.bounceDistance;
              } else {
                  this.mesh.position.y = this.maxHeight;
                  this.time = 0;
                  this.phase = 2;
              }
              break;
          // The ball was just thrown over the head and is returning to the
          // first person.. Implement phase 2.
          case 2:
              this.shaderMat.uniforms.time.value = this.time / 100;
              speed = this.overheadSpeed;
              let t = this.time * speed;
              this.mesh.position.x = this.initialPosition.x + (2 * this.bounceDistance) - (this.bounceDistance + this.bounceDistance) * t;
              this.mesh.position.y = (this.maxHeight - 4 * this.maxHeight * (t - 0.5) * (t - 0.5)) + this.maxHeight;
              if (t >= 1) {
                  this.mesh.position.copy(this.initialPosition);
                  this.phase = 0;
                  this.time = 0;
              }
              break;
      }
      this.time += delta;
  }
}

