// A minimal self-contained, geometry-bearing glTF v2 GLB fixture.
// X width 1m, Y height 1m, Z length 2m; valid width-based truck scaling.
export function tinyTruckGlb(): Buffer {
  const positions = new Float32Array([
    -0.5, 0, -1,
     0.5, 0, -1,
     0,   1,  1
  ])
  const geometry = Buffer.from(positions.buffer)
  const json = {
    asset: {version:'2.0', generator:'brickworld test fixture'},
    scene:0, scenes:[{nodes:[0]}], nodes:[{mesh:0}],
    meshes:[{primitives:[{attributes:{POSITION:0},mode:4}]}],
    accessors:[{bufferView:0,componentType:5126,count:3,type:'VEC3',
      min:[-0.5,0,-1],max:[0.5,1,1]}],
    bufferViews:[{buffer:0,byteOffset:0,byteLength:geometry.byteLength}],
    buffers:[{byteLength:geometry.byteLength}]
  }
  const encoded=Buffer.from(JSON.stringify(json),'utf8')
  const paddedJson=Buffer.alloc(Math.ceil(encoded.length/4)*4,0x20)
  encoded.copy(paddedJson)
  const data=Buffer.alloc(20+paddedJson.length+8+geometry.length)
  data.writeUInt32LE(0x46546c67,0)
  data.writeUInt32LE(2,4)
  data.writeUInt32LE(data.length,8)
  data.writeUInt32LE(paddedJson.length,12)
  data.writeUInt32LE(0x4e4f534a,16)
  paddedJson.copy(data,20)
  data.writeUInt32LE(geometry.length,20+paddedJson.length)
  data.writeUInt32LE(0x004e4942,24+paddedJson.length)
  geometry.copy(data,28+paddedJson.length)
  return data
}
