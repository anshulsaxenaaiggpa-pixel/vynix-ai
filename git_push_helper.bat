@echo off
echo ==========================================
echo Vynix AI - GitHub Push Helper
echo ==========================================
echo.
echo Current Directory: %CD%
echo.
echo improved: checking if this is a git repo...
if not exist .git (
    echo [ERROR] .git directory not found here! 
    echo Please make sure you are in the 'vynix-ai' folder.
    pause
    exit /b
)

echo [OK] Git repository found.
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g., https://github.com/StartUp/vynix.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] No URL provided. Exiting.
    pause
    exit /b
)

echo.
echo Adding remote origin...
git remote add origin %REPO_URL%
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Remote 'origin' might already exist. Updating it...
    git remote set-url origin %REPO_URL%
)

echo.
echo Renaming branch to main...
git branch -M main

echo.
echo Pushing to GitHub (Forcing new history)...
git push -u origin main --force

echo.
echo ==========================================
echo DONE! If you saw a login prompt, I hope you signed in.
echo ==========================================
pause
