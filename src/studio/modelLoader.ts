import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { sceneConfig } from './sceneConfig'

export const studioModelUrl = `${import.meta.env.BASE_URL}${sceneConfig.model}`
export const compactStudioModelUrl = `${import.meta.env.BASE_URL}models/loft-studio-v7d-compact.glb`
export const cabinWorldUrl = `${import.meta.env.BASE_URL}models/midnight-cabin-world-7e.glb`
export const cabinTreesUrl = `${import.meta.env.BASE_URL}models/midnight-spruce-trees.glb`
let decoder: DRACOLoader | undefined
export function configureStudioLoader(loader: GLTFLoader) {
  decoder ??= new DRACOLoader().setDecoderPath(`${import.meta.env.BASE_URL}decoders/draco/`).setWorkerLimit(2)
  loader.setDRACOLoader(decoder)
}
export function clearStudioModel() {
  useLoader.clear(GLTFLoader, cabinWorldUrl)
  useLoader.clear(GLTFLoader, cabinTreesUrl)
  decoder?.dispose()
  decoder = undefined
  useLoader.clear(GLTFLoader, studioModelUrl)
  useLoader.clear(GLTFLoader, compactStudioModelUrl)
}
export { GLTFLoader }
