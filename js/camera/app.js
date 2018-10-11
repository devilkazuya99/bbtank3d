console.log('hello world 2!');

const GROUND_WIDTH = 200; // x
const GROUND_DEPT = 200; // z

const CAMERA_START_X = 5;
const CAMERA_START_Y = 2;
const CAMERA_START_Z = 5;

let box_x = 1;

////
// Converts from degrees to radians.
Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
};
////

window.addEventListener('DOMContentLoaded', function() {
    // All the following code is entered here.
    // get the canvas DOM element
    var canvas = document.getElementById('renderCanvas');

    // load the 3D engine
    var engine = new BABYLON.Engine(canvas, true);

    // createScene function that creates and return the scene
    var createScene = function() {
        // create a basic BJS Scene object
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        scene.ambientColor = new BABYLON.Color3(0.5, 0.8, 0.5);

        // gravity
        scene.gravity = new BABYLON.Vector3(0, -9.81, 0);

        // light1
        var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
        light.position = new BABYLON.Vector3(20, 40, 20);
        light.intensity = 0.5;
        
        // create a basic light, aiming 0,1,0 - meaning, to the sky
        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
        //var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

        // Need a free camera for collisions
        // var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(CAMERA_START_X, CAMERA_START_Y, CAMERA_START_Z), scene);
        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 1, new BABYLON.Vector3(0, 1, 1.2), scene);
        camera.setPosition(new BABYLON.Vector3(0, 1, 10));
        camera.radius = Math.radians(100);
        camera.attachControl(canvas, false);

        // create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation 
        // var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
        var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.5 }, scene);

        var box = BABYLON.MeshBuilder.CreateBox("box", { updatable: true }, scene);

        // Material
        var material = new BABYLON.StandardMaterial("material01", scene);
        sphere.material = material;
        material.diffuseColor = new BABYLON.Color3(1, 0, 0);

        // move the sphere upward 1/2 of its height
        sphere.position.y = 1;
        box.position.x = -10;
        box.position.y = 1;

        // Shadows
        var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        shadowGenerator.addShadowCaster(sphere);
        shadowGenerator.useExponentialShadowMap = true;

        camera.ellipsoid = new BABYLON.Vector3(4, 2, 4);

        // Enable Collisions
        scene.collisionsEnabled = true;
        camera.checkCollisions = true;
        box.checkCollisions = true;
        sphere.checkCollisions = true;
        
        // create a built-in "ground" shape;
        // var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);
        // var myGround = BABYLON.MeshBuilder.CreateGround("myGround", { width: 6, height: 6, subdivsions: 4 }, scene);

        // Ground
        var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: GROUND_WIDTH, height: GROUND_DEPT, subdivsions: 4 }, scene);
        //Creation of a repeated textured material
        var materialPlane = new BABYLON.StandardMaterial("texturePlane", scene);
        materialPlane.diffuseTexture = new BABYLON.Texture("textures/grass.jpg", scene);
        materialPlane.diffuseTexture.uScale = 50.0; //Repeat 5 times on the Vertical Axes
        materialPlane.diffuseTexture.vScale = 50.0; //Repeat 5 times on the Horizontal Axes
        materialPlane.backFaceCulling = false; //Always show the front and the back of an element

        ground.material = materialPlane;
        ground.receiveShadows = true;

        // Skybox
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
        skyboxMaterial.disableLighting = true;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

        // var plane = BABYLON.MeshBuilder.CreatePlane("plane", {width: 5, height: 2}, scene); // default plane

        // Keyboard events
        var inputMap = {};
        scene.actionManager = new BABYLON.ActionManager(scene);
        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function(evt) {
            inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));
        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function(evt) {
            inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));

        function calculateXY() {
            // console.log('rotation.y = ' + sphere.rotation.y);
            // console.log('sin(y) = ' + Math.sin(sphere.rotation.y));
            // console.log('cos(y) = ' + Math.cos(sphere.rotation.y));
            console.log('camera.alpha = ' + camera.alpha);
            camera.beta = Math.radians(100);
            camera.radius = 1;  // force radius to fix after collide.
            return {
                a: Math.cos(camera.alpha),
                b: Math.sin(camera.alpha)
            };
        }

        // Game/Render loop
        scene.onBeforeRenderObservable.add(() => {
            if (inputMap["w"] || inputMap["ArrowUp"]) {
                let pt = calculateXY();
                console.log(pt);
                const moves = 0.1;
                camera.target.z -= (pt.b * moves);
                camera.target.x -= (pt.a * moves);
            }
            if (inputMap["a"] || inputMap["ArrowLeft"]) {
                camera.radius = 1;  // force radius to fix after collide.
                camera.alpha += 0.01;
            }
            if (inputMap["s"] || inputMap["ArrowDown"]) {
                let pt = calculateXY();
                console.log(pt);
                const moves = 0.1;
                camera.target.z += (pt.b * moves);
                camera.target.x += (pt.a * moves);
            }
            if (inputMap["d"] || inputMap["ArrowRight"]) {
                camera.radius = 1;  // force radius to fix after collide.
                camera.alpha -= 0.01;
            }
        });

        scene.activeCamera.panningSensibility = 0;
        
        // return the created scene
        return scene;
    }

    // call the createScene function
    var scene = createScene();

    // run the render loop
    engine.runRenderLoop(function() {
        scene.render();
    });

    // the canvas/window resize event handler
    window.addEventListener('resize', function() {
        engine.resize();
    });

});