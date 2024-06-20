/**
 * Graphics Town Framework - "Main" File
 *
 * This is the main file - it creates the world, populates it with
 * objects and behaviors, and starts things running
 *
 */

import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { WorldUI } from "../libs/CS559-Framework/WorldUI.js";
import * as T from "../libs/CS559-Three/build/three.module.js";


import { LinearTrack, FigureEightTrack, TrackDozer, TrackSnowman } from "./track.js";
import { GrHouse, GrIgloo, GrPineTree, GrCherryPicker, GrBulldozer,
    GrColoredRoundabout, GrSwing, GrSphere, GrGround, GrSnowman, 
    GrPerson, GrTable, GrLaptop, GrChair, GrConstruction } from "./objects.js";

/**m
 * The Graphics Town Main -
 * This builds up the world and makes it go...
 */

// Make the world
let world = new GrWorld({
    width: 800,
    height: 600,
    groundplanesize: 50, // make the ground plane big enough for a world of stuff
    groundplanecolor: "white"
});

// Add some light to the world.
let ambientLight = new T.AmbientLight(0xffffff, 0.9);
world.scene.add(ambientLight);

/**
 * Add the ground for each of the four worlds.
 */
// Grass: https://www.pinterest.com/pin/470696598531730263/
world.add(new GrGround({x: -25, y: 0, z: -25, name: "Grass", textureURL: "./textures/grass.png"}));

// Dirt Ground: https://www.freepik.com/free-photo/close-up-mixture-clay-powder_11288939.htm#query=dirt%20texture%20seamless&position=15&from_view=keyword&track=ais&uuid=067d2adc-5470-47b2-bd40-85e0b8a4e01a
world.add(new GrGround({x: 25, y: 0, z: -25, name: "Dirt Ground", textureURL: "./textures/dirt.png"}));

// Wooden Floor: https://tingen.com/2019/11/19/timbers-the-homeowners-easiest-landscaping-tool/
world.add(new GrGround({x: 25, y: 0, z: 25, name: "Wooden Floor", textureURL: "./textures/iceground.png"}));

// Ice ground: https://www.vecteezy.com/vector-art/16032892-realistic-vector-illustration-of-an-ice-surface-of-the-river-texture-of-ice-shards-winter-background
world.add(new GrGround({x: -25, y: 0, z: 25, name: "Ice Ground", textureURL: "./textures/wood.png"}));

/**
 * Load the pink space skybox texture.
 * (Take from a previous workbook).
 */
let loader = new T.CubeTextureLoader();
loader.setPath( './textures/' );
let cubeTexture = loader.load( [
  'px.png', 'nx.png',
  'py.png', 'ny.png',
  'pz.png', 'nz.png'
] );
world.scene.background = cubeTexture; 

/**
 * Create the tracks from the bulldozer.
 */
const dtl = 30; // dirt track length
const dirt_track_top = new LinearTrack({x: 25, z: -45, length: dtl, width: 1})
const dirt_track_bottom = new LinearTrack({x: 25, z: -5, length: dtl, width: 1})
const dirt_track_left = new LinearTrack({x: 5, z: -25, rotation: 90, length: dtl, width: 1})
const dirt_track_right = new LinearTrack({x: 45, z: -25, rotation: 90, length: dtl, width: 1})

/**
 * Add the bulldozers to the world.
 */
world.add(new TrackDozer(dirt_track_top, {u: 0, stopZeroTime: 0, stopOneTime: 0, 
    halfway: degrees(90), size: 1.75, base_color: "blue", top_color: "cyan"}));
world.add(new TrackDozer(dirt_track_bottom, {u: 1, stopZeroTime: 0, stopOneTime: 0, 
    halfway: degrees(90),size: 1.75, base_color: "green", top_color: "lightgreen"}));
world.add(new TrackDozer(dirt_track_left, {u: 0, stopZeroTime: 0, stopOneTime: 0, 
    halfway: degrees(0), size: 1.75}));
world.add(new TrackDozer(dirt_track_right, {u: 0, stopZeroTime: 2000, stopOneTime: 2000, 
    halfway: degrees(0), size: 1.75, base_color: "purple", top_color: "magenta"}));

/**
 * Add the cherry picker.
 */
const cherryPicker = new GrCherryPicker({x: 15, y: 0, z: -28, size: 3});
roty(cherryPicker, degrees(45));
world.add(cherryPicker);

/**
 * Create the figure eight track and then add the snowmen to the world.
 */
