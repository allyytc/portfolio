import { Color, Group, InstancedMesh, Matrix4, Mesh, Quaternion, Vector3 } from 'three'
import type { Object3D } from 'three'
import layout from './forestLayout.json' with { type: 'json' }
import fill from './forestFill.json' with { type: 'json' } // trees planted into ground that is visible from the default camera (planned with scripts/ scan, see PHASE7F notes)
interface Place { kind: number; position: number[]; height: number; rotation: number; background: boolean }
/** Deterministic far woodland that fills the whole backdrop (jittered grid, front corridor kept clear for the camera). Same three instanced templates, no extra geometry. */
function distantTrees(compact: boolean): Place[] {
  let seed = 11; const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
  const step = compact ? 5.4 : 3.2, out: Place[] = []
  for (let x = -34; x <= 34; x += step) for (let z = -34; z <= 30; z += step) {
    const px = x + (random() - .5) * step * .85, pz = z + (random() - .5) * step * .85, r = Math.hypot(px * .85, pz)
    if (r < 11.5 || r > 36) continue
    if (pz > 5.5 && r < 22) continue // keep the foreground open so no trunk blocks the hero view
    out.push({ kind: random() < .6 ? 2 : Math.floor(random() * 2), position: [px, -.34, pz], height: 5.2 + random() * 3.4 + (r > 24 ? 1.6 : 0), rotation: random() * 6.28, background: true })
  }
  return out
}
/** Three licensed pine templates, shared bark/leaves and bounded instance counts. */
export function createCabinForest(source: Object3D, compact: boolean) {
  const group = new Group(); group.name = 'Spruce woodland';source.updateMatrixWorld(true)
  for (let kind=0;kind<3;kind++) {
    let root:Object3D|undefined
    source.traverse(o=>{if(o.name.startsWith(`Spruce${kind}`))root??=o})
    if(!root)throw new Error('Spruce template unavailable')
    const places=[...layout.filter(p=>!compact||!p.background),...(compact?[]:fill),...distantTrees(compact)].filter(p=>p.kind===kind)
    root.traverse(template=>{
      if(!(template instanceof Mesh))return
      const materials=(Array.isArray(template.material)?template.material:[template.material]).map(m=>{const copy=m.clone();if(/^Spruce vertex/.test(m.name))return copy;if('color'in copy&&(copy.color as {multiplyScalar:(n:number)=>void})) (copy.color as {multiplyScalar:(n:number)=>void}).multiplyScalar(.40);if('color'in copy&&copy.color instanceof Color&&/Leaves/i.test(copy.name))copy.color.multiply(new Color(.33,.75,.70));return copy})
      const instances=new InstancedMesh(template.geometry,Array.isArray(template.material)?materials:materials[0],places.length)
      instances.name=`Shared spruce ${kind} ${template.name}`;instances.castShadow=false;instances.receiveShadow=false
      const matrix=new Matrix4(),rotation=new Quaternion(),axis=new Vector3(0,1,0)
      places.forEach((p,index)=>{rotation.setFromAxisAngle(axis,p.rotation);matrix.compose(new Vector3(...p.position),rotation,new Vector3(p.height,p.height,p.height));matrix.multiply(template.matrixWorld);instances.setMatrixAt(index,matrix)})
      instances.computeBoundingSphere();group.add(instances)
    })
  }
  return group
}
