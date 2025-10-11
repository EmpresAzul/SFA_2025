# 📱 FluxoAzul - Guia de Desenvolvimento Mobile

## 🚀 Configuração Capacitor para Apps Nativos (iOS/Android)

Este projeto está configurado para funcionar como:
- ✅ **PWA** (Progressive Web App) - Funciona instalado no celular
- ✅ **App Nativo iOS** - Via Capacitor
- ✅ **App Nativo Android** - Via Capacitor

---

## 📋 Pré-requisitos

### Para iOS:
- macOS com Xcode instalado
- Node.js 18+ instalado
- CocoaPods instalado (`sudo gem install cocoapods`)

### Para Android:
- Android Studio instalado
- Java JDK 17+ configurado
- Android SDK configurado

---

## 🛠️ Instalação e Configuração

### 1️⃣ Transferir o Projeto para GitHub
1. Clique em **"Export to GitHub"** no Lovable
2. Clone o projeto do seu GitHub:
```bash
git clone seu-repositorio-github.git
cd fluxo-azul-financeiro-pme
```

### 2️⃣ Instalar Dependências
```bash
npm install
```

### 3️⃣ Adicionar Plataformas

#### Para iOS:
```bash
npx cap add ios
npx cap update ios
```

#### Para Android:
```bash
npx cap add android
npx cap update android
```

### 4️⃣ Build do Projeto
```bash
npm run build
```

### 5️⃣ Sincronizar com Plataformas Nativas
```bash
# Sincroniza o código web com as plataformas nativas
npx cap sync
```

⚠️ **IMPORTANTE**: Execute `npx cap sync` sempre que:
- Fizer `git pull` de novas alterações
- Modificar o código fonte
- Adicionar novos plugins Capacitor

---

## 🏃 Executar o App

### Em Emulador/Dispositivo iOS:
```bash
npx cap run ios
```

Ou abra manualmente:
```bash
npx cap open ios
# Isso abre o Xcode - pressione Play para rodar
```

### Em Emulador/Dispositivo Android:
```bash
npx cap run android
```

Ou abra manualmente:
```bash
npx cap open android
# Isso abre o Android Studio - pressione Play para rodar
```

---

## 🔥 Hot Reload Durante Desenvolvimento

O projeto está configurado para **hot reload** da sandbox do Lovable:
- URL configurada: `https://74ae3fbe-e863-4b94-bcb5-73a57e53dcff.lovableproject.com`
- Todas as alterações feitas no Lovable aparecerão automaticamente no app

Para usar build local em vez da sandbox:
1. Edite `capacitor.config.ts`
2. Comente ou remova a seção `server`
3. Execute `npx cap sync`

---

## 📱 Otimizações Mobile Implementadas

### ✅ Touch Targets
- Todos os botões têm mínimo 44x44px (padrão iOS/Android)
- Áreas clicáveis otimizadas para dedos

### ✅ Scroll Suave
- `-webkit-overflow-scrolling: touch` em todos os containers
- Scroll horizontal em tabelas otimizado

### ✅ Safe Areas
- Suporte para notch (iPhone X+)
- Suporte para home indicator
- Padding automático para áreas seguras

### ✅ Performance
- Hardware acceleration em animações
- Lazy loading de componentes
- Otimização de imagens

### ✅ Inputs Mobile
- Font-size 16px para prevenir zoom no iOS
- Teclado otimizado por tipo de input
- Focus states melhorados

---

## 🎨 Responsividade

### Breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1023px  
- **Desktop**: ≥ 1024px (intacto, não modificado)

### Classes CSS Úteis:
```css
.touch-target        /* 44x44px mínimo */
.smooth-scroll       /* Scroll suave mobile */
.safe-area-inset     /* Respeita notch/home */
.no-select           /* Desabilita seleção texto */
```

---

## 📦 Plugins Capacitor Recomendados

Para adicionar funcionalidades nativas:

```bash
# Status Bar (cor/estilo)
npm install @capacitor/status-bar
npx cap sync

# Keyboard (teclado)
npm install @capacitor/keyboard
npx cap sync

# Haptics (vibração)
npm install @capacitor/haptics
npx cap sync

# Camera
npm install @capacitor/camera
npx cap sync

# Geolocation
npm install @capacitor/geolocation
npx cap sync
```

---

## 🐛 Troubleshooting

### iOS não compila:
```bash
cd ios/App
pod install
cd ../..
npx cap sync ios
```

### Android não compila:
```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

### Hot reload não funciona:
1. Verifique se está na mesma rede WiFi
2. Confirme URL em `capacitor.config.ts`
3. Desabilite firewall temporariamente

---

## 📚 Recursos Adicionais

- [Documentação Capacitor](https://capacitorjs.com/docs)
- [Plugins Capacitor](https://capacitorjs.com/docs/plugins)
- [Blog Lovable sobre Mobile](https://lovable.dev/blogs)

---

## ✨ Próximos Passos

1. ✅ Configuração Capacitor concluída
2. ⏭️ Testar em dispositivo físico
3. ⏭️ Adicionar ícones personalizados
4. ⏭️ Configurar splash screens
5. ⏭️ Publicar na App Store / Play Store

---

**Desenvolvido com 💙 FluxoAzul**
