# Upload Sample Schemes to S3
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Uploading Sample Schemes to S3" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$awsCmd = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"
$bucket = "nexis-knowledge-base-dev"

# Sample scheme 1: PM-KISAN
$scheme1 = @{
    schemeId = "pm-kisan"
    schemeName = "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)"
    description = "Direct income support of Rs. 6,000 per year to farmer families"
    benefits = "Rs. 6,000 per year in three equal installments"
    eligibilityCriteria = @{
        ageMin = 18
        occupations = @("Farmer", "Agricultural Worker")
        states = @()
        gender = @()
        socialCategories = @()
        requiresDisability = $false
    }
    applicationProcess = "Apply online through PM-KISAN portal or visit nearest CSC"
    documents = @("Aadhaar", "Land ownership proof", "Bank account details")
    officialUrl = "https://pmkisan.gov.in"
} | ConvertTo-Json -Depth 10

# Sample scheme 2: PMAY
$scheme2 = @{
    schemeId = "pmay-urban"
    schemeName = "PMAY-Urban (Pradhan Mantri Awas Yojana)"
    description = "Housing for all with interest subsidy on home loans"
    benefits = "Interest subsidy up to Rs. 2.67 lakh on home loans"
    eligibilityCriteria = @{
        ageMin = 18
        incomeMax = 1800000
        occupations = @()
        states = @()
        gender = @()
        socialCategories = @()
        requiresDisability = $false
    }
    applicationProcess = "Apply through lending institutions or PMAY portal"
    documents = @("Aadhaar", "Income certificate", "Property documents")
    officialUrl = "https://pmaymis.gov.in"
} | ConvertTo-Json -Depth 10

# Sample scheme 3: Ayushman Bharat
$scheme3 = @{
    schemeId = "ayushman-bharat"
    schemeName = "Ayushman Bharat PM-JAY"
    description = "Health insurance coverage for economically vulnerable families"
    benefits = "Health cover of Rs. 5 lakh per family per year"
    eligibilityCriteria = @{
        incomeMax = 500000
        occupations = @()
        states = @()
        gender = @()
        socialCategories = @("SC", "ST", "OBC")
        requiresDisability = $false
    }
    applicationProcess = "Visit nearest Ayushman Mitra or CSC"
    documents = @("Aadhaar", "Ration card")
    officialUrl = "https://pmjay.gov.in"
} | ConvertTo-Json -Depth 10

Write-Host "Creating scheme files..." -ForegroundColor Yellow

# Create temp directory
$tempDir = "temp-schemes"
if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Write scheme files
$scheme1 | Out-File -FilePath "$tempDir/pm-kisan.json" -Encoding UTF8
$scheme2 | Out-File -FilePath "$tempDir/pmay-urban.json" -Encoding UTF8
$scheme3 | Out-File -FilePath "$tempDir/ayushman-bharat.json" -Encoding UTF8

Write-Host "  Created 3 scheme files" -ForegroundColor Green
Write-Host ""

# Upload to S3
Write-Host "Uploading to S3..." -ForegroundColor Yellow

& $awsCmd s3 cp "$tempDir/pm-kisan.json" "s3://$bucket/schemes/pm-kisan/metadata.json" --region us-east-1
& $awsCmd s3 cp "$tempDir/pmay-urban.json" "s3://$bucket/schemes/pmay-urban/metadata.json" --region us-east-1
& $awsCmd s3 cp "$tempDir/ayushman-bharat.json" "s3://$bucket/schemes/ayushman-bharat/metadata.json" --region us-east-1

Write-Host "  Uploaded 3 schemes to S3" -ForegroundColor Green
Write-Host ""

# Cleanup
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Sample Schemes Uploaded!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Now test at: http://localhost:3000" -ForegroundColor Yellow
Write-Host "You should see 3 schemes in the results!" -ForegroundColor Yellow
Write-Host ""
pause
