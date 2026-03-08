# Upload Production Schemes to S3 with Full Data
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Uploading Production Schemes to S3" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$awsCmd = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"
$bucket = "nexis-knowledge-base-dev"
$region = "us-east-1"

# Create temp directory
$tempDir = "production-schemes"
if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

Write-Host "Creating comprehensive scheme database..." -ForegroundColor Yellow
Write-Host ""

# Define all schemes with complete data
$schemes = @(
    @{
        schemeId = "pm-kisan"
        schemeName = "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)"
        description = "Direct income support scheme providing Rs. 6,000 per year to all landholding farmer families across India to supplement their financial needs for procuring various inputs and other needs."
        benefits = "Rs. 6,000 per year paid in three equal installments of Rs. 2,000 each directly into bank accounts"
        eligibilityCriteria = @{
            ageMin = 18
            occupations = @("Farmer", "Agricultural Worker")
            states = @()
            gender = @()
            socialCategories = @()
            requiresDisability = $false
        }
        applicationProcess = "Apply online at pmkisan.gov.in or visit nearest Common Service Centre (CSC) with land records and Aadhaar"
        documents = @("Aadhaar Card", "Land Ownership Documents", "Bank Account Details", "Passport Size Photo")
        officialUrl = "https://pmkisan.gov.in"
        category = "Agriculture"
        ministry = "Ministry of Agriculture and Farmers Welfare"
    },
    @{
        schemeId = "pmay-urban"
        schemeName = "PMAY-Urban (Pradhan Mantri Awas Yojana - Urban)"
        description = "Housing for All mission providing interest subsidy on home loans for economically weaker sections, low income groups, and middle income groups to purchase or construct houses in urban areas."
        benefits = "Interest subsidy up to Rs. 2.67 lakh on home loans, with loan amounts up to Rs. 12 lakh for EWS/LIG categories"
        eligibilityCriteria = @{
            ageMin = 18
            incomeMax = 1800000
            occupations = @()
            states = @()
            gender = @()
            socialCategories = @()
            requiresDisability = $false
        }
        applicationProcess = "Apply through lending institutions (banks/HFCs) or online at pmaymis.gov.in"
        documents = @("Aadhaar Card", "Income Certificate", "Property Documents", "Bank Statements", "Employment Proof")
        officialUrl = "https://pmaymis.gov.in"
        category = "Housing"
        ministry = "Ministry of Housing and Urban Affairs"
    },
    @{
        schemeId = "ayushman-bharat"
        schemeName = "Ayushman Bharat PM-JAY"
        description = "World's largest health insurance scheme providing free health coverage of Rs. 5 lakh per family per year for secondary and tertiary care hospitalization to over 50 crore beneficiaries."
        benefits = "Health insurance cover of Rs. 5 lakh per family per year for hospitalization, covering 1,393 procedures including pre and post-hospitalization expenses"
        eligibilityCriteria = @{
            incomeMax = 500000
            occupations = @()
            states = @()
            gender = @()
            socialCategories = @("SC", "ST", "OBC")
            requiresDisability = $false
        }
        applicationProcess = "Visit nearest Ayushman Mitra at empanelled hospitals or Common Service Centre with family details"
        documents = @("Aadhaar Card", "Ration Card", "SECC 2011 Data", "Mobile Number")
        officialUrl = "https://pmjay.gov.in"
        category = "Healthcare"
        ministry = "Ministry of Health and Family Welfare"
    },
    @{
        schemeId = "nsap-old-age"
        schemeName = "Indira Gandhi National Old Age Pension Scheme"
        description = "Monthly pension for elderly citizens living below poverty line to ensure minimum income security in old age."
        benefits = "Rs. 200-500 per month pension (varies by state and age), with central contribution of Rs. 200 for 60-79 years and Rs. 500 for 80+ years"
        eligibilityCriteria = @{
            ageMin = 60
            incomeMax = 200000
            occupations = @()
            states = @()
            gender = @()
            socialCategories = @()
            requiresDisability = $false
        }
        applicationProcess = "Apply through local Panchayat/Municipal office or online state portal with age and income proof"
        documents = @("Aadhaar Card", "Age Proof (Birth Certificate/School Certificate)", "Income Certificate", "Bank Account Details", "BPL Card")
        officialUrl = "https://nsap.nic.in"
        category = "Social Security"
        ministry = "Ministry of Rural Development"
    },
    @{
        schemeId = "post-matric-sc-st"
        schemeName = "Post Matric Scholarship for SC/ST Students"
        description = "Financial assistance to SC/ST students pursuing post-matriculation or post-secondary education to enable them to complete their education."
        benefits = "Full tuition fees plus maintenance allowance ranging from Rs. 380 to Rs. 1,200 per month depending on course and hostel/day scholar status"
        eligibilityCriteria = @{
            ageMin = 16
            ageMax = 35
            incomeMax = 250000
            occupations = @("Student")
            states = @()
            gender = @()
            socialCategories = @("SC", "ST")
            requiresDisability = $false
        }
        applicationProcess = "Apply through National Scholarship Portal (scholarships.gov.in) before deadline with admission proof and caste certificate"
        documents = @("Aadhaar Card", "Caste Certificate (SC/ST)", "Income Certificate", "Admission Proof", "Previous Year Marksheet", "Bank Account Details")
        officialUrl = "https://scholarships.gov.in"
        category = "Education"
        ministry = "Ministry of Social Justice and Empowerment / Ministry of Tribal Affairs"
    },
    @{
        schemeId = "mudra-yojana"
        schemeName = "Pradhan Mantri MUDRA Yojana"
        description = "Provides loans up to Rs. 10 lakh to non-corporate, non-farm small/micro enterprises for income generating activities in manufacturing, trading and service sectors."
        benefits = "Collateral-free loans: Shishu (up to Rs. 50,000), Kishore (Rs. 50,001 to Rs. 5 lakh), Tarun (Rs. 5 lakh to Rs. 10 lakh)"
        eligibilityCriteria = @{
            ageMin = 18
            occupations = @("Self-Employed", "Artisan", "Other")
            states = @()
            gender = @()
            socialCategories = @()
            requiresDisability = $false
        }
        applicationProcess = "Apply through any bank, NBFC, or MFI with business plan and required documents"
        documents = @("Aadhaar Card", "PAN Card", "Business Plan", "Address Proof", "Bank Statements", "Quotations for Equipment")
        officialUrl = "https://www.mudra.org.in"
        category = "Employment"
        ministry = "Ministry of Finance"
    },
    @{
        schemeId = "sukanya-samriddhi"
        schemeName = "Sukanya Samriddhi Yojana"
        description = "Small deposit scheme for girl child offering high interest rate and tax benefits to secure financial future for education and marriage expenses."
        benefits = "8.2% interest rate (compounded annually), tax benefits under Section 80C, maturity after 21 years or marriage after 18 years"
        eligibilityCriteria = @{
            ageMin = 0
            ageMax = 10
            occupations = @()
            states = @()
            gender = @("Female")
            socialCategories = @()
            requiresDisability = $false
        }
        applicationProcess = "Open account at any post office or authorized bank with minimum Rs. 250 deposit"
        documents = @("Girl Child Birth Certificate", "Parent's Aadhaar Card", "Address Proof", "Passport Size Photos")
        officialUrl = "https://www.nsiindia.gov.in"
        category = "Savings"
        ministry = "Ministry of Finance"
    },
    @{
        schemeId = "pmegp"
        schemeName = "Prime Minister's Employment Generation Programme (PMEGP)"
        description = "Credit-linked subsidy programme for generating self-employment opportunities through establishment of micro-enterprises in non-farm sector."
        benefits = "15-35% subsidy on project cost (up to Rs. 25 lakh for manufacturing, Rs. 10 lakh for service sector)"
        eligibilityCriteria = @{
            ageMin = 18
            occupations = @("Unemployed", "Self-Employed")
            states = @()
            gender = @()
            socialCategories = @()
            requiresDisability = $false
        }
        applicationProcess = "Apply online at kviconline.gov.in with project report and required documents"
        documents = @("Aadhaar Card", "Educational Certificates", "Caste Certificate (if applicable)", "Project Report", "Bank Account Details")
        officialUrl = "https://www.kviconline.gov.in"
        category = "Employment"
        ministry = "Ministry of Micro, Small and Medium Enterprises"
    },
    @{
        schemeId = "atal-pension"
        schemeName = "Atal Pension Yojana"
        description = "Pension scheme for unorganized sector workers providing guaranteed minimum pension of Rs. 1,000 to Rs. 5,000 per month after age 60."
        benefits = "Guaranteed monthly pension from Rs. 1,000 to Rs. 5,000 based on contribution amount, with government co-contribution for eligible subscribers"
        eligibilityCriteria = @{
            ageMin = 18
            ageMax = 40
            occupations = @()
            states = @()
            gender = @()
            socialCategories = @()
            requiresDisability = $false
        }
        applicationProcess = "Enroll through any bank where you have savings account, with Aadhaar and mobile number"
        documents = @("Aadhaar Card", "Bank Account Details", "Mobile Number", "Nominee Details")
        officialUrl = "https://npscra.nsdl.co.in/atal-pension-yojana.php"
        category = "Pension"
        ministry = "Ministry of Finance"
    },
    @{
        schemeId = "pmjdy"
        schemeName = "Pradhan Mantri Jan Dhan Yojana"
        description = "Financial inclusion programme ensuring access to financial services like banking, savings, deposit accounts, remittance, credit, insurance, and pension."
        benefits = "Zero balance account, RuPay debit card, Rs. 10,000 overdraft facility, Rs. 2 lakh accident insurance cover"
        eligibilityCriteria = @{
            ageMin = 10
            occupations = @()
            states = @()
            gender = @()
            socialCategories = @()
            requiresDisability = $false
        }
        applicationProcess = "Visit any bank branch with Aadhaar and one photograph to open account instantly"
        documents = @("Aadhaar Card", "Passport Size Photograph", "Mobile Number")
        officialUrl = "https://pmjdy.gov.in"
        category = "Financial Inclusion"
        ministry = "Ministry of Finance"
    }
)

