import { createCabinForest } from './CabinForest'
import { lazy, memo, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { ContactShadows, SoftShadows, useCursor, useProgress } from '@react-three/drei'
import { AgXToneMapping, Box3, CircleGeometry, Color, Mesh, MeshBasicMaterial, PCFSoftShadowMap, Raycaster, SRGBColorSpace, TextureLoader, Vector2, Vector3, PointLight } from 'three'
import type { Object3D } from 'three'
import type { Panel } from '../components/PortfolioDialog'
import { sceneConfig } from './sceneConfig'
import { usePrinterPaper } from './usePrinterPaper'
import StudioCamera from './StudioCamera'
import { applyCommunityCards } from './communityCards'
import { createForestFloorDetail } from './forestFloor'
import { applyLayout, buildPivots, isObjectHidden, savedLayout } from './layout/apply'
import { addFlameGlow, addGlowPools, arrangeWorld, createSignpost, hearthLightPosition, porchLightPosition } from './worldLayout'
import sceneBounds from './sceneBounds.json'
import { interactions, interactionList, interactionForObject } from './interactions'
import type { CameraCommand, InteractionId, NavigationRequest } from './interactions'
import type { RefObject } from 'react'
import { configureStudioLoader, GLTFLoader, studioModelUrl, compactStudioModelUrl, cabinWorldUrl, cabinTreesUrl } from './modelLoader'

interface StudioProps {
  onNavigate: (id: InteractionId) => void
  request: NavigationRequest
  command: CameraCommand
  onSettled: (serial: number) => void
  onReset: () => void
  touchEnabled: boolean
  ready: boolean
  onReady: () => void
  onUnavailable?: () => void
  onPrinted: () => void
  panel: Panel
  paperOut: boolean
  reducedMotion: boolean
  lightRendering?: boolean
}
type Hotspot = InteractionId | null
interface Tooltip { x: number; y: number; label: string }

declare global {
  interface Window {
    __studioScene?: { version: string; targets: string[] }
    __studioPick?: (x: number, y: number) => string[]
    __studioMetrics?: { calls: number; triangles: number; peakCalls: number; peakTriangles: number; textures: number; geometries: number; activeFrameMs: number; frames: number; paperProgress: number }
  }
}

// DEV-ONLY editor modules: not referenced (and therefore not bundled) in production builds.
const EditorScene = import.meta.env.DEV ? lazy(() => import('./editor/EditorScene')) : null
const EditorPanel = import.meta.env.DEV ? lazy(() => import('./editor/EditorPanel')) : null

function Loading() {
  const { progress, active } = useProgress()
  return active ? <div className="scene-loading" role="status">Opening the studio · {Math.round(progress)}%</div> : null
}

function Desk(props: StudioProps & { modelUrl: string; onTooltip: (tooltip: Tooltip | null) => void; probe: RefObject<((x: number, y: number) => boolean) | null> }) {
  const [{scene}, {scene:world}, {scene:trees}] = useLoader(GLTFLoader, [props.modelUrl,cabinWorldUrl,cabinTreesUrl], configureStudioLoader)
  const { invalidate: invalidateCards } = useThree()
  const model = useMemo(() => {
    const loadedTextures=new Set<string>()
    scene.traverse(object=>{if(object instanceof Mesh)for(const material of Array.isArray(object.material)?object.material:[object.material])if('map'in material&&material.map&&material.map.image?.width>0)loadedTextures.add(material.map.name)})
    if(!['loft7d-static-baked','loft7d-soft-color'].every(name=>loadedTextures.has(name)))throw new Error('Required studio texture could not load')
    const copy = scene.clone(true)
    copy.traverse(o=>{if(['ProjectsSign','AboutSign','CommunitySign','ContactSign'].includes(String(o.userData.stable_id)))o.visible=false})
    const worldCopy = world.clone(true)
    arrangeWorld(worldCopy)
    copy.add(worldCopy)
    copy.add(createSignpost())
    applyCommunityCards(copy, () => invalidateCards())
    copy.add(createCabinForest(trees,window.innerWidth<=600))
    // The small plot of land continues as forest floor all the way to the horizon (same material, so lighting matches).
    let groundMaterial: Mesh['material'] | undefined
    copy.traverse(o => { if (!groundMaterial && o instanceof Mesh && o.userData.stable_id === undefined && o.parent?.userData.stable_id === 'ForestGround') groundMaterial = o.material })
    copy.traverse(o => { if (!groundMaterial && o.userData.stable_id === 'ForestGround' && o instanceof Mesh) groundMaterial = o.material })
    if (groundMaterial) {
      const floor = new Mesh(new CircleGeometry(90, 56), Array.isArray(groundMaterial) ? groundMaterial[0] : groundMaterial)
      floor.name = 'Distant forest floor'; floor.rotation.x = -Math.PI / 2; floor.position.y = -.375; floor.raycast = () => {}; floor.receiveShadow = false
      copy.add(floor)
    }
    copy.add(createForestFloorDetail())
    // Midnight Spruce palette: pull the baked pastel upholstery toward moss/sage.
    copy.traverse(o => { if (o.userData.stable_id === 'SoftFurnishings') o.traverse(m => { if (m instanceof Mesh) for (const mat of Array.isArray(m.material) ? m.material : [m.material]) if ('color' in mat && mat.color instanceof Color) mat.color.set('#a9cf93') }) })
    copy.traverse(child => {
      if ('isMesh' in child) {
        // Static geometry contains Blender direct + indirect illumination.
        // Only the PBR interaction targets participate in realtime lighting.
        const baked = child instanceof Mesh && (Array.isArray(child.material) ? child.material : [child.material]).every(m => m instanceof MeshBasicMaterial)
        if (child instanceof Mesh) {
          child.material = Array.isArray(child.material) ? child.material.map(m => m.clone()) : child.material.clone()
        }
        if(child instanceof Mesh && baked)for(const m of Array.isArray(child.material)?child.material:[child.material])if(m instanceof MeshBasicMaterial)m.color.setRGB(.68,.57,.43)
        child.castShadow = !baked && !('isInstancedMesh' in child)
        child.receiveShadow = !baked
      }
    })
    if (import.meta.env.DEV) {
      const targets: string[] = []
      copy.traverse(o => { if (o.userData.stable_id) targets.push(String(o.userData.stable_id)) })
      window.__studioScene = { version: sceneConfig.version, targets }
    }
    return copy
  }, [scene,world,trees])
  const { invalidate: redraw } = useThree()
  // Independently movable units (layout.json offsets are applied here, in production too).
  const pivots = useMemo(() => { const built = buildPivots(model); addGlowPools(built); addFlameGlow(built); applyLayout(built, savedLayout); return built }, [model])
  const [editing, setEditing] = useState(false)
  const [layoutVersion, setLayoutVersion] = useState(0)
  const editor = useRef<typeof import('./editor/store') | null>(null)
  useEffect(() => {
    if (!import.meta.env.DEV) return
    let off = () => {}
    void import('./editor/store').then(module => {
      editor.current = module; module.store.register(pivots, () => redraw())
      const update = () => { setEditing(module.getState().active); setLayoutVersion(module.getState().version) }
      off = module.subscribe(update); update()
    })
    return () => off()
  }, [pivots, redraw])
  useEffect(() => {
    // The exported GLB drops the canvas image; apply a resized derivative of the real owner flyer (aspect preserved by the quad).
    let cancelled = false
    new TextureLoader().load(`${import.meta.env.BASE_URL}media/world/easel-cookies-clubs-flyer.jpg`, texture => {
      if (cancelled) { texture.dispose(); return }
      texture.flipY = false; texture.colorSpace = SRGBColorSpace; texture.anisotropy = 4
      let matched = 0
      model.traverse(o => { if (o instanceof Mesh) for (const m of Array.isArray(o.material) ? o.material : [o.material]) if (m.name === 'Midnight owner art paper' && 'map' in m) { matched++; (m as MeshBasicMaterial).map = texture; (m as MeshBasicMaterial).color.set('#ffffff'); m.needsUpdate = true } })
      if (matched) redraw()
    })
    return () => { cancelled = true }
  }, [model, redraw])
  useEffect(() => { props.onReady() }, [props.onReady])
  const boxes = useMemo(() => {
    model.updateMatrixWorld(true)
    const targetBoxes = interactionList.flatMap(entry => (entry.hitObjects ?? entry.objects).flatMap(id => {
      let root: Object3D | undefined
      model.traverse(o => { if (o.userData.stable_id === id) root = o })
      if (!root || isObjectHidden(root)) return []
      const bounds = new Box3().setFromObject(root).expandByScalar(.06)
      const size = bounds.getSize(new Vector3()).max(new Vector3(.16, .16, .16))
      return [{ id: `${entry.id}-${id}`, action: entry.id, center: bounds.getCenter(new Vector3()), size }]
    }))
    for (const entry of interactionList) for (const name of entry.hitZones ?? []) {
      const bounds = sceneBounds.zones[name]
      targetBoxes.push({ id: `${entry.id}-${name}`, action: entry.id, center: new Vector3(...bounds.center), size: new Vector3(...bounds.size).addScalar(.06) })
    }
    return targetBoxes
  }, [model, layoutVersion])
  const hits = useRef<import('three').Group>(null)
  const [hovered, setHovered] = useState<Hotspot>(null)
  useCursor(Boolean(hovered), 'pointer', 'auto')
  const { invalidate, gl, camera, size } = useThree()
  useEffect(() => { // DEV hook: world point -> CSS pixels, used to plan scenery against the real camera framing
    if (!import.meta.env.DEV) return
    ;(window as unknown as Record<string, unknown>).__studioProject = (x: number, y: number, z: number) => { const v = new Vector3(x, y, z).project(camera); return { x: (v.x + 1) / 2 * size.width, y: (1 - v.y) / 2 * size.height } }
  }, [camera, size.width, size.height])
  useEffect(() => {
    const anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy())
    model.traverse(o => {
      if (!(o instanceof Mesh)) return
      for (const material of Array.isArray(o.material) ? o.material : [o.material]) {
        if ('map' in material && material.map && material.map.anisotropy !== anisotropy) {
          material.map.anisotropy = anisotropy
          material.map.needsUpdate = true
        }
      }
    })
    invalidate()
  }, [model, gl, invalidate])
  useEffect(() => {
    if (!import.meta.env.DEV) return
    window.__studioPick = (x, y) => {
      const ray = new Raycaster()
      ray.setFromCamera(new Vector2(x, y), camera)
      return ray.intersectObject(model, true).slice(0, 6).map(hit => `${hit.object.name}:${interactionForObject(hit.object) ?? 'fixed'}`)
    }
    return () => { delete window.__studioPick }
  }, [camera, model])
  useEffect(() => {
    props.probe.current = (x, y) => {
      const rect = gl.domElement.getBoundingClientRect()
      const ray = new Raycaster()
      ray.setFromCamera(new Vector2((x - rect.left) / rect.width * 2 - 1, -(y - rect.top) / rect.height * 2 + 1), camera)
      return Boolean(interactionForObject(ray.intersectObjects([model, ...(hits.current ? [hits.current] : [])], true)[0]?.object ?? model))
    }
    return () => { props.probe.current = null }
  }, [model, camera, gl, props.probe])
  useEffect(() => {
    const originals: { color: Color; saved: Color }[] = []
    model.traverse(o => {
      if (!(o instanceof Mesh) || !hovered || interactionForObject(o) !== hovered) return
      for (const mat of Array.isArray(o.material) ? o.material : [o.material]) if ('color' in mat && mat.color instanceof Color) {
        originals.push({ color: mat.color, saved: mat.color.clone() }); mat.color.multiplyScalar(1.15)
      }
    })
    invalidate()
    return () => { originals.forEach(({ color, saved }) => color.copy(saved)); invalidate() }
  }, [model, hovered, invalidate])
  useEffect(() => { setHovered(null); props.onTooltip(null) }, [props.request.serial, props.panel, props.onTooltip])
  const amount = usePrinterPaper(model, props.paperOut, props.reducedMotion, props.request.serial, props.onPrinted)
  const samples = useRef({ count: 0, ms: 0 })
  const warmup = useRef(0)
  const peak = useRef({ calls: 0, triangles: 0 })
  useFrame((_, delta) => {
    if (warmup.current++ < 3) invalidate()
    if (import.meta.env.DEV) {
      peak.current.calls = Math.max(peak.current.calls, gl.info.render.calls)
      peak.current.triangles = Math.max(peak.current.triangles, gl.info.render.triangles)
      if (delta < .1 && delta > 0) {
        samples.current.count++
        samples.current.ms += delta * 1000
      }
      window.__studioMetrics = { calls: gl.info.render.calls, triangles: gl.info.render.triangles,
        peakCalls: peak.current.calls, peakTriangles: peak.current.triangles,
        textures: gl.info.memory.textures, geometries: gl.info.memory.geometries,
        activeFrameMs: samples.current.count ? samples.current.ms / samples.current.count : 0, frames: samples.current.count, paperProgress: amount.current }
    }
  })

  const activate = (event: ThreeEvent<MouseEvent>) => {
    if (isObjectHidden(event.object)) return
    if (editing) {
      event.stopPropagation()
      let node: Object3D | null = event.object; let id: string | null = null
      while (node && !id) { id = (node.userData.editId as string | undefined) ?? null; node = node.parent }
      editor.current?.store.select(id)
      if (!id) editor.current?.store.message('That part is locked architecture (baked into the model). See the editor guide.')
      return
    }
    const target = interactionForObject(event.object)
    if (!target || event.delta > 6) return
    event.stopPropagation()
    setHovered(null)
    props.onTooltip(null)
    props.onNavigate(target)
  }
  const over = (event: ThreeEvent<PointerEvent>) => {
    if (isObjectHidden(event.object)) return
    event.stopPropagation()
    if (editing) { setHovered(null); props.onTooltip(null); return }
    const target = interactionForObject(event.object)
    setHovered(target)
    if (!target) { props.onTooltip(null); return }
    const anchor = event.point.clone()
    anchor.y += .2
    anchor.project(camera)
    props.onTooltip({ x: Math.max(Math.min(145, size.width / 2), Math.min(size.width - Math.min(145, size.width / 2), (anchor.x + 1) * size.width / 2)), y: Math.max(50, Math.min(size.height - 22, (1 - anchor.y) * size.height / 2)), label: interactions[target].label })
  }
  const out = () => { setHovered(null); props.onTooltip(null) }
  return <group onClick={activate} onPointerOver={over} onPointerMove={over} onPointerOut={out}>
    <primitive object={model} />
    <group ref={hits}>{boxes.map(box => <mesh key={box.id} position={box.center} userData={{ interactionId: box.action }}>
      <boxGeometry args={[box.size.x, box.size.y, box.size.z]} />
      <meshBasicMaterial visible={hovered === box.action} transparent opacity={.045} color="#cbdab4" depthWrite={false} />
    </mesh>)}</group>
  </group>
}

