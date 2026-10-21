const fs=require('node:fs'),zlib=require('node:zlib');
const config=require('../src/school/config.js');
try {
 const settings=process.argv[2]?config.parse(fs.readFileSync(process.argv[2],'utf8')):config.defaults();
 if(settings.logo){
  const bytes=Buffer.from(settings.logo.slice(22),'base64');
  const {width,height}=config.checkImage(bytes,'image/png',256),channels=bytes[25]===6?4:3;
  const stride=1+width*channels,chunks=[];
  for(let offset=8;offset<bytes.length;){const size=bytes.readUInt32BE(offset);if(bytes.toString('ascii',offset+4,offset+8)==='IDAT')chunks.push(bytes.subarray(offset+8,offset+8+size));offset+=size+12;}
  const raw=zlib.inflateSync(Buffer.concat(chunks),{maxOutputLength:height*stride});
  if(raw.length!==height*stride)throw Error('Ugyldige biletdata i logoen.');
  for(let row=0;row<height;row++)if(raw[row*stride]>4)throw Error('Ugyldige biletdata i logoen.');
 }
 process.stdout.write(JSON.stringify(settings));
} catch(error) {console.error(error.message);process.exitCode=1;}
