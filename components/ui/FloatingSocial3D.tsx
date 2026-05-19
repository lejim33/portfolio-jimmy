"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useFBX, Stage } from "@react-three/drei";
import { useRef, Suspense, useEffect } from "react";
import * as THREE from "three";

function FBXModel({
  url,
  position,
  scale,
  floatOffset = 0,
}: {
  url: string;
  position: [number, number, number];
  scale: number;
  floatOffset?: number;
}) {
  const fbx = useFBX(url);
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    fbx.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          if (m instanceof THREE.MeshStandardMaterial || m instanceof THREE.MeshPhongMaterial) {
            m.needsUpdate = true;
          }
        });
      }
    });
  }, [fbx]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() + floatOffset;
    ref.current.position.y = position[1] + Math.sin(t * 0.85) * 0.18;
    ref.current.rotation.y += 0.008;
    ref.current.rotation.x = 0.4;
    ref.current.rotation.z = -0.3;
  });

  return (
    <primitive
      ref={ref}
      object={fbx}
      position={position}
      scale={scale}
    />
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1.8} />
      <directionalLight position={[5, 8, 5]} intensity={2.5} castShadow />
      <directionalLight position={[-4, -2, -3]} intensity={0.8} color="#a5b4fc" />
      <pointLight position={[0, 0, 4]} intensity={1.5} color="#818cf8" />

      <Suspense fallback={null}>
        <FBXModel
          url="/uploads/icone%203D/bulb/icon.fbx"
          position={[1.4, 1.4, 0]}
          scale={0.006}
          floatOffset={0}
        />
      </Suspense>
    </>
  );
}

export default function FloatingSocial3D() {
  return (
    <div
      className="pointer-events-none"
      style={{
        position: "absolute",
        top: "-100px",
        left: "-60px",
        right: "-140px",
        bottom: "-100px",
        zIndex: 20,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
