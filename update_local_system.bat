@echo off
echo ========================================
echo Atualizando sistema local com GitHub
echo ========================================

:: Navegar para o diretório local
cd /d "C:\Users\leand\OneDrive\Documentos\NFA\SFA_2025"

echo Verificando se o diretório existe...
if not exist "C:\Users\leand\OneDrive\Documentos\NFA\SFA_2025" (
    echo Diretório não encontrado. Criando...
    mkdir "C:\Users\leand\OneDrive\Documentos\NFA\SFA_2025"
)

:: Verificar se já é um repositório Git
if exist ".git" (
    echo Repositório Git encontrado. Atualizando...
    git pull origin main
    if errorlevel 1 (
        echo Tentando com branch master...
        git pull origin master
    )
) else (
    echo Repositório Git não encontrado.
    echo Por favor, forneça a URL do seu repositório GitHub:
    set /p repo_url="URL do repositório: "
    if not "%repo_url%"=="" (
        echo Clonando repositório...
        git clone %repo_url% .
    ) else (
        echo Nenhuma URL fornecida. Saindo...
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo Atualização concluída!
echo ========================================
pause