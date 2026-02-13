# Script to automatically push Drizzle schema to Supabase
# This script simulates pressing the down arrow and enter to select "Yes"

$process = Start-Process -FilePath "npx" -ArgumentList "drizzle-kit", "push" -NoNewWindow -PassThru -Wait
