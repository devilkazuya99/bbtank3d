var createScene = function () {

    // Create the scene space
    var scene = new BABYLON.Scene(engine);
    //    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.workerCollisions = true;

    //Set gravity for the scene (G force like, on Y-axis)
    scene.gravity = new BABYLON.Vector3(0, -0.9, 0);

    // Add a camera to the scene and attach it to the canvas
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.radians(90), Math.radians(90), 1, new BABYLON.Vector3(0, 1, 0.5), scene);

    // Add lights to the scene
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(10, 10, 0), scene);
    light1.intensity = 0.2;
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 20, 20), scene);
    // light2.intensity = 0.2;

    Axises.create(scene);

    // create arena
    var arena = new Arena();
    arena.size = 250;
    arena.create(scene);

    // add tanks
    // create arena
    var tank1 = new Tank();
    tank1.create(scene);
    tank1.body.position.x = 0;
    tank1.body.position.z = 0;
    camera.parent = tank1.cap;

    var tank2 = new Tank();
    tank2.create(scene);
    tank2.body.position.x = -5;
    tank2.body.position.z = 5;
    tank2.body.checkCollisions = true;

    var tank3 = new Tank();
    tank3.create(scene);
    tank3.body.position.x = -10;
    tank3.body.position.z = 10;
    tank3.body.checkCollisions = true;

    // Enable Collisions
    scene.collisionsEnabled = true;

    // Skybox
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;
    skyboxMaterial.disableLighting = true;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;



    // Keyboard events
    var inputMap = {};
    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));

    function calculateXY() {
        let r = tank1.body.rotation.y;
        // console.log('rotation.y = ' + sphere.rotation.y);
        // console.log('sin(y) = ' + Math.sin(sphere.rotation.y));
        // console.log('cos(y) = ' + Math.cos(sphere.rotation.y));
        // console.log('tank1.body.rotation.y = ' + tank1.body.rotation.y);
        // camera.beta = Math.radians(100);
        // camera.radius = 1; // force radius to fix after collide.
        return {
            a: Math.cos(r),
            b: Math.sin(r)
        };
    }

    const turnSpeed = 0.005;
    const moveSpeed = 0.05;
    // Game/Render loop
    scene.onBeforeRenderObservable.add(() => {
        if (inputMap["w"] || inputMap["ArrowUp"]) {
            let pt = calculateXY();
            if (tank1.body.intersectsMesh(tank2.body, true) ||
                tank1.body.intersectsMesh(tank3.body, true)) {
                // console.log("Outch~~!!!");
                tank1.body.position.z += (pt.a * moveSpeed * 7);
                tank1.body.position.x += (pt.b * moveSpeed * 7);
            } else {
                // console.log(pt);
                tank1.body.position.z -= (pt.a * moveSpeed);
                tank1.body.position.x -= (pt.b * moveSpeed);
            }
        }
        if (inputMap["a"] || inputMap["ArrowLeft"]) {
            // console.log(tank1.body.rotation);
            tank1.body.rotation.y -= turnSpeed;
        }
        if (inputMap["s"] || inputMap["ArrowDown"]) {
            let pt = calculateXY();
            if (tank1.body.intersectsMesh(tank2.body, true) ||
                tank1.body.intersectsMesh(tank3.body, true)) {
                // console.log("Outch~~!!!");
                tank1.body.position.z -= (pt.a * moveSpeed * 7);
                tank1.body.position.x -= (pt.b * moveSpeed * 7);
            } else {
                // console.log(pt);
                tank1.body.position.z += (pt.a * moveSpeed);
                tank1.body.position.x += (pt.b * moveSpeed);
            }
        }
        if (inputMap["d"] || inputMap["ArrowRight"]) {
            // console.log(tank1.body.rotation);
            tank1.body.rotation.y += turnSpeed;
        }
        if (inputMap["o"]) {
            // console.log(tank1.body.rotation);
            tank1.cap.rotation.y -= turnSpeed;
        }
        if (inputMap["p"]) {
            // console.log(tank1.body.rotation);
            tank1.cap.rotation.y += turnSpeed;
        }
    });

    scene.activeCamera.panningSensibility = 0;

    return scene;
};