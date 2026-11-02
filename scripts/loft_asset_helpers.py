"""Import selected licensed source models without discarding their atlas UVs."""
import bpy
from mathutils import Vector

def import_asset(path,name,loc,collection,parent=None,dims=None,height=None,rotation=0):
    before=set(bpy.data.objects);bpy.ops.import_scene.gltf(filepath=str(path));obs=list(set(bpy.data.objects)-before);bpy.context.view_layer.update()
    vertices=[o.matrix_world@Vector(c) for o in obs if o.type=='MESH' for c in o.bound_box]
    lo=Vector([min(v[i] for v in vertices) for i in range(3)]);hi=Vector([max(v[i] for v in vertices) for i in range(3)]);extent=hi-lo;center=Vector(((lo.x+hi.x)/2,(lo.y+hi.y)/2,lo.z))
    root=bpy.data.objects.new(name,None);collection.objects.link(root);root.parent=parent;root['asset_source']=str(path)
    for o in obs:
        for c in list(o.users_collection):c.objects.unlink(o)
        collection.objects.link(o)
        if o.parent not in obs:o.parent=root;o.location-=center
        if o.type=='MESH':
            o.name=name+' / '+o.name
            if o.data.uv_layers:o.data.uv_layers[0].name='SurfaceUV'
    if dims:root.scale=[dims[i]/max(extent[i],.0001) for i in range(3)]
    elif height:root.scale=(height/max(extent.z,.0001),)*3
    root.location=loc;root.rotation_euler.z=rotation
    bpy.context.view_layer.update()
    return root,obs