function HearthLight({reducedMotion,low,blocked}:{reducedMotion:boolean;low:boolean;blocked:boolean}) {
  const light=useRef<PointLight>(null)
  const flame=useRef<Object3D|null>(null)
  const glows=useRef<Object3D[]>([])
  const {invalidate,scene}=useThree()
  useEffect(()=>{if(reducedMotion||low||blocked)return;const timer=window.setInterval(()=>{if(!document.hidden)invalidate()},120);return()=>clearInterval(timer)},[reducedMotion,low,blocked,invalidate])
  useFrame(({clock})=>{
    const t=clock.elapsedTime,calm=low||reducedMotion
    if(light.current)light.current.intensity=calm?2.2:2.2+Math.sin(t*3.7)*.16+Math.sin(t*7.3)*.07
    if(!flame.current)scene.traverse(o=>{if(!flame.current&&o.userData.stable_id==='FireEmbers')flame.current=o})
    if(flame.current)flame.current.scale.y=calm?1:1+Math.sin(t*8.1)*.035+Math.sin(t*13.7)*.02
    if(!glows.current)glows.current=[scene.getObjectByName('glow:flame'),scene.getObjectByName('glow:flame-wash')].filter((o):o is Object3D=>Boolean(o))
    const pulse=calm?1:1+Math.sin(t*6.3)*.09+Math.sin(t*11.9)*.05
    glows.current.forEach(g=>{const m=(g as Mesh).material as MeshBasicMaterial;m.opacity=(g.userData.baseOpacity as number)*pulse;g.scale.setScalar(calm?1:1+(pulse-1)*.6)})
  })
  return <pointLight ref={light} position={hearthLightPosition.toArray()} color="#ff8238" intensity={2.2} distance={4.2} decay={2}/>
}

