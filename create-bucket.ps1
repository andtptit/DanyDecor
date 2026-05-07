$serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2enFxaW1scGh3aXhpbXpjeHJ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODExNzIwOSwiZXhwIjoyMDkzNjkzMjA5fQ.grz6tMFIYpyESjZpqh5hc55Br3OZqsMz0upPqSIJobI"
$url = "https://wvzqqimlphwiximzcxrx.supabase.co/storage/v1/bucket"
$headers = @{
  "Authorization" = "Bearer $serviceKey"
  "apikey" = $serviceKey
  "Content-Type" = "application/json"
}
$body = '{"id":"product-images","name":"product-images","public":true}'
try {
  $res = Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body $body
  Write-Host "SUCCESS: $($res | ConvertTo-Json)"
} catch {
  $status = $_.Exception.Response.StatusCode.value__
  $msg = $_.ErrorDetails.Message
  Write-Host "STATUS: $status"
  Write-Host "ERROR: $msg"
}
