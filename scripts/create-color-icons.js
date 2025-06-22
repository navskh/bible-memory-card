const fs = require('fs');
const path = require('path');

// 간단한 색상 블록 PNG 생성 (192x192)
function createColorPNG(size, color = [79, 70, 229]) { // indigo-600
  const width = size;
  const height = size;
  
  // PNG 헤더
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A
  ]);
  
  // IHDR 청크
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth
  ihdrData.writeUInt8(2, 9); // color type (RGB)
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace
  
  const ihdrChunk = createChunk('IHDR', ihdrData);
  
  // IDAT 청크 (색상 데이터)
  const pixelData = Buffer.alloc(width * height * 3);
  for (let i = 0; i < pixelData.length; i += 3) {
    pixelData[i] = color[0];     // R
    pixelData[i + 1] = color[1]; // G
    pixelData[i + 2] = color[2]; // B
  }
  
  const idatChunk = createChunk('IDAT', pixelData);
  
  // IEND 청크
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([pngHeader, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  
  const typeBuffer = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  
  const chunkData = Buffer.concat([typeBuffer, data]);
  // 실제로는 CRC 계산이 필요하지만, 간단히 0으로 설정
  crc.writeUInt32BE(0, 0);
  
  return Buffer.concat([length, chunkData, crc]);
}

// 아이콘 크기들
const sizes = [192, 512];

// 아이콘 디렉토리 생성
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 각 크기별로 아이콘 생성
sizes.forEach(size => {
  const iconPath = path.join(iconsDir, `icon-${size}x${size}.png`);
  const pngData = createColorPNG(size);
  fs.writeFileSync(iconPath, pngData);
  console.log(`Created ${iconPath} (${size}x${size})`);
});

console.log('\n색상 아이콘 생성 완료!');
console.log('이제 PWA 설치 버튼이 나타날 수 있습니다.'); 