# PowerShell script to push Legal Case Management System to GitHub
Param(
    [string]$RepoUrl = "https://github.com/jeevars07/LEGAL_CASE_MANAGEMENT_SYSTEM.git"
)

Write-Host "Initializing Git Repository for $RepoUrl..." -ForegroundColor Cyan
git init
git add .
git commit -m "Initial commit: Legal Case Management System v1.0"
git branch -M main
git remote remove origin 2>$null
git remote add origin $RepoUrl
git push -u origin main

Write-Host "Successfully pushed project to GitHub!" -ForegroundColor Green
