/**
 * Usage：
 * let a = new Arena(); 
 * a.size = 300;
 * a.wallHeight = 10;
 * a.wallThickness = 3;
 * a.create();
 */
function Arena() {
    return {
        size: 500,
        ground: null,
        walls: null,
        wallHeight: 10,
        wallThickness: 3,
        create: function (scene) {
            // walls
            let wallHeight = this.wallHeight;
            let wallThickness = this.wallThickness;

            let wallShape = [
                new BABYLON.Vector3(0, 0, 0),
                new BABYLON.Vector3(0, wallHeight, 0),
                new BABYLON.Vector3(wallThickness, wallHeight, 0),
                new BABYLON.Vector3(wallThickness, 0, 0),
                new BABYLON.Vector3(0, 0, 0)
            ];
            wallShape.push(wallShape[0]);

            let r = this.size / 2;
            var wallPath = [
                new BABYLON.Vector3(-r, 0, -r),
                new BABYLON.Vector3(-r, 0, r),
                new BABYLON.Vector3(r, 0, r),
                new BABYLON.Vector3(r, 0, -r),
                new BABYLON.Vector3(-r + wallThickness, 0, -r)

            ];

            var walls = BABYLON.MeshBuilder.ExtrudeShape("star", {
                shape: wallShape,
                path: wallPath,
                sideOrientation: BABYLON.Mesh.DOUBLESIDE,
                updatable: true
            }, scene);
            this.walls = walls;

            var material = new BABYLON.StandardMaterial("brickMat", scene);
            material.diffuseTexture = new BABYLON.Texture("img/metal.jpg", scene);
            material.diffuseTexture.uScale = 3;
            material.diffuseTexture.vScale = 50;
            // material.wireframe = true;
            walls.material = material;

            let s = this.size;
            let ground = BABYLON.MeshBuilder.CreateGround("myGround", {
                width: s,
                height: s,
                subdivsions: 500
            }, scene);
            this.ground = ground;

            var sandMaterial = new BABYLON.StandardMaterial("sandMat", scene);
            sandMaterial.diffuseTexture = new BABYLON.Texture("img/sand.jpg", scene);
            sandMaterial.diffuseTexture.uScale = 20;
            sandMaterial.diffuseTexture.vScale = 20;

            ground.material = sandMaterial;

            return this;
        }
    };
}