// Simplified Hyperspeed effect implementation
import * as THREE from 'three';

export class HyperspeedEffect {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      speed: 2,
      roadColor: 0x080808,
      carColors: [0xd856bf, 0x6750a2, 0xc247ac, 0x03b3c3, 0x0e5ea5, 0x324555],
      ...options
    };
    
    this.init();
  }
  
  init() {
    // Set up Three.js scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    this.camera.position.z = 5;
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);
    
    // Create road
    this.createRoad();
    
    // Create car lights
    this.createCarLights();
    
    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
    
    // Start animation
    this.animate();
  }
  
  createRoad() {
    // Create a simple road plane
    const roadGeometry = new THREE.PlaneGeometry(10, 100);
    const roadMaterial = new THREE.MeshBasicMaterial({ 
      color: this.options.roadColor,
      side: THREE.DoubleSide
    });
    this.road = new THREE.Mesh(roadGeometry, roadMaterial);
    this.road.rotation.x = Math.PI / 2;
    this.road.position.y = -2;
    this.scene.add(this.road);
  }
  
  createCarLights() {
    // Create car lights as simple spheres
    this.carLights = [];
    for (let i = 0; i < 50; i++) {
      const geometry = new THREE.SphereGeometry(0.1, 16, 16);
      const color = this.options.carColors[Math.floor(Math.random() * this.options.carColors.length)];
      const material = new THREE.MeshBasicMaterial({ color });
      const light = new THREE.Mesh(geometry, material);
      
      // Position lights randomly
      light.position.x = (Math.random() - 0.5) * 8;
      light.position.y = -1.9;
      light.position.z = (Math.random() - 0.5) * 100;
      
      this.scene.add(light);
      this.carLights.push({
        mesh: light,
        speed: 0.5 + Math.random() * 2
      });
    }
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    // Move car lights
    this.carLights.forEach(light => {
      light.mesh.position.z -= light.speed * this.options.speed;
      
      // Reset position when light goes off screen
      if (light.mesh.position.z < -50) {
        light.mesh.position.z = 50;
        light.mesh.position.x = (Math.random() - 0.5) * 8;
      }
    });
    
    // Rotate road slightly for effect
    this.road.rotation.z += 0.001 * this.options.speed;
    
    this.renderer.render(this.scene, this.camera);
  }
  
  onWindowResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }
  
  dispose() {
    // Clean up resources
    window.removeEventListener('resize', () => this.onWindowResize());
    
    if (this.renderer) {
      this.container.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }
    
    if (this.scene) {
      this.scene.clear();
    }
  }
}