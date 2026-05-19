param(
  [Parameter(Mandatory = $false)]
  [string]$Message = "chore: update dashboard"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "Checking repository status..."
$insideRepo = git rev-parse --is-inside-work-tree 2>$null
if ($LASTEXITCODE -ne 0 -or $insideRepo -ne "true") {
  throw "Current folder is not a git repository."
}

Write-Host "Staging changes..."
git add .

$hasDiff = git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
  Write-Host "No changes to commit."
  exit 0
}

Write-Host "Creating commit..."
git commit -m "$Message"

Write-Host "Pushing to origin/main..."
git push origin main

Write-Host "Done. GitHub Pages deployment workflow should run automatically."
