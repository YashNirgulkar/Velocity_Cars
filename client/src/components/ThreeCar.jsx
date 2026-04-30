import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeCar({ accent = "#d63f31" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(4, 2.2, 6);
    camera.lookAt(0, 0.25, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 6, 6);
    scene.add(key);
    scene.add(new THREE.AmbientLight(0xd6a64f, 0.75));

    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: accent, metalness: 0.78, roughness: 0.22 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x111820, metalness: 0.3, roughness: 0.08, transparent: true, opacity: 0.72 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x050505, metalness: 0.6, roughness: 0.3 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd6a64f, metalness: 0.9, roughness: 0.2 });

    const body = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.75, 1.75), bodyMat);
    body.position.y = 0.25;
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.65, 1.35), glassMat);
    cabin.position.set(-0.25, 0.9, 0);
    const hood = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.28, 1.55), bodyMat);
    hood.position.set(1.25, 0.72, 0);
    hood.rotation.z = -0.08;

    [body, cabin, hood].forEach((mesh) => group.add(mesh));
    [-1.55, 1.55].forEach((x) => {
      [-0.95, 0.95].forEach((z) => {
        const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.43, 0.36, 32), blackMat);
        tire.rotation.x = Math.PI / 2;
        tire.position.set(x, -0.15, z);
        const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.39, 32), goldMat);
        rim.rotation.x = Math.PI / 2;
        rim.position.copy(tire.position);
        group.add(tire, rim);
      });
    });

    const ground = new THREE.Mesh(
      new THREE.RingGeometry(2.8, 3.1, 96),
      new THREE.MeshBasicMaterial({ color: 0xd6a64f, transparent: true, opacity: 0.42, side: THREE.DoubleSide })
    );
    ground.rotation.x = Math.PI / 2;
    ground.position.y = -0.6;
    group.add(ground);

    scene.add(group);

    let raf;
    const animate = () => {
      group.rotation.y += 0.008;
      group.rotation.x = Math.sin(Date.now() * 0.001) * 0.045;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      camera.lookAt(0, 0.25, 0);
      renderer.setSize(clientWidth, clientHeight);
    };
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [accent]);

  return <div ref={mountRef} className="h-[420px] w-full md:h-[580px]" />;
}