function ContextHealth({ onLost }: { onLost: () => void }) {
  const { gl } = useThree()
  useEffect(()=>{const canvas=gl.domElement;const lost=(event:Event)=>{event.preventDefault();onLost()};canvas.addEventListener('webglcontextlost',lost);return()=>canvas.removeEventListener('webglcontextlost',lost)},[gl,onLost])
  return null
}
const StudioCanvas = memo(function StudioCanvas(props: StudioProps & { modelUrl: string; compact: boolean; onTooltip: (value: Tooltip | null) => void; onLost: () => void; probe: RefObject<((x:number,y:number)=>boolean)|null> }) {
  const low=Boolean(props.lightRendering)
  return <Canvas orthographic camera={{ position: [...sceneConfig.camera], zoom: 80, near: .1, far: 60 }} shadows dpr={[1, low?1:props.compact?1.25:1.5]} frameloop="demand"
    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    onCreated={({ gl }) => { gl.toneMapping = AgXToneMapping; gl.toneMappingExposure = 1.15; gl.shadowMap.type = PCFSoftShadowMap }}
    fallback={<div className="scene-fallback">Use Studio Menu or the direct links if 3D is unavailable.</div>}
    aria-label="A cutaway timber cabin in a spruce woodland, with an attached art porch, easel, fireplace reading nook, loft, workstation and archive. The monitor and wooden Projects sign open projects; the printer opens Resume. Equivalent destinations are available in Studio Menu.">
    <ContextHealth onLost={props.onLost} />
    {EditorScene && <Suspense fallback={null}><EditorScene /></Suspense>}
    <StudioCamera request={props.request} command={props.command} reducedMotion={props.reducedMotion} blocked={Boolean(props.panel)} touchEnabled={props.touchEnabled} ready={props.ready} onSettled={props.onSettled} onReset={props.onReset} probe={props.probe} />
    {!low && <SoftShadows size={30} samples={12} focus={.3} />}
    <fog attach="fog" args={['#4a3a4f',18,68]} />
    <hemisphereLight args={['#8a98d8', '#6a4a30', 1.35]} />
    <HearthLight reducedMotion={props.reducedMotion} low={low} blocked={Boolean(props.panel)} />
    <pointLight position={porchLightPosition.toArray()} color="#ffb967" intensity={4.2} distance={5.5} decay={2} />
    <pointLight position={[-2,1.8,-1.6]} color="#ffd090" intensity={2.4} distance={3} decay={2} />
    <directionalLight position={[-8, 6.2, 4]} color="#ffa84f" intensity={4.6} castShadow shadow-mapSize={low?[1024,1024]:[2048,2048]} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-camera-near={.1} shadow-camera-far={25} shadow-bias={-.0002} shadow-normalBias={.025} shadow-radius={4} />
    <directionalLight position={[4, 5, -3]} color="#6f86c8" intensity={1.15} />
    <directionalLight position={[0, 3, -3]} color="#ffcc86" intensity={.9} />
    <Suspense fallback={null}><Desk {...props} /></Suspense>
    <ContactShadows position={[0, -.34, 0]} opacity={.22} scale={19} blur={2.7} far={5} resolution={512} frames={1} color="#061c16" />
  </Canvas>
})
export default function Studio(props: StudioProps) {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null)
  const [lost,setLost]=useState(false)
  const [compact]=useState(()=>window.innerWidth<=600)
  const probe = useRef<((x: number, y: number) => boolean) | null>(null)
  const onTooltip=useCallback((next:Tooltip|null)=>setTooltip(previous=>previous&&next&&previous.label===next.label&&Math.abs(previous.x-next.x)<2&&Math.abs(previous.y-next.y)<2?previous:next),[])
  const onLost=useCallback(()=>{setLost(true);props.onUnavailable?.()},[props.onUnavailable])
  if(lost)return <div className="scene-fallback" role="status"><strong>The studio paused because its graphics context was lost.</strong><p>All portfolio content is still available in Studio Menu and the direct links.</p><button onClick={()=>setLost(false)}>Restart the studio</button></div>
  return <>{EditorPanel && <Suspense fallback={null}><EditorPanel /></Suspense>}<StudioCanvas {...props} compact={compact} modelUrl={compact?compactStudioModelUrl:studioModelUrl} probe={probe} onTooltip={onTooltip} onLost={onLost} /><Loading />{tooltip&&!props.panel&&<div className="hotspot-tooltip" style={{position:'absolute',left:tooltip.x,top:tooltip.y,transform:'translate(-50%, -100%)',pointerEvents:'none'}}><span>{tooltip.label} <i aria-hidden="true">↗</i></span></div>}</>
}
