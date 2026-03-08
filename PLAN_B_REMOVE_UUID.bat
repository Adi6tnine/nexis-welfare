@echo off
echo ========================================
echo PLAN B: Remove UUID Dependency
echo ========================================
cd backend\src\lambda\eligibility-checker
echo Fixing eligibility-checker...
powershell -Command "(Get-Content index.ts) -replace 'import.*uuid.*', '// UUID removed' -replace 'v4\(\)', 'Date.now().toString() + Math.random().toString(36)' | Set-Content index.ts"

cd ..\profile-manager
echo Fixing profile-manager...
powershell -Command "(Get-Content index.ts) -replace 'import.*uuid.*', '// UUID removed' -replace 'v4\(\)', 'Date.now().toString() + Math.random().toString(36)' | Set-Content index.ts"

cd ..\scheme-uploader
echo Fixing scheme-uploader...
powershell -Command "(Get-Content index.ts) -replace 'import.*uuid.*', '// UUID removed' -replace 'v4\(\)', 'Date.now().toString() + Math.random().toString(36)' | Set-Content index.ts"

cd ..\chat-assistant
echo Fixing chat-assistant...
powershell -Command "(Get-Content index.ts) -replace 'import.*uuid.*', '// UUID removed' -replace 'v4\(\)', 'Date.now().toString() + Math.random().toString(36)' | Set-Content index.ts"

cd ..\ai-explanation
echo Fixing ai-explanation...
powershell -Command "(Get-Content index.ts) -replace 'import.*uuid.*', '// UUID removed' -replace 'v4\(\)', 'Date.now().toString() + Math.random().toString(36)' | Set-Content index.ts"

cd ..\..\..
echo.
echo Now rebuild: npm run build
echo Then zip and upload
pause
