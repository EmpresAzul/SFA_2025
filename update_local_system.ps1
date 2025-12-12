# Script para atualizar sistema local com GitHub
Write-Host "========================================" -ForegroundColor Green
Write-Host "Atualizando sistema local com GitHub" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Definir o caminho local
$localPath = "C:\Users\leand\OneDrive\Documentos\NFA\SFA_2025"

# Verificar se o diretório existe
if (!(Test-Path $localPath)) {
    Write-Host "Diretório não encontrado. Criando..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $localPath -Force
}

# Navegar para o diretório
Set-Location $localPath

# Verificar se já é um repositório Git
if (Test-Path ".git") {
    Write-Host "Repositório Git encontrado. Atualizando..." -ForegroundColor Blue
    
    try {
        # Tentar fazer pull da branch main
        git pull origin main
        Write-Host "Atualização concluída com sucesso!" -ForegroundColor Green
    }
    catch {
        Write-Host "Erro ao fazer pull da branch main. Tentando master..." -ForegroundColor Yellow
        try {
            git pull origin master
            Write-Host "Atualização concluída com sucesso!" -ForegroundColor Green
        }
        catch {
            Write-Host "Erro ao atualizar repositório." -ForegroundColor Red
            Write-Host "Verifique se você tem acesso ao repositório." -ForegroundColor Red
        }
    }
} else {
    Write-Host "Repositório Git não encontrado." -ForegroundColor Yellow
    Write-Host "Por favor, forneça a URL do seu repositório GitHub:" -ForegroundColor Cyan
    
    $repoUrl = Read-Host "URL do repositório"
    
    if ($repoUrl) {
        try {
            Write-Host "Clonando repositório..." -ForegroundColor Blue
            git clone $repoUrl .
            Write-Host "Repositório clonado com sucesso!" -ForegroundColor Green
        }
        catch {
            Write-Host "Erro ao clonar repositório." -ForegroundColor Red
            Write-Host "Verifique se a URL está correta e se você tem acesso." -ForegroundColor Red
        }
    } else {
        Write-Host "Nenhuma URL fornecida. Saindo..." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Processo concluído!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Read-Host "Pressione Enter para sair"