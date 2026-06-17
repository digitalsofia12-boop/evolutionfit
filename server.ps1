# Native PowerShell HTTP Server for serving the Plan 21 Días Fit landing page

$port = 8080
$workspace = "c:\Users\Usuario\Downloads\reto 21dias"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "Servidor local iniciado exitosamente."
    Write-Host "Escuchando en: http://localhost:$port/"
    Write-Host "Presiona Ctrl+C en la consola o detén la tarea para finalizar."
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Get relative path and strip query params
        $url = $request.RawUrl.Split('?')[0]
        if ($url -eq "/" -or $url -eq "") {
            $url = "/index.html"
        }
        
        # Replace forward slashes with system directory separator
        $urlPath = $url.Replace("/", [System.IO.Path]::DirectorySeparatorChar)
        if ($urlPath.StartsWith([System.IO.Path]::DirectorySeparatorChar)) {
            $urlPath = $urlPath.Substring(1)
        }
        
        $filePath = [System.IO.Path]::Combine($workspace, $urlPath)
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            # Content Type detection
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            switch ($ext) {
                ".html" { $response.ContentType = "text/html; charset=utf-8" }
                ".css"  { $response.ContentType = "text/css; charset=utf-8" }
                ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
                ".png"  { $response.ContentType = "image/png" }
                ".jpg"  { $response.ContentType = "image/jpeg" }
                ".jpeg" { $response.ContentType = "image/jpeg" }
                ".gif"  { $response.ContentType = "image/gif" }
                ".svg"  { $response.ContentType = "image/svg+xml" }
                ".ico"  { $response.ContentType = "image/x-icon" }
                default { $response.ContentType = "application/octet-stream" }
            }
            
            # Allow CORS for local debugging if necessary
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            Write-Host "404 - No encontrado: $url"
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 - Archivo no encontrado</h1>")
            $response.ContentType = "text/html; charset=utf-8"
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        
        $response.Close()
    }
} catch {
    Write-Host "Error en el servidor: $_"
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
}
