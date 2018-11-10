/* TODO
    - Add sprite on top of the tank to display HP
*/
function Tank() {
    return {
        hp: 100,
        cap: null,
        body: null,
        bullet: null,
        healthBar: null,
        create: function (scene) {
            // Add and manipulate meshes in the scene
            var base_box_height = 0.65;
            var base_box_width = 2.00;
            var base_box_depth = 3.00;
            var top_box_height = 0.65;
            var top_box_width = 1.50;
            var top_box_depth = 2.00;

            var baseBox = BABYLON.MeshBuilder.CreateBox("baseBox", {
                height: base_box_height,
                width: base_box_width,
                depth: base_box_depth
            }, scene);
            baseBox.position.y = base_box_height / 2;
            baseBox.checkCollisions = true;
            this.body = baseBox;

            var topBox = BABYLON.MeshBuilder.CreateBox("topBox", {
                height: top_box_height,
                width: top_box_width,
                depth: top_box_depth
            }, scene);
            topBox.parent = baseBox;
            topBox.position.y = base_box_height;
            topBox.position.z = 0.20;
            topBox.checkCollisions = true;
            topBox.isPickable = true;
            this.cap = topBox;

            var cannon = BABYLON.MeshBuilder.CreateTube("cannon", {
                path: [
                    new BABYLON.Vector3(0, 0, 0),
                    new BABYLON.Vector3(0, 0, -2.0)
                ],
                radius: 0.15,
                sideOrientation: BABYLON.Mesh.DOUBLESIDE,
                updatable: true
            }, scene);
            cannon.parent = topBox;

            // Healthbar
            this.healthBar = new BABYLON.MeshBuilder.CreatePlane("healthbar", {height: 0.2, width: 2.0, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
            this.healthBar.parent = baseBox;
            this.healthBar.position.y = 1.2;
            this.healthBar.position.z = 0.73;
            // this.healthBar.rotation.y = Math.PI / 4;
            var healthBarMaterial = new BABYLON.StandardMaterial("healthBarMaterial", scene);
            healthBarMaterial.emissiveColor = new BABYLON.Color3(0, 1, 0);
            this.healthBar.material = healthBarMaterial;
            // on hit modify health and update healthbar

            var metalMat = new BABYLON.StandardMaterial("metalMat", scene);
            metalMat.diffuseTexture = new BABYLON.Texture("/img/galva.jpg", scene);
            topBox.material = metalMat;
            var metalMat2 = new BABYLON.StandardMaterial("metalMat", scene);
            metalMat2.diffuseTexture = new BABYLON.Texture("/img/metal2.jpg", scene);
            baseBox.material = metalMat2;

            var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
            myMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
            myMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);

            cannon.material = myMaterial;

            // Bullet should not sit in tank.
            var bullet = BABYLON.MeshBuilder.CreateSphere("bullet", {diameter: 0.28}, scene);
            bullet.parent = topBox;
            bullet.position.z = -2.5;
            bullet.onCollide = function(target, b) {
                console.log(target.name);
                bullet.position.x = 0;
                bullet.position.y = 0;
                bullet.position.z = -2.5;
            };
            this.bullet = bullet;

            var wheelZ = [-1.15, -0.5, 0.5, 1.15];
            for (var i = 0; i < 4; i++) {
                var wheel = BABYLON.MeshBuilder.CreateTube("wheel" + (i + 1), {
                    path: [
                        new BABYLON.Vector3(-1.1, 0, 0),
                        new BABYLON.Vector3(1.1, 0, 0)
                    ],
                    radius: 0.32,
                    cap: 3,
                    sideOrientation: BABYLON.Mesh.DOUBLESIDE,
                    updatable: true
                }, scene);
                wheel.material = myMaterial;
                wheel.parent = baseBox;
                wheel.position.z = wheelZ[i];
            }

            return this;
        }
    };
}