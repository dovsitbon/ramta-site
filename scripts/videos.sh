#!/usr/bin/env bash
# Boucles vidéo silencieuses pour le site, coupées dans les reels Instagram (assets/reels/, non versionnés).
# ffmpeg : celui de imageio-ffmpeg (pip install imageio-ffmpeg) ou n'importe quel ffmpeg du PATH.
#   bash scripts/videos.sh
set -euo pipefail
cd "$(dirname "$0")/.."
FF="${FFMPEG:-ffmpeg}"
R=assets/reels
O=public/media/video
mkdir -p "$O"
ENC=(-an -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p -movflags +faststart)
SC="scale=540:-2,fps=30"

# Terrasse fleurie au coucher du soleil (2 plans)
"$FF" -loglevel error -y -i "$R/De4h9PnNRsN.mp4" -filter_complex \
  "[0:v]trim=2.0:3.9,setpts=PTS-STARTPTS,$SC[a];[0:v]trim=13.2:15.9,setpts=PTS-STARTPTS,$SC[b];[a][b]concat=n=2:v=1[v]" \
  -map "[v]" "${ENC[@]}" "$O/hero.mp4"

# Soirée : guirlandes sur la terrasse puis guitare live
"$FF" -loglevel error -y -i "$R/DdwfRSrtsFS.mp4" -filter_complex \
  "[0:v]trim=4.2:7.2,setpts=PTS-STARTPTS,$SC[a];[0:v]trim=12.0:14.0,setpts=PTS-STARTPTS,$SC[b];[a][b]concat=n=2:v=1[v]" \
  -map "[v]" "${ENC[@]}" "$O/soir.mp4"

# Cuisine : sauce sur le sandwich de bœuf effiloché
"$FF" -loglevel error -y -ss 2.3 -t 4.3 -i "$R/DemheWHNrNT.mp4" -vf "$SC" "${ENC[@]}" "$O/cuisine.mp4"

ls -la "$O"
