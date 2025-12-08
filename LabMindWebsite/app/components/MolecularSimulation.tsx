'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Mesh, Vector3, Group } from 'three'
import * as THREE from 'three'

// Atom component - spheres of various sizes
function Atom({ 
  position, 
  radius, 
  color,
  vibrationIntensity = 0.02
}: { 
  position: Vector3
  radius: number
  color: string
  vibrationIntensity?: number
}) {
  const meshRef = useRef<Mesh>(null!)
  const originalPosition = useRef(position.clone())
  const phaseOffset = useMemo(() => Math.random() * Math.PI * 2, [])
  
  useFrame((state) => {
    if (meshRef.current) {
      // Brownian motion / thermal vibration
      const time = state.clock.elapsedTime
      meshRef.current.position.x = originalPosition.current.x + 
        Math.sin(time * 3 + phaseOffset) * vibrationIntensity +
        Math.sin(time * 7 + phaseOffset * 2) * vibrationIntensity * 0.5
      meshRef.current.position.y = originalPosition.current.y + 
        Math.cos(time * 2.5 + phaseOffset) * vibrationIntensity +
        Math.cos(time * 5 + phaseOffset * 3) * vibrationIntensity * 0.5
      meshRef.current.position.z = originalPosition.current.z + 
        Math.sin(time * 4 + phaseOffset * 1.5) * vibrationIntensity * 0.5
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial 
        color={color}
        metalness={0.3}
        roughness={0.4}
        envMapIntensity={0.5}
      />
    </mesh>
  )
}

// Bond component - cylinder connecting two atoms
function Bond({ 
  start, 
  end, 
  radius = 0.03 
}: { 
  start: Vector3
  end: Vector3
  radius?: number
}) {
  const meshRef = useRef<Mesh>(null!)
  
  const { position, quaternion, length } = useMemo(() => {
    const direction = new Vector3().subVectors(end, start)
    const length = direction.length()
    const position = new Vector3().addVectors(start, end).multiplyScalar(0.5)
    
    const quaternion = new THREE.Quaternion()
    const up = new Vector3(0, 1, 0)
    quaternion.setFromUnitVectors(up, direction.clone().normalize())
    
    return { position, quaternion, length }
  }, [start, end])

  return (
    <mesh ref={meshRef} position={position} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, 8]} />
      <meshStandardMaterial 
        color="#ffffff"
        metalness={0.2}
        roughness={0.6}
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}

// Molecule cluster component
function Molecule({ 
  position, 
  rotation,
  scale = 1,
  type = 'water'
}: { 
  position: [number, number, number]
  rotation: [number, number, number]
  scale?: number
  type?: 'water' | 'methane' | 'benzene' | 'dna' | 'protein'
}) {
  const groupRef = useRef<Group>(null!)
  const phaseOffset = useMemo(() => Math.random() * Math.PI * 2, [])
  const driftSpeed = useMemo(() => 0.1 + Math.random() * 0.2, [])
  const rotationSpeed = useMemo(() => ({
    x: (Math.random() - 0.5) * 0.3,
    y: (Math.random() - 0.5) * 0.3,
    z: (Math.random() - 0.5) * 0.2
  }), [])
  
  // Define molecule structures - all grayscale colors
  const structure = useMemo(() => {
    // Grayscale palette
    const grays = {
      white: '#ffffff',
      light: '#e0e0e0',
      mid: '#a0a0a0',
      dark: '#606060',
      darker: '#404040',
      charcoal: '#252525'
    }
    
    switch (type) {
      case 'water':
        return {
          atoms: [
            { pos: new Vector3(0, 0, 0), radius: 0.15, color: grays.mid }, // Oxygen
            { pos: new Vector3(-0.2, 0.15, 0), radius: 0.1, color: grays.white }, // Hydrogen
            { pos: new Vector3(0.2, 0.15, 0), radius: 0.1, color: grays.white }, // Hydrogen
          ],
          bonds: [[0, 1], [0, 2]]
        }
      case 'methane':
        return {
          atoms: [
            { pos: new Vector3(0, 0, 0), radius: 0.18, color: grays.dark }, // Carbon
            { pos: new Vector3(0.25, 0.25, 0.25), radius: 0.1, color: grays.light },
            { pos: new Vector3(-0.25, -0.25, 0.25), radius: 0.1, color: grays.white },
            { pos: new Vector3(-0.25, 0.25, -0.25), radius: 0.1, color: grays.light },
            { pos: new Vector3(0.25, -0.25, -0.25), radius: 0.1, color: grays.white },
          ],
          bonds: [[0, 1], [0, 2], [0, 3], [0, 4]]
        }
      case 'benzene':
        const benzeneAtoms = []
        const benzeneBonds: number[][] = []
        // Carbon ring
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2
          benzeneAtoms.push({
            pos: new Vector3(Math.cos(angle) * 0.3, Math.sin(angle) * 0.3, 0),
            radius: 0.12,
            color: i % 2 === 0 ? grays.dark : grays.darker
          })
          // Hydrogen attached to each carbon
          benzeneAtoms.push({
            pos: new Vector3(Math.cos(angle) * 0.5, Math.sin(angle) * 0.5, 0),
            radius: 0.08,
            color: grays.white
          })
          benzeneBonds.push([i * 2, i * 2 + 1]) // C-H bond
          benzeneBonds.push([i * 2, ((i + 1) % 6) * 2]) // C-C bond
        }
        return { atoms: benzeneAtoms, bonds: benzeneBonds }
      case 'dna':
        const dnaAtoms = []
        const dnaBonds: number[][] = []
        // Double helix structure
        for (let i = 0; i < 8; i++) {
          const t = i * 0.5
          const angle1 = t * 1.5
          const angle2 = angle1 + Math.PI
          // Strand 1 - lighter grays
          dnaAtoms.push({
            pos: new Vector3(Math.cos(angle1) * 0.25, t * 0.15 - 0.5, Math.sin(angle1) * 0.25),
            radius: 0.08,
            color: i % 2 === 0 ? grays.light : grays.white
          })
          // Strand 2 - darker grays
          dnaAtoms.push({
            pos: new Vector3(Math.cos(angle2) * 0.25, t * 0.15 - 0.5, Math.sin(angle2) * 0.25),
            radius: 0.08,
            color: i % 2 === 0 ? grays.mid : grays.dark
          })
          // Connect strands
          if (i % 2 === 0) {
            dnaBonds.push([i * 2, i * 2 + 1])
          }
          // Connect along strand
          if (i > 0) {
            dnaBonds.push([(i - 1) * 2, i * 2])
            dnaBonds.push([(i - 1) * 2 + 1, i * 2 + 1])
          }
        }
        return { atoms: dnaAtoms, bonds: dnaBonds }
      case 'protein':
        const proteinAtoms = []
        const proteinBonds: number[][] = []
        // Folded protein chain - gradient of grays
        const proteinColors = [grays.white, grays.light, grays.mid, grays.dark, grays.darker, grays.charcoal]
        for (let i = 0; i < 12; i++) {
          const t = i / 12
          const x = Math.sin(t * Math.PI * 4) * 0.3
          const y = (t - 0.5) * 0.8
          const z = Math.cos(t * Math.PI * 4) * 0.3
          proteinAtoms.push({
            pos: new Vector3(x, y, z),
            radius: 0.1 + Math.sin(i * 0.8) * 0.03,
            color: proteinColors[i % proteinColors.length]
          })
          if (i > 0) {
            proteinBonds.push([i - 1, i])
          }
        }
        return { atoms: proteinAtoms, bonds: proteinBonds }
      default:
        return { atoms: [], bonds: [] }
    }
  }, [type])

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime
      // Gentle drift
      groupRef.current.position.x = position[0] + Math.sin(time * driftSpeed + phaseOffset) * 0.3
      groupRef.current.position.y = position[1] + Math.cos(time * driftSpeed * 0.7 + phaseOffset) * 0.2
      groupRef.current.position.z = position[2] + Math.sin(time * driftSpeed * 0.5 + phaseOffset * 2) * 0.2
      // Slow rotation
      groupRef.current.rotation.x = rotation[0] + time * rotationSpeed.x
      groupRef.current.rotation.y = rotation[1] + time * rotationSpeed.y
      groupRef.current.rotation.z = rotation[2] + time * rotationSpeed.z
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {structure.atoms.map((atom, i) => (
        <Atom 
          key={`atom-${i}`}
          position={atom.pos}
          radius={atom.radius}
          color={atom.color}
          vibrationIntensity={0.015}
        />
      ))}
      {structure.bonds.map((bond, i) => (
        <Bond
          key={`bond-${i}`}
          start={structure.atoms[bond[0]].pos}
          end={structure.atoms[bond[1]].pos}
          radius={0.025}
        />
      ))}
    </group>
  )
}

