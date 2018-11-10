var ws = new WebSocket('ws://localhost:9999/server');
ws.onopen = function (event) { console.log('Connected to Server.'); }
var playerTank = null;
var createScene = function () {

    var tanks = {};

    // Create the scene space
    var scene = new BABYLON.Scene(engine);
    //    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.workerCollisions = true;

    //Set gravity for the scene (G force like, on Y-axis)
    scene.gravity = new BABYLON.Vector3(0, -0.9, 0);

    // Add a camera to the scene and attach it to the canvas
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.radians(90), Math.radians(90), 1, new BABYLON.Vector3(0, 1, 0.5), scene);

    // Positions the camera overwriting alpha, beta, radius
    // camera.setPosition(new BABYLON.Vector3(Math.PI, 2, 0));
    // camera.setPosition(new BABYLON.Vector3(0, 1, 0.5));

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
    tank1.cap.checkCollisions = true;

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

    // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var inputBox = new BABYLON.GUI.InputText();
    inputBox.width = 0.2;
    inputBox.maxWidth = 0.2;
    inputBox.height = "40px";
    inputBox.text = "[enter name here]";
    inputBox.color = "grey";
    inputBox.background = "white";
    inputBox.top = "-30px";
    inputBox.onFocusObservable.add(function (event, b, c) {
        if ("[enter name here]" == inputBox.text) {
            inputBox.text = "";
        }
    });
    advancedTexture.addControl(inputBox);

    // TODO - ERROR Message

    // END - GUI

    var button1 = BABYLON.GUI.Button.CreateSimpleButton("playButton", "Play");
    button1.width = "150px"
    button1.height = "40px";
    button1.color = "white";
    button1.cornerRadius = 20;
    button1.background = "green";
    button1.top = "30px";
    button1.onPointerUpObservable.add(function () {
        alert("you did it! " + inputBox.text);
        // register a new tank to the server.
        var data = {
            id: 'tank_' + new Date().getTime(),
            newTank: true,
            player: inputBox.text,
            position: {
                x: 20,
                z: 20
            }
        };
        ws.send(JSON.stringify(data));
        // hide the text box and 
        button1.isVisible = false;
        inputBox.isVisible = false;
    });

    advancedTexture.addControl(button1);

    // make healthbar glow
    var gl = new BABYLON.GlowLayer("glow", scene);
    var hBars = scene.getMeshByName("healthbar").getChildren();
    for (var i in hBars.length) {
        gl.addIncludedOnlyMesh(hBars[i]);
    }

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
        if (!playerTank) {
            return { a: 0, b: 0 };
        }
        let r = playerTank.body.rotation.y;
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

    var forwards = new BABYLON.Vector3(0, 0, -0.5);
    forwards.negate();

    const turnSpeed = 0.005;
    const moveSpeed = 0.05;
    // Game/Render loop
    scene.onBeforeRenderObservable.add(() => {

        ws.onmessage = function (event) {
            // console.log('Data: ' + event.data);
            // render data from server

            // TODO initialize tank when new user connected

            let data = JSON.parse(event.data);
            // console.log(data); 
            if (data.z && data.x) {
                var forwards = new BABYLON.Vector3(data.x, 0, data.z);
                forwards.negate();
                tanks[data.tank].body.moveWithCollisions(forwards);
            }

            if (data.t) {    // tank turning
                tanks[data.tank].body.rotation.y += data.t;
            }
            if (data.r) {    // turret rotation
                tanks[data.tank].cap.rotation.y += data.r;
            }
            // create new tank
            if (data.newTank) {
                console.log("Creating new tank: " + data.player);
                var newTank = new Tank(data.id);
                newTank.create(scene);
                newTank.player = inputBox.text;
                newTank.body.position.x = data.position.x;
                newTank.body.position.z = data.position.z;
                // test rotation
                newTank.body.rotation.y = (Math.PI / 4);

                newTank.body.checkCollisions = true;
                // newTank.rotation = BABYLON.Vector3.RotationFromAxis(0, 0, 0);
                tanks[newTank.id] = newTank;
                if(!playerTank && !button1.isVisible && !inputBox.isVisible) {
                    console.log("playerTank = " + playerTank + ". Setting playerTank = " + newTank.id);
                    playerTank = newTank;
                    // attach camera
                    // camera.setPosition(new BABYLON.Vector3(0, 1, 0.5));
                    camera.parent = newTank.cap;
                }
            }
        }

        // Capture keyboard input
        if (playerTank) {
            let data = { tank: playerTank.id };
            if (inputMap["w"] || inputMap["ArrowUp"]) {
                let pt = calculateXY();
                // let data = { tank: playerTank.id, name: 'tank1' };
                // console.log(pt);
                data.z = -(pt.a * moveSpeed);
                data.x = -(pt.b * moveSpeed);
                ws.send(JSON.stringify(data));
            }
            if (inputMap["a"] || inputMap["ArrowLeft"]) {
                // console.log(tank1.body.rotation);
                data.t = -turnSpeed;
                ws.send(JSON.stringify(data));
            }
            if (inputMap["s"] || inputMap["ArrowDown"]) {
                let pt = calculateXY();
                // let data = { name: 'tank1' };
                // console.log(pt);
                data.z = (pt.a * moveSpeed);
                data.x = (pt.b * moveSpeed);
                ws.send(JSON.stringify(data));
            }
            if (inputMap["d"] || inputMap["ArrowRight"]) {
                // console.log(tank1.body.rotation);
                data.t = turnSpeed;
                ws.send(JSON.stringify(data));
            }
            if (inputMap["o"]) {
                // console.log(tank1.body.rotation);
                data.r = -turnSpeed;
                ws.send(JSON.stringify(data));
            }
            if (inputMap["p"]) {
                // console.log(tank1.body.rotation);
                data.r = turnSpeed;
                ws.send(JSON.stringify(data));
            }
            if (inputMap[" "]) {
                // tank1.bullet.position.z -= 0.04;
                tank1.bullet.moveWithCollisions(forwards);
            }
        }

    });

    scene.activeCamera.panningSensibility = 0;

    return scene;
};