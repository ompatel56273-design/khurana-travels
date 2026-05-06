'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Bus({ position = [0, 0, 0] }) {
  const busRef = useRef();
  
  useFrame((state) => {
    if (busRef.current) {
      busRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 3;
      busRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.3) * 2;
      busRef.current.rotation.y = -Math.atan2(
        Math.cos(state.clock.elapsedTime * 0.3) * 0.3 * 3,
        -Math.sin(state.clock.elapsedTime * 0.3) * 0.3 * 2
      );
    }
  });

  return (
    <group ref={busRef} position={position}>
      {/* Bus Body */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[3.2, 1.2, 1.2]} />
        <meshStandardMaterial color="#6c63ff" metalness={0.6} roughness={0.2} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.3, 0]}>
        <boxGeometry args={[3, 0.15, 1.1]} />
        <meshStandardMaterial color="#5a52e0" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Windshield */}
      <mesh position={[1.55, 0.75, 0]}>
        <boxGeometry args={[0.15, 0.8, 1.0]} />
        <meshStandardMaterial color="#a0d4ff" metalness={0.9} roughness={0.1} transparent opacity={0.6} />
      </mesh>
      {/* Windows */}
      {[-0.8, -0.1, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 0.8, 0.61]}>
          <boxGeometry args={[0.5, 0.4, 0.02]} />
          <meshStandardMaterial color="#a0d4ff" metalness={0.9} roughness={0.1} transparent opacity={0.5} />
        </mesh>
      ))}
      {[-0.8, -0.1, 0.6].map((x, i) => (
        <mesh key={`b${i}`} position={[x, 0.8, -0.61]}>
          <boxGeometry args={[0.5, 0.4, 0.02]} />
          <meshStandardMaterial color="#a0d4ff" metalness={0.9} roughness={0.1} transparent opacity={0.5} />
        </mesh>
      ))}
      {/* Wheels */}
      {[[-1.0, 0, 0.65], [-1.0, 0, -0.65], [1.0, 0, 0.65], [1.0, 0, -0.65]].map((pos, i) => (
        <mesh key={`w${i}`} position={pos} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.12, 16]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.8} />
        </mesh>
      ))}
      {/* Headlights */}
      <mesh position={[1.61, 0.5, 0.4]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={2} />
      </mesh>
      <mesh position={[1.61, 0.5, -0.4]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={2} />
      </mesh>
      {/* Tail lights */}
      <mesh position={[-1.61, 0.5, 0.4]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#ff4757" emissive="#ff4757" emissiveIntensity={2} />
      </mesh>
      <mesh position={[-1.61, 0.5, -0.4]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#ff4757" emissive="#ff4757" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function Road() {
  const roadRef = useRef();
  
  const roadTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 512, 512);
    
    // Center line dashes
    ctx.strokeStyle = '#f5a623';
    ctx.lineWidth = 4;
    ctx.setLineDash([30, 20]);
    ctx.beginPath();
    ctx.moveTo(256, 0);
    ctx.lineTo(256, 512);
    ctx.stroke();
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 8);
    return texture;
  }, []);

  useFrame((state) => {
    if (roadTexture) {
      roadTexture.offset.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
      <planeGeometry args={[20, 40]} />
      <meshStandardMaterial map={roadTexture} transparent opacity={0.5} />
    </mesh>
  );
}

function MapMarkers() {
  const markers = [
    { pos: [-4, 0.5, -3], color: '#ff4757', label: 'Delhi' },
    { pos: [3, 0.5, 2], color: '#00c9a7', label: 'Jaipur' },
    { pos: [5, 0.5, -4], color: '#f5a623', label: 'Agra' },
  ];

  return (
    <>
      {markers.map((marker, i) => (
        <Float key={i} speed={2} rotationIntensity={0} floatIntensity={0.5}>
          <group position={marker.pos}>
            <mesh>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color={marker.color} emissive={marker.color} emissiveIntensity={1} />
            </mesh>
            <pointLight color={marker.color} intensity={0.5} distance={3} />
          </group>
        </Float>
      ))}
    </>
  );
}

function ParticleField() {
  const particles = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  const pointsRef = useRef();

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#6c63ff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function GlobeBackground() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 1, -5]} scale={3}>
      <icosahedronGeometry args={[1, 1]} />
      <MeshDistortMaterial
        color="#6c63ff"
        wireframe
        transparent
        opacity={0.08}
        distort={0.2}
        speed={1.5}
      />
    </mesh>
  );
}

const BusScene3D = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 4, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-3, 3, -3]} intensity={0.5} color="#6c63ff" />
        <pointLight position={[3, 2, 3]} intensity={0.3} color="#f5a623" />
        
        <Bus />
        <Road />
        <MapMarkers />
        <ParticleField />
        <GlobeBackground />
        
        <Environment preset="night" />
      </Canvas>
    </div>
  );
};

export default BusScene3D;
