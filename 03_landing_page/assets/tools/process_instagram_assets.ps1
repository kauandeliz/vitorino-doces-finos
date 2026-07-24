Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"

$workspace = Resolve-Path (Join-Path $PSScriptRoot "..\..\..")
$sourceDir = $workspace.Path
$galleryDir = Join-Path $workspace.Path "03_landing_page\assets\img\gallery"
$brandDir = Join-Path $workspace.Path "03_landing_page\assets\img\brand"
$manifestPath = Join-Path $galleryDir "manifest.csv"
$logoPath = Join-Path $brandDir "vitorino-logo.png"

New-Item -ItemType Directory -Force -Path $galleryDir, $brandDir | Out-Null

function Save-Jpeg {
  param(
    [Parameter(Mandatory=$true)][System.Drawing.Bitmap]$Bitmap,
    [Parameter(Mandatory=$true)][string]$Path,
    [int]$Quality = 88
  )

  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq "image/jpeg" }
  $params = New-Object System.Drawing.Imaging.EncoderParameters 1
  $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality,
    [int64]$Quality
  )
  $Bitmap.Save($Path, $codec, $params)
  $params.Dispose()
}

function Get-Stats {
  param([System.Drawing.Bitmap]$Bitmap)

  $stepX = [Math]::Max(1, [int]($Bitmap.Width / 40))
  $stepY = [Math]::Max(1, [int]($Bitmap.Height / 40))
  $sum = 0.0
  $sumSq = 0.0
  $count = 0

  for ($y = 0; $y -lt $Bitmap.Height; $y += $stepY) {
    for ($x = 0; $x -lt $Bitmap.Width; $x += $stepX) {
      $p = $Bitmap.GetPixel($x, $y)
      $b = (0.299 * $p.R) + (0.587 * $p.G) + (0.114 * $p.B)
      $sum += $b
      $sumSq += $b * $b
      $count++
    }
  }

  $avg = $sum / $count
  $variance = ($sumSq / $count) - ($avg * $avg)
  $sd = [Math]::Sqrt([Math]::Max(0, $variance))
  return [PSCustomObject]@{ Average = $avg; StdDev = $sd }
}

function New-CropBitmap {
  param(
    [System.Drawing.Image]$Image,
    [int]$X,
    [int]$Y,
    [int]$Width,
    [int]$Height
  )

  $bmp = New-Object System.Drawing.Bitmap $Width, $Height
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($Image, 0, 0, (New-Object System.Drawing.Rectangle $X, $Y, $Width, $Height), [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  return $bmp
}

function New-StandardImage {
  param(
    [System.Drawing.Bitmap]$Source,
    [System.Drawing.Image]$Logo,
    [bool]$CoverBottomRight
  )

  $targetW = 1080
  $targetH = 1350
  $targetAspect = $targetW / $targetH
  $sourceAspect = $Source.Width / $Source.Height

  if ($sourceAspect -gt $targetAspect) {
    $cropH = $Source.Height
    $cropW = [int]($cropH * $targetAspect)
    $cropX = [int](($Source.Width - $cropW) / 2)
    $cropY = 0
  } else {
    $cropW = $Source.Width
    $cropH = [int]($cropW / $targetAspect)
    $cropX = 0
    $cropY = [int](($Source.Height - $cropH) / 2)
  }

  $out = New-Object System.Drawing.Bitmap $targetW, $targetH
  $g = [System.Drawing.Graphics]::FromImage($out)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear([System.Drawing.Color]::FromArgb(11, 11, 13))

  $cropRect = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropW, $cropH
  $destRect = New-Object System.Drawing.Rectangle 0, 0, $targetW, $targetH
  $g.DrawImage($Source, $destRect, $cropRect, [System.Drawing.GraphicsUnit]::Pixel)

  $g.FillRectangle((New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(28, 0, 0, 0))), 0, 0, $targetW, $targetH)

  $topBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Rectangle 0, 0, $targetW, 260),
    [System.Drawing.Color]::FromArgb(95, 0, 0, 0),
    [System.Drawing.Color]::FromArgb(0, 0, 0, 0),
    [System.Drawing.Drawing2D.LinearGradientMode]::Vertical
  )
  $g.FillRectangle($topBrush, 0, 0, $targetW, 260)
  $topBrush.Dispose()

  $bottomBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Rectangle 0, ($targetH - 320), $targetW, 320),
    [System.Drawing.Color]::FromArgb(0, 0, 0, 0),
    [System.Drawing.Color]::FromArgb(118, 0, 0, 0),
    [System.Drawing.Drawing2D.LinearGradientMode]::Vertical
  )
  $g.FillRectangle($bottomBrush, 0, ($targetH - 320), $targetW, 320)
  $bottomBrush.Dispose()

  if ($Logo -ne $null) {
    $logoSize = 154
    $logoX = $targetW - $logoSize - 34
    $logoY = 34
    $cornerBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(218, 11, 11, 13))
    $g.FillRectangle($cornerBrush, ($targetW - 270), 0, 270, 230)
    $cornerBrush.Dispose()
    $badgeBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(235, 11, 11, 13))
    $g.FillEllipse($badgeBrush, $logoX - 12, $logoY - 12, $logoSize + 24, $logoSize + 24)
    $badgeBrush.Dispose()
    $g.DrawImage($Logo, $logoX, $logoY, $logoSize, $logoSize)
  }

  if ($CoverBottomRight) {
    $patchBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(218, 11, 11, 13))
    $g.FillRectangle($patchBrush, ($targetW - 540), ($targetH - 450), 540, 450)
    $patchBrush.Dispose()
  }

  $g.Dispose()
  return $out
}

