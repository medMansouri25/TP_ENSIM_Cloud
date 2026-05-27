@echo off
setlocal EnableDelayedExpansion

REM ============================================================
REM  Wordle - Lancement local
REM  Double-clic ou ".\start-wordle.bat" dans un terminal
REM ============================================================

set "PATH=%USERPROFILE%\.bun\bin;%PATH%"

cd /d "%~dp0wordle"
if errorlevel 1 (
    echo [ERREUR] Impossible d'acceder au dossier wordle.
    pause
    exit /b 1
)

echo.
echo === Verification de Bun ===
where bun >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Bun n'est pas installe.
    echo Installer : powershell -c "irm bun.sh/install.ps1 ^| iex"
    pause
    exit /b 1
)
bun --version

echo.
echo === Dependances ===
if not exist "node_modules" (
    call bun install
    if errorlevel 1 (
        echo [ERREUR] bun install a echoue.
        pause
        exit /b 1
    )
) else (
    echo node_modules OK
)

echo.
echo === Lancement de l'application ===
if not defined PORT set "PORT=3000"
echo URL : http://localhost:%PORT%
echo Ctrl+C pour arreter
echo.

call bun run dev

echo.
echo === Le serveur s'est arrete ===
pause
endlocal