let snow_track = new FigureEightTrack({radius: 23, crossHeight: 20, x: 25, y: 0, z: 25});
let snowman_size = 0.5;
world.add(new TrackSnowman(snow_track, {u: 0, hatColor: "black", bodyColor: "white", y: 3, sx: snowman_size, sy: snowman_size, sz: snowman_size}));
world.add(new TrackSnowman(snow_track, {u: 1/7, hatColor: "red", bodyColor: "lightpink", y: 3, sx: snowman_size, sy: snowman_size, sz: snowman_size}));
world.add(new TrackSnowman(snow_track, {u: 2/7, hatColor: "orange", bodyColor: "sandybrown", y: 3, sx: snowman_size, sy: snowman_size, sz: snowman_size}));
world.add(new TrackSnowman(snow_track, {u: 3/7, hatColor: "yellow", bodyColor: "papayawhip", y: 3, sx: snowman_size, sy: snowman_size, sz: snowman_size}));
world.add(new TrackSnowman(snow_track, {u: 4/7, hatColor: "green", bodyColor: "lightgreen", y: 3, sx: snowman_size, sy: snowman_size, sz: snowman_size}));
world.add(new TrackSnowman(snow_track, {u: 5/7, hatColor: "blue", bodyColor: "cyan", y: 3, sx: snowman_size, sy: snowman_size, sz: snowman_size}));
world.add(new TrackSnowman(snow_track, {u: 6/7, hatColor: "purple", bodyColor: "magenta", y: 3, sx: snowman_size, sy: snowman_size, sz: snowman_size}));

/**
 * Add the house.
 */
let house_size = 6;
let house = new GrHouse({x: -30, y: 0, z: -50, sx: house_size, sy: house_size, sz: house_size});
roty(house, degrees(45));
world.add(house);

/**
 * Add the igloo.
 */
let igl_size = 18;
const igloo = new GrIgloo({x: 34, y: 0, z: 32, sx: igl_size, sy: igl_size, sz: 3 * igl_size});
rotx(igloo, degrees(90));
rotz(igloo, degrees(135));
world.add(igloo);

/**
 * Add some trees.
 */
let pts = 4;
world.add(new GrPineTree({x: -50, z: -50, sx: pts, sy: pts, sz: pts}));
world.add(new GrPineTree({x: -50, z: 0, sx: pts, sy: pts, sz: pts})); 
world.add(new GrPineTree({x: 0, z: -50, sx: pts, sy: pts, sz: pts})); 
world.add(new GrPineTree({x: -12, z: -10, sx: pts, sy: pts, sz: pts}));


/**
 * Add the Roundabout.
 */
let cr_size = 2.5;
world.add(new GrColoredRoundabout({x: -35, y: 0, z: -10, sx: cr_size, sy : cr_size, sz: cr_size}));

/**
 * Add the swing.
 */
let sw_size = 3.5;
let simpleswing = new GrSwing({x: -15, y: 0, z: -35, sx: sw_size, sy: sw_size, sz: sw_size});
roty(simpleswing, degrees(45));
world.add(simpleswing);

/**
 * Add the table and chair.
 */
const table = new GrTable({ size: 4, x: -12, y: 0, z: 12});
roty(table, degrees(135));
world.add(table);

const chair = new GrChair({ size: 4, x: -25, y: 2.3, z: 25});
roty(chair, degrees(-45));
world.add(chair);

/**
 * Add the laptop.
 */
const laptop = new GrLaptop({size: 3, x: -12, y: 8.5, z: 12});
roty(laptop, degrees(135));
world.add(laptop);

/**
 * Add the house that is under construction.
 */
world.add(new GrConstruction({x: 32, y: 0, z: -18, size: 3, height: 3.4}));

/**
 * Add two people to the world, and add the ball they use to play
 * a game of catch.
 */
world.add(new GrPerson({x: -42, z: 25, size: 10, ry: 45}));
world.add(new GrPerson({x: -10, z: 40, size: 10, ry: -40}));
world.add(new GrSphere({x: -45, z: 33, y_value: 15, size: 2, y: 5}));

/**
 * Highlight the new objects and the objects from previous workbooks.
 */
highlight("IncompleteHouse"); // Object 1 (created here).
highlight("Table"); highlight("Chair"); // Object 2 (created here).
highlight("House"); // Object 3 (created elsewhere).
highlight("Igloo"); // Object 4 (created elsewhere).
highlight("Bulldozer-blue"); // Object 5 (created elsewhere).
highlight("Laptop"); // Object 6 (created elsewhere).
highlight("CherryPicker"); // Object 7 (created elsewhere).

///////////////////////////////////////////////////////////////
// build and run the UI
// only after all the objects exist can we build the UI
// @ts-ignore       // we're sticking a new thing into the world
world.ui = new WorldUI(world);
// now make it go!
world.go();

function degrees(deg) {
    return (deg * Math.PI) / 180;
}

// Rotate z-axis by rz degrees.
function rotx(grobj, rx) {
    grobj.objects.forEach(element => {
        element.rotation.x = rx;
    });
    return grobj;
}

function roty(grobj, ry) {
    grobj.objects.forEach(element => {
        element.rotation.y = ry;
    });
    return grobj;
}

function rotz(grobj, rz) {
    grobj.objects.forEach(element => {
        element.rotation.z = rz;
    });
    return grobj;
}

function highlight(obName) {
    const toHighlight = world.objects.find(ob => ob.name === obName);
    if (toHighlight) {
        toHighlight.highlighted = true;
    } else {
        throw `no object named ${obName} for highlighting!`;
    }
}