function Get-Grid {
  param([int]$Width, [int]$Height, [string]$Name)

  if ($Name -like "*184801*" -or $Name -like "*184810*") {
    return $null
  }

  $cols = [Math]::Round($Width / 350)
  if ($cols -lt 3) { $cols = 3 }
  if ($cols -gt 4) { $cols = 4 }

  $rows = 1
  if ($Height -gt 760) {
    $rows = 2
  }

  return [PSCustomObject]@{ Cols = [int]$cols; Rows = [int]$rows }
}

if (Test-Path $logoPath) {
  Remove-Item $logoPath -Force
}

$profile = Join-Path $sourceDir "Captura de tela 2026-07-23 184810.png"
$profileImage = [System.Drawing.Image]::FromFile($profile)
$logoCrop = New-CropBitmap -Image $profileImage -X 58 -Y 118 -Width 200 -Height 200
$logoCrop.Save($logoPath, [System.Drawing.Imaging.ImageFormat]::Png)
$profileImage.Dispose()
$logoCrop.Dispose()

$logoImage = [System.Drawing.Image]::FromFile($logoPath)
$manifestRows = New-Object System.Collections.Generic.List[object]

Get-ChildItem -LiteralPath $sourceDir -Filter "*.png" -File |
  Where-Object { $_.Name -like "Captura de tela 2026-07-23*.png" } |
  Sort-Object Name |
  ForEach-Object {
    $source = $_
    $image = [System.Drawing.Image]::FromFile($source.FullName)
    try {
      $grid = Get-Grid -Width $image.Width -Height $image.Height -Name $source.Name
      if ($grid -eq $null) {
        return
      }

      $base = [regex]::Match($source.Name, "(\d{6})").Groups[1].Value
      $cellW = [Math]::Floor($image.Width / $grid.Cols)
      $cellH = [Math]::Floor($image.Height / $grid.Rows)

      for ($row = 0; $row -lt $grid.Rows; $row++) {
        for ($col = 0; $col -lt $grid.Cols; $col++) {
          $x = [int]($col * $cellW)
          $y = [int]($row * $cellH)
          $w = if ($col -eq ($grid.Cols - 1)) { $image.Width - $x } else { $cellW }
          $h = if ($row -eq ($grid.Rows - 1)) { $image.Height - $y } else { $cellH }

          $margin = 8
          $crop = New-CropBitmap -Image $image -X ($x + $margin) -Y ($y + $margin) -Width ($w - ($margin * 2)) -Height ($h - ($margin * 2))
          $stats = Get-Stats -Bitmap $crop

          if ($stats.Average -lt 10 -and $stats.StdDev -lt 9) {
            $crop.Dispose()
            continue
          }

          $coverBottomRight = ($row -eq ($grid.Rows - 1) -and $col -eq ($grid.Cols - 1))
          $standard = New-StandardImage -Source $crop -Logo $logoImage -CoverBottomRight $coverBottomRight
          $fileName = "vitorino_{0}_r{1}c{2}.jpg" -f $base, ($row + 1), ($col + 1)
          $outPath = Join-Path $galleryDir $fileName
          Save-Jpeg -Bitmap $standard -Path $outPath -Quality 88

          $manifestRows.Add([PSCustomObject]@{
            file = $fileName
            source = $source.Name
            row = $row + 1
            col = $col + 1
            width = 1080
            height = 1350
            avg_brightness = [Math]::Round($stats.Average, 2)
            stddev = [Math]::Round($stats.StdDev, 2)
          })

          $standard.Dispose()
          $crop.Dispose()
        }
      }
    } finally {
      $image.Dispose()
    }
  }

$logoImage.Dispose()
$manifestRows | Export-Csv -Path $manifestPath -NoTypeInformation -Encoding UTF8

Write-Output ("Logo: {0}" -f $logoPath)
Write-Output ("Assets generated: {0}" -f $manifestRows.Count)
Write-Output ("Manifest: {0}" -f $manifestPath)
