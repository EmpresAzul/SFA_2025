// Configuração do Lovable para sincronização automática
export default {
  // Configurações do projeto
  project: {
    name: "SFA_2025",
    description: "Sistema de Gestão Financeira PME",
    repository: "https://github.com/EmpresAzul/SFA_2025.git",
    branch: "main"
  },

  // Configurações de sincronização
  sync: {
    enabled: true,
    autoSync: true,
    syncOnPush: true,
    syncInterval: 30000, // 30 segundos
    
    // Arquivos a serem monitorados
    watchFiles: [
      "src/**/*.{ts,tsx,js,jsx}",
      "public/**/*",
      "*.{json,js,ts,md}",
      "tailwind.config.ts",
      "vite.config.ts"
    ],
    
    // Arquivos a serem ignorados
    ignoreFiles: [
      "node_modules/**/*",
      "dist/**/*",
      ".git/**/*",
      "*.log"
    ]
  },

  // Configurações de build
  build: {
    command: "npm run build",
    outputDir: "dist",
    publicPath: "/",
    
    // Variáveis de ambiente
    env: {
      NODE_ENV: "production",
      VITE_APP_NAME: "FluxoAzul"
    }
  },

  // Configurações de desenvolvimento
  dev: {
    command: "npm run dev",
    port: 8080,
    host: "0.0.0.0"
  },

  // Hooks para eventos
  hooks: {
    beforeSync: () => {
      console.log("🔄 FluxoAzul: Iniciando sincronização com Lovable...");
    },
    
    afterSync: () => {
      console.log("✅ FluxoAzul: Sincronização com Lovable concluída!");
    },
    
    onError: (error) => {
      console.error("❌ FluxoAzul: Erro na sincronização:", error);
    }
  }
};