Write-Host "Creating $($schemes.Count) scheme files..." -ForegroundColor Yellow

$count = 0
foreach ($scheme in $schemes) {
    $schemeJson = $scheme | ConvertTo-Json -Depth 10
    $fileName = "$tempDir/$($scheme.schemeId).json"
    # Use UTF8 without BOM
    [System.IO.File]::WriteAllText($fileName, $schemeJson, [System.Text.UTF8Encoding]::new($false))
    $count++
}

Write-Host "  Created $count scheme files" -ForegroundColor Green
Write-Host ""

# Upload to S3
Write-Host "Uploading schemes to S3..." -ForegroundColor Yellow

$uploaded = 0
foreach ($scheme in $schemes) {
    $localFile = "$tempDir/$($scheme.schemeId).json"
    $s3Key = "schemes/$($scheme.schemeId)/metadata.json"
    
    & $awsCmd s3 cp $localFile "s3://$bucket/$s3Key" --region $region 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Uploaded: $($scheme.schemeName)" -ForegroundColor Green
        $uploaded++
    } else {
        Write-Host "  Failed: $($scheme.schemeName)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "  Total uploaded: $uploaded/$count schemes" -ForegroundColor Green
Write-Host ""

# Cleanup
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Production Schemes Uploaded!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Schemes uploaded:" -ForegroundColor Yellow
Write-Host "  - Agriculture: PM-KISAN" -ForegroundColor White
Write-Host "  - Housing: PMAY-Urban" -ForegroundColor White
Write-Host "  - Healthcare: Ayushman Bharat" -ForegroundColor White
Write-Host "  - Social Security: Old Age Pension" -ForegroundColor White
Write-Host "  - Education: SC/ST Scholarship" -ForegroundColor White
Write-Host "  - Employment: MUDRA, PMEGP" -ForegroundColor White
Write-Host "  - Savings: Sukanya Samriddhi" -ForegroundColor White
Write-Host "  - Pension: Atal Pension Yojana" -ForegroundColor White
Write-Host "  - Financial: Jan Dhan Yojana" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test at http://localhost:3000" -ForegroundColor White
Write-Host "2. Complete questionnaire to see real schemes" -ForegroundColor White
Write-Host "3. Bedrock AI will provide explanations" -ForegroundColor White
Write-Host ""
pause
