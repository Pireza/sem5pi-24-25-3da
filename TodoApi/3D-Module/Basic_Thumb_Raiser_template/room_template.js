import * as THREE from "three";
import BedTemplate from "./bed_template.js";
import Person from "./person_template.js";

export default class RoomTemplate {
    constructor(textureUrl) {
        this.wallThickness = .1;  // A espessura das paredes
        this.wallHeight = 5;      // A altura das paredes

        this.directionMap = new Map();
        this.directionMap.set('north', 0.0);
        this.directionMap.set('south', Math.PI);
        this.directionMap.set('west', Math.PI / 2);
        this.directionMap.set('east', 3 * Math.PI / 2);

        // Material que reage à luz
        if (textureUrl) {
            const textureLoader = new THREE.TextureLoader();
            this.material = new THREE.MeshStandardMaterial({
                map: textureLoader.load(textureUrl),
                side: THREE.DoubleSide,  // Certifique-se de que a textura será visível de ambos os lados
            });
        } else {
            // Caso não tenha textura, use uma cor básica
            this.material = new THREE.MeshStandardMaterial({ color: 0x888888 });
        }

        this.roomMesh = new THREE.Group();  // Um grupo para armazenar todas as paredes
    }

    generateRoom(width, depth, occupied, direction) {
        this.roomMesh = new THREE.Group();
        // Criar 4 paredes: frente, fundo, esquerda, direita

        // Parede da frente
        const frontWall = new THREE.Mesh(
            new THREE.BoxGeometry(width, this.wallHeight, this.wallThickness),
            this.material
        );
        frontWall.position.set(0, this.wallHeight / 2, -depth / 2);
        this.roomMesh.add(frontWall);

        // Parede do fundo
        const backWall = new THREE.Mesh(
            new THREE.BoxGeometry(width, this.wallHeight, this.wallThickness),
            this.material
        );
        backWall.position.set(0, this.wallHeight / 2, depth / 2);
        this.roomMesh.add(backWall);

        // Parede da esquerda
        const leftWall = new THREE.Mesh(
            new THREE.BoxGeometry(this.wallThickness, this.wallHeight, depth),
            this.material
        );
        leftWall.position.set(-width / 2, this.wallHeight / 2, 0);
        this.roomMesh.add(leftWall);

        // Parede da direita
        const rightWall = new THREE.Mesh(
            new THREE.BoxGeometry(this.wallThickness, this.wallHeight, depth),
            this.material
        );
        rightWall.position.set(width / 2, this.wallHeight / 2, 0);
        this.roomMesh.add(rightWall);

        this.bed = new BedTemplate({
            modelUrl: 'models/gltf/Table/surgery_table_lo_upload_test/surgery_table_lo_upload_test.glb'
        });
        this.roomMesh.add(this.bed.bed);

        if (this.directionMap.has(direction))
            this.orientation = this.directionMap.get(direction);

        this.bed.bed.rotation.y = this.orientation;

        if (occupied) {
            this.person = new Person({
                modelUrl: 'models/gltf/human/3d_scan_man_1.glb'
            });

            this.person.person.position.y = 1.5;
            this.person.person.rotation.z = this.orientation;
            this.roomMesh.add(this.person.person);
        }

        // Adicionar o foco de luz com maior alcance
        this.addSpotlight(width, depth);
    }

    addSpotlight(width, depth) {
        // Aumentar a distância da luz para cobrir toda a sala
        const spotlight = new THREE.SpotLight(0xffffff, 1, 100, Math.PI / 3, 0.5, 2);
        spotlight.position.set(0, this.wallHeight + 5, 0);  // Posicionar acima da sala
        spotlight.target.position.set(0, this.wallHeight / 2, 0);  // Focar no centro da sala
        spotlight.castShadow = true;

        // Ajuste o alcance da luz (distância) para garantir que cubra a sala inteira
        spotlight.distance = Math.max(width, depth) * 1.5;  // Cobrir toda a sala com folga

        // Ajuste o ângulo do cone de iluminação para um campo de visão mais amplo
        spotlight.angle = Math.PI / 3; // Aumente este valor para expandir o alcance da luz

        // Intensidade maior, se necessário
        spotlight.intensity = 21;

        // Adicionar a luz à cena (certifique-se de que você tenha acesso à cena do Three.js)
        // Certifique-se de que a luz esteja sendo adicionada diretamente à cena, não ao roomMesh
        this.roomMesh.add(spotlight);
    }

    setRoomPositions(x, y) {
        this.roomMesh.position.set(x, 0, y);
    }

    getRoom() {
        return this.roomMesh;
    }
}