// Floating particles for ambient effect
function Particles({ count = 100 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const particleData = useMemo(() => {
    const data = []
    for (let i = 0; i < count; i++) {
      data.push({
        position: new Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10
        ),
        speed: 0.2 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2
      })
    }
    return data
  }, [count])

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      const matrix = new THREE.Matrix4()
      
      particleData.forEach((particle, i) => {
        const x = particle.position.x + Math.sin(time * particle.speed + particle.phase) * 0.5
        const y = particle.position.y + Math.cos(time * particle.speed * 0.7 + particle.phase) * 0.3
        const z = particle.position.z + Math.sin(time * particle.speed * 0.5 + particle.phase * 2) * 0.2
        
        matrix.setPosition(x, y, z)
        meshRef.current.setMatrixAt(i, matrix)
      })
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
    </instancedMesh>
  )
}

// Camera animation
function CameraRig() {
  const { camera } = useThree()
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    camera.position.x = Math.sin(time * 0.1) * 0.5
    camera.position.y = Math.cos(time * 0.08) * 0.3
    camera.lookAt(0, 0, 0)
  })

  return null
}

export default function MolecularSimulation() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const molecules = useMemo(() => [
    // Foreground molecules
    { position: [2, 0.5, -1] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], scale: 1.2, type: 'protein' as const },
    { position: [-1.5, -0.5, -2] as [number, number, number], rotation: [0.5, 0.3, 0] as [number, number, number], scale: 1.5, type: 'dna' as const },
    { position: [1, 1.5, -2.5] as [number, number, number], rotation: [0.2, -0.4, 0.1] as [number, number, number], scale: 1.3, type: 'benzene' as const },
    
    // Mid-ground molecules
    { position: [-2.5, 1, -3] as [number, number, number], rotation: [0.3, 0.5, 0.2] as [number, number, number], scale: 1, type: 'methane' as const },
    { position: [3, -1, -3] as [number, number, number], rotation: [-0.2, 0.4, 0] as [number, number, number], scale: 1.1, type: 'water' as const },
    { position: [0, -1.5, -2] as [number, number, number], rotation: [0.1, -0.3, 0.2] as [number, number, number], scale: 0.9, type: 'protein' as const },
    
    // Background molecules
    { position: [-3, 2, -4] as [number, number, number], rotation: [0, 0.2, 0] as [number, number, number], scale: 0.8, type: 'dna' as const },
    { position: [4, 0, -5] as [number, number, number], rotation: [0.4, 0, 0.3] as [number, number, number], scale: 0.7, type: 'benzene' as const },
    { position: [-1, 2.5, -4] as [number, number, number], rotation: [-0.3, 0.2, 0.1] as [number, number, number], scale: 0.6, type: 'methane' as const },
    { position: [2.5, 2, -4.5] as [number, number, number], rotation: [0.2, 0.5, 0] as [number, number, number], scale: 0.65, type: 'water' as const },
    
    // Extra scattered molecules
    { position: [-4, -1.5, -3.5] as [number, number, number], rotation: [0, 0, 0.4] as [number, number, number], scale: 0.85, type: 'water' as const },
    { position: [0.5, -2.5, -3] as [number, number, number], rotation: [0.6, 0.2, 0] as [number, number, number], scale: 0.95, type: 'methane' as const },
  ], [])

  if (!mounted) {
    return (
      <div className="w-full h-full bg-black/50 animate-pulse rounded-lg" />
    )
  }

  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
      >
        {/* Lighting - all white/gray for monochrome look */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.9} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.4} color="#ffffff" />
        <pointLight position={[0, 5, 5]} intensity={0.6} color="#ffffff" />
        <pointLight position={[-5, -5, 3]} intensity={0.3} color="#cccccc" />
        
        {/* Fog for depth */}
        <fog attach="fog" args={['#000000', 5, 15]} />
        
        {/* Camera animation */}
        <CameraRig />
        
        {/* Molecules */}
        {molecules.map((mol, i) => (
          <Molecule
            key={i}
            position={mol.position}
            rotation={mol.rotation}
            scale={mol.scale}
            type={mol.type}
          />
        ))}
        
        {/* Ambient particles */}
        <Particles count={80} />
      </Canvas>
    </div>
  )
}

