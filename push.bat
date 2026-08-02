@echo off
cd /d "%~dp0"
set /p msg="Pesan commit (kosongin buat pake default): "
if "%msg%"=="" set msg=update

git add .
git commit -m "%msg%"
git push

echo.
echo Selesai. Tekan tombol apa aja buat nutup.
pause >nul
