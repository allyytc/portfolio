// Blender Z-up converted to glTF Y-up. Shared by camera and actual mesh tests.
import { cameraViews } from './cameraViews'
export const sceneConfig = {
  version: 'phase4d-loft',
  model: 'models/loft-studio-v7d.glb',
  camera: cameraViews.default.position,
  target: cameraViews.default.target,
  span: cameraViews.default.span,
  hotspots: {
    sign: [-2.03, 1.38, 6.41] as const,
    monitor: [-2.01, 1.18, -1.555] as const,
    printer: [-2.68, 1.03, -1.53] as const,
  },
} as const
