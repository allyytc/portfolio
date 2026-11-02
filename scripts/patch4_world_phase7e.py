import bpy
s=bpy.data.scenes['MidnightSpruceWorld7E'];n=0
def top(o):
    while o.parent:o=o.parent
    return o
for o in s.objects:
    if o.type=='MESH' and top(o).name.split('.')[0]=='ForestGround':
        for i,m in enumerate(o.data.materials):
            if m and m.name.startswith('Midnight 7E warm stone '):
                o.data.materials[i]=bpy.data.materials['Midnight hearth stone '+m.name.split()[-1]];n+=1
print('restored',n)
