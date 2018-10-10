let Axises = {
    x: null,
    y: null,
    z: null,
    create: function (scene) {

        // X Y Z Line
        //creates lines
        var lines = BABYLON.MeshBuilder.CreateLines("xlines", {
            points: [
                new BABYLON.Vector3(0, 0, 0),
                new BABYLON.Vector3(20, 0, 0)
            ]
        }, scene);
        lines.color = new BABYLON.Color3(1, 0, 0);
        this.x = lines;

        var ylines = BABYLON.MeshBuilder.CreateLines("ylines", {
            points: [
                new BABYLON.Vector3(0, 0, 0),
                new BABYLON.Vector3(0, 20, 0)
            ]
        }, scene);
        ylines.color = new BABYLON.Color3(0, 0, 1);
        this.y = ylines;

        var zlines = BABYLON.MeshBuilder.CreateLines("zlines", {
            points: [
                new BABYLON.Vector3(0, 0, 0),
                new BABYLON.Vector3(0, 0, 20)
            ]
        }, scene);
        zlines.color = new BABYLON.Color3(0, 1, 0);
        this.z = zlines;
    }
}