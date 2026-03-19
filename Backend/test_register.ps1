$body = @{
    name = "Admin User"
    email = "admin@test.com"
    password = "password123"
    role = "admin"
} | ConvertTo-Json

$response = Invoke-WebRequest -Method POST -Uri http://localhost:3001/auth/register -ContentType "application/json" -Body $body
Write-Host "Status Code:" $response.StatusCode
Write-Host "Response:" $response.Content
