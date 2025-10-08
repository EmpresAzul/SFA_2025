/**
 * Script para gerar ícones PWA a partir do logo FluxoAzul
 * 
 * INSTRUÇÕES:
 * 1. Salve o logo FluxoAzul fornecido como 'logo-source.png' na pasta 'public/icons/'
 * 2. Execute: npm run generate-icons
 * 
 * Este script irá gerar:
 * - icon-192x192.png (para Android)
 * - icon-512x512.png (para splash screen)
 * - apple-touch-icon.png (para iOS)
 * - favicon.ico (para browsers)
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '../public/icons');
const SOURCE_LOGO = path.join(ICONS_DIR, 'logo-source.png');

const iconSizes = [
  { size: 192, name: 'icon-192x192.png', purpose: 'any maskable' },
  { size: 512, name: 'icon-512x512.png', purpose: 'any maskable' },
  { size: 180, name: 'apple-touch-icon.png', purpose: 'apple' },
  { size: 32, name: 'favicon-32x32.png', purpose: 'favicon' },
  { size: 16, name: 'favicon-16x16.png', purpose: 'favicon' }
];

async function generateIcons() {
  try {
    // Verificar se o logo fonte existe
    if (!fs.existsSync(SOURCE_LOGO)) {
      console.error('❌ Logo fonte não encontrado!');
      console.log('📝 Por favor, salve o logo FluxoAzul como "logo-source.png" na pasta public/icons/');
      
      // Criar um ícone placeholder temporário
      await createPlaceholderIcons();
      return;
    }

    console.log('🎨 Gerando ícones PWA...');

    for (const icon of iconSizes) {
      const outputPath = path.join(ICONS_DIR, icon.name);
      
      await sharp(SOURCE_LOGO)
        .resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 30, g: 41, b: 59, alpha: 1 } // background_color do manifest
        })
        .png()
        .toFile(outputPath);
        
      console.log(`✅ Gerado: ${icon.name} (${icon.size}x${icon.size})`);
    }

    // Gerar favicon.ico
    await sharp(SOURCE_LOGO)
      .resize(32, 32)
      .png()
      .toFile(path.join(ICONS_DIR, '../favicon.ico'));
    
    console.log('✅ Gerado: favicon.ico');
    console.log('🎉 Todos os ícones PWA foram gerados com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao gerar ícones:', error);
    await createPlaceholderIcons();
  }
}

async function createPlaceholderIcons() {
  console.log('🔄 Criando ícones placeholder temporários...');
  
  const placeholderSvg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" fill="url(#grad)" rx="80"/>
      <text x="256" y="280" font-family="Arial, sans-serif" font-size="120" font-weight="bold" text-anchor="middle" fill="white">FA</text>
      <text x="256" y="380" font-family="Arial, sans-serif" font-size="32" text-anchor="middle" fill="white">FluxoAzul</text>
    </svg>
  `;

  for (const icon of iconSizes) {
    const outputPath = path.join(ICONS_DIR, icon.name);
    
    await sharp(Buffer.from(placeholderSvg))
      .resize(icon.size, icon.size)
      .png()
      .toFile(outputPath);
  }

  // Favicon
  await sharp(Buffer.from(placeholderSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(ICONS_DIR, '../favicon.ico'));

  console.log('✅ Ícones placeholder criados temporariamente');
  console.log('📝 Substitua por ícones reais colocando o logo como "logo-source.png" e executando novamente');
}

if (require.main === module) {
  generateIcons();
}

module.exports = { generateIcons };