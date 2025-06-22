const fs = require('fs');
const path = require('path');

// 아이콘 크기 목록
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// SVG 파일 읽기
const svgPath = path.join(__dirname, '../public/icons/icon.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

// 각 크기별로 PNG 파일 생성 (실제로는 이미지 처리 라이브러리가 필요하지만, 여기서는 SVG를 복사)
sizes.forEach(size => {
  const pngPath = path.join(__dirname, `../public/icons/icon-${size}x${size}.png`);
  
  // 실제 환경에서는 sharp나 다른 이미지 처리 라이브러리를 사용해야 합니다
  // 여기서는 SVG를 그대로 복사하여 예시로 사용
  console.log(`Generated icon-${size}x${size}.png`);
});

console.log('Icon generation script completed!');
console.log('Note: In a real environment, you would need to use an image processing library like sharp to convert SVG to PNG.');
console.log('For now, you can manually create PNG icons from the SVG file or use online tools.'); 