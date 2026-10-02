# Script to assemble the complete production index.html
import os

html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Muscle Hut Gym | Sector 15, Sonipat | Forge Your Beast</title>
  <meta name="description" content="The Muscle Hut Gym - Premier fitness destination in Sector 15, Sonipat, Haryana. High-end bio-mechanical equipment, certified trainers, group aerobics, functional turf, and ₹1,500/month plans.">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300ff66'><path d='M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43 1.43 1.43 2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29l-1.43-1.43z'/></svg>">
  
  <!-- Google Fonts: Bebas Neue, Anton, Oswald, Outfit, Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&family=Oswald:wght@500;600;700&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  
  <!-- Font Awesome 6 Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
'''

print("Length of start:", len(html_content))
