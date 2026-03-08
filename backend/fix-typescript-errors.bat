@echo off
echo Fixing TypeScript errors...
echo.

REM Change to backend directory if not already there
cd /d "%~dp0"

REM Fix eligibility-checker
powershell -Command "(Get-Content 'src\lambda\eligibility-checker\index.ts') -replace 'uuidDate\.now\(\)', 'Date.now()' | Set-Content 'src\lambda\eligibility-checker\index.ts'"

REM Fix chat-assistant
powershell -Command "(Get-Content 'src\lambda\chat-assistant\index.ts') -replace 'uuidDate\.now\(\)', 'Date.now()' | Set-Content 'src\lambda\chat-assistant\index.ts'"

REM Fix ai-explanation
powershell -Command "(Get-Content 'src\lambda\ai-explanation\index.ts') -replace 'uuidDate\.now\(\)', 'Date.now()' | Set-Content 'src\lambda\ai-explanation\index.ts'"

REM Fix profile-manager
powershell -Command "(Get-Content 'src\lambda\profile-manager\index.ts') -replace 'uuidDate\.now\(\)', 'Date.now()' | Set-Content 'src\lambda\profile-manager\index.ts'"

REM Fix scheme-uploader
powershell -Command "(Get-Content 'src\lambda\scheme-uploader\index.ts') -replace 'uuidDate\.now\(\)', 'Date.now()' | Set-Content 'src\lambda\scheme-uploader\index.ts'"

echo.
echo Fixed all TypeScript errors!
echo.
echo Now run: deploy-all.bat dev us-east-1
echo.
pause
