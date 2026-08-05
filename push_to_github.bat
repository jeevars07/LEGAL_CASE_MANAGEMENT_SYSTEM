@echo off
echo ========================================================
echo Pushing Legal Case Management System to GitHub...
echo Repository: https://github.com/jeevars07/LEGAL_CASE_MANAGEMENT_SYSTEM.git
echo ========================================================

git init
git add .
git commit -m "Initial commit: Legal Case Management System v1.0"
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/jeevars07/LEGAL_CASE_MANAGEMENT_SYSTEM.git
git push -u origin main

echo.
echo ========================================================
echo Push complete! Check your repository at:
echo https://github.com/jeevars07/LEGAL_CASE_MANAGEMENT_SYSTEM
echo ========================================================
pause
