var createScene = function () {

    // Create the scene space
    var scene = new BABYLON.Scene(engine);

    // Add a camera to the scene and attach it to the canvas
    var camera = new BABYLON.ArcRotateCamera("Camera", (3 * Math.PI / 2), (2*Math.PI / 5), 50, new BABYLON.Vector3(0,0,5), scene);
    camera.attachControl(canvas, true);

    // Add lights to the scene
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(10, 10, 0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 20, 20), scene);
    light2.intensity = 0.2;

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

    var tank2 = new Tank();
    tank2.create(scene);
    tank2.body.position.x = -5;
    tank2.body.position.z = 5;

    var tank3 = new Tank();
    tank3.create(scene);
    tank3.body.position.x = -10;
    tank3.body.position.z = 10;

    return scene;
};