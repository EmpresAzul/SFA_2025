# FluxoAzul PWA - Progressive Web App

## 🚀 Funcionalidades PWA Implementadas

### ✅ **Instalação**
- **Prompt automático** de instalação após 30 segundos (Android/Chrome)
- **Instruções específicas** para iOS Safari
- **Detecção inteligente** de dispositivo e browser
- **Não mostrar novamente** por 7 dias se dispensado

### ✅ **Responsividade Total**
- **Layout adaptativo** para smartphones e tablets
- **Safe area insets** para dispositivos com notch
- **Touch targets** otimizados (mínimo 44px)
- **Scroll suave** e otimizado para mobile

### ✅ **Compatibilidade Multiplataforma**
- **Android Chrome**: Instalação nativa com prompt
- **iOS Safari**: Instruções claras para "Adicionar à Tela de Início"
- **Windows Edge**: Suporte completo a PWA
- **Desktop**: Funciona como app standalone

### ✅ **Service Worker Avançado**
- **Cache inteligente** com estratégias diferenciadas
- **Funcionamento offline** para páginas visitadas
- **Background sync** quando conectividade é restaurada
- **Limpeza automática** de cache antigo

### ✅ **Notificações e Updates**
- **Indicador offline** quando sem conexão
- **Notificação de atualização** disponível
- **Update automático** com reload da página
- **Push notifications** preparado para futuro

### ✅ **Manifest Otimizado**
- **Ícones múltiplos** (192x192, 512x512)
- **Shortcuts** para páginas principais
- **Cores de tema** consistentes
- **Orientação portrait** otimizada

## 📱 **Como Instalar**

### **Android (Chrome/Edge)**
1. Acesse o FluxoAzul no navegador
2. Aguarde o prompt automático OU
3. Menu → "Instalar app" OU
4. Menu → "Adicionar à tela inicial"

### **iOS (Safari)**
1. Acesse o FluxoAzul no Safari
2. Toque no ícone de compartilhar (⬆️)
3. Selecione "Adicionar à Tela de Início"
4. Confirme a instalação

### **Desktop (Chrome/Edge)**
1. Acesse o FluxoAzul
2. Ícone de instalação na barra de endereços OU
3. Menu → "Instalar FluxoAzul"

## 🛠️ **Arquivos PWA**

### **Principais**
- `public/manifest.json` - Configuração do PWA
- `public/sw.js` - Service Worker
- `public/browserconfig.xml` - Configuração Windows
- `src/components/pwa/` - Componentes PWA

### **Componentes React**
- `PWAInstallPrompt.tsx` - Prompt de instalação
- `OfflineIndicator.tsx` - Indicador offline
- `UpdateNotification.tsx` - Notificação de updates
- `usePWA.ts` - Hook para gerenciar PWA

## 🎨 **Recursos Visuais**

### **Ícones**
- **192x192px**: Ícone padrão para Android
- **512x512px**: Ícone de alta resolução
- **Maskable**: Suporte a ícones adaptativos
- **Favicon**: Múltiplos formatos (.ico, .svg)

### **Cores**
- **Theme Color**: `#1e3a8a` (Azul FluxoAzul)
- **Background**: `#f8fafc` (Cinza claro)
- **Status Bar**: Translúcido no iOS

### **Splash Screens**
- **iOS**: Configurado para diferentes tamanhos
- **Android**: Gerado automaticamente
- **Cores consistentes** com a marca

## 📊 **Performance**

### **Cache Strategy**
- **Static Cache**: Páginas e recursos estáticos
- **Dynamic Cache**: Conteúdo dinâmico
- **Network First**: APIs e dados em tempo real
- **Cache First**: Recursos estáticos

### **Offline Support**
- **Páginas visitadas**: Funcionam offline
- **Dados locais**: Mantidos em cache
- **Sync automático**: Quando volta online
- **Indicador visual**: Status de conexão

## 🔧 **Desenvolvimento**

### **Comandos**
```bash
# Build para produção
npm run build

# Servir localmente
npm run preview

# Testar PWA
npx serve dist
```

### **Testes PWA**
1. **Chrome DevTools**: Application → Service Workers
2. **Lighthouse**: PWA audit score
3. **Offline**: Desconectar rede e testar
4. **Mobile**: Testar em dispositivos reais

## 📈 **Métricas PWA**

### **Lighthouse Score Target**
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 90+
- **SEO**: 90+
- **PWA**: 100

### **Core Web Vitals**
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

## 🚀 **Próximos Passos**

### **Funcionalidades Futuras**
- [ ] Push notifications para lembretes
- [ ] Background sync para lançamentos
- [ ] Share API para relatórios
- [ ] File System API para exports
- [ ] Biometric authentication

### **Otimizações**
- [ ] Lazy loading de componentes
- [ ] Code splitting por rota
- [ ] Image optimization
- [ ] Bundle size reduction

## 📞 **Suporte**

Para problemas com PWA:
1. Limpar cache do navegador
2. Desinstalar e reinstalar o app
3. Verificar se Service Worker está ativo
4. Testar em modo incógnito

---

**FluxoAzul PWA** - Gestão Financeira na palma da sua mão! 📱💼