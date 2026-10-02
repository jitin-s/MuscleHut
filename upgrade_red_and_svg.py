# upgrade_red_and_svg.py
# Transforms The Muscle Hut Gym site to Electric Crimson Red, replaces all FontAwesome icons
# with high-performance inline SVG symbols, optimizes loading speed, and adds custom SVG logos.

import re
import os

SVG_SYMBOLS = '''  <!-- SVG ICON SPRITE (Zero External Dependencies, Instant 0ms Local & Offline Load) -->
  <svg xmlns="http://www.w3.org/2000/svg" style="display: none;" aria-hidden="true">
    <symbol id="icon-dumbbell" viewBox="0 0 24 24">
      <path fill="currentColor" d="M21 9h-2V7a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v3H8V7a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v2H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-3h8v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2h2a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1zm-17 4v-2h1v2H4zm3 2V9h1v6H7zm10 0V9h1v6h-1zm3-2h-1v-2h1v2z"/>
    </symbol>
    <symbol id="icon-fire" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 2c.4 2.8-1 4.5-2.2 6.1C8.7 9.5 8 11.2 8 13.5 8 16.5 10 19 12.5 19s4.5-2.5 4.5-5.5c0-1.8-.7-3.3-1.6-4.5C14.7 7.7 14 6.2 14.2 4c2.8 1.4 5.8 4.7 5.8 9.5 0 4.4-3.6 8-8 8s-8-3.6-8-8c0-5 3.5-9.3 8-11.5z"/>
    </symbol>
    <symbol id="icon-bolt" viewBox="0 0 24 24">
      <path fill="currentColor" d="M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78C8.48 10.94 10.42 7.54 13 3h1l-1 7h4.5c.57 0 .7.43.34.82L11 21z"/>
    </symbol>
    <symbol id="icon-users" viewBox="0 0 24 24">
      <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </symbol>
    <symbol id="icon-running" viewBox="0 0 24 24">
      <path fill="currentColor" d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/>
    </symbol>
    <symbol id="icon-heart-pulse" viewBox="0 0 24 24">
      <path fill="currentColor" d="M19.5 3a4.5 4.5 0 0 0-3.9 2.25A4.5 4.5 0 0 0 7.5 3 4.5 4.5 0 0 0 3 7.5c0 4.28 4.2 7.72 10.5 13.43.3.27.7.42 1.1.42s.8-.15 1.1-.42C21.8 15.22 26 11.78 26 7.5A4.5 4.5 0 0 0 21.5 3h-2zm-6.2 13.4l-1.8-3.4h-2.1l-.9 1.7H6.5v-1.5h1.3l1.6-3.1c.2-.4.7-.6 1.1-.5.4.1.7.5.8.9l1.1 2h2.2l1.6-4.5c.2-.4.6-.7 1.1-.7.4 0 .8.3 1 .7l1.7 5.1h2v1.5h-2.8l-1.2-3.6-1.5 4.2c-.2.4-.6.7-1 .7s-.8-.3-.9-.7z"/>
    </symbol>
    <symbol id="icon-check" viewBox="0 0 24 24">
      <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </symbol>
    <symbol id="icon-circle-check" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </symbol>
    <symbol id="icon-clock" viewBox="0 0 24 24">
      <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
    </symbol>
    <symbol id="icon-location-dot" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </symbol>
    <symbol id="icon-star" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </symbol>
    <symbol id="icon-calendar-days" viewBox="0 0 24 24">
      <path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z"/>
    </symbol>
    <symbol id="icon-calendar-check" viewBox="0 0 24 24">
      <path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM10.56 16.44l-3-3 1.41-1.41 1.59 1.59 4.59-4.59 1.41 1.41z"/>
    </symbol>
    <symbol id="icon-trophy" viewBox="0 0 24 24">
      <path fill="currentColor" d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H8v2h8v-2h-3v-3.1c1.8-.3 3.32-1.43 3.99-3.06C19.4 12.54 21 10.48 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
    </symbol>
    <symbol id="icon-medal" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 2a5 5 0 0 0-5 5c0 1.91 1.07 3.57 2.66 4.42L7 21l5-3 5 3-2.66-9.58A4.996 4.996 0 0 0 17 7a5 5 0 0 0-5-5zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
    </symbol>
    <symbol id="icon-shield" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
    </symbol>
    <symbol id="icon-shield-halved" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12z"/>
    </symbol>
    <symbol id="icon-whatsapp" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.41a8.17 8.17 0 0 1 2.4 5.83c0 4.54-3.7 8.24-8.24 8.24-1.45 0-2.87-.38-4.12-1.11l-.3-.17-3.12.82.83-3.04-.19-.31a8.188 8.188 0 0 1-1.26-4.43c0-4.54 3.69-8.24 8.24-8.24m4.52 11.51c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/>
    </symbol>
    <symbol id="icon-phone" viewBox="0 0 24 24">
      <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </symbol>
    <symbol id="icon-volume-high" viewBox="0 0 24 24">
      <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </symbol>
    <symbol id="icon-volume-xmark" viewBox="0 0 24 24">
      <path fill="currentColor" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27l4.73 4.73H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
    </symbol>
    <symbol id="icon-arrow-right" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
    </symbol>
    <symbol id="icon-arrow-up" viewBox="0 0 24 24">
      <path fill="currentColor" d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8z"/>
    </symbol>
    <symbol id="icon-angle-right" viewBox="0 0 24 24">
      <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
    </symbol>
    <symbol id="icon-xmark" viewBox="0 0 24 24">
      <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </symbol>
    <symbol id="icon-instagram" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.79-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </symbol>
    <symbol id="icon-facebook" viewBox="0 0 24 24">
      <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </symbol>
    <symbol id="icon-youtube" viewBox="0 0 24 24">
      <path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </symbol>
    <symbol id="icon-linkedin" viewBox="0 0 24 24">
      <path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.59 1.59 0 1 0-.02-3.18 1.59 1.59 0 0 0 .02 3.18M5.07 18.5h2.79v-8.37H5.07v8.37z"/>
    </symbol>
    <symbol id="icon-chevron-left" viewBox="0 0 24 24">
      <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
    </symbol>
    <symbol id="icon-chevron-right" viewBox="0 0 24 24">
      <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
    </symbol>
    <symbol id="icon-arrows-left-right" viewBox="0 0 24 24">
      <path fill="currentColor" d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/>
    </symbol>
    <symbol id="icon-calculator" viewBox="0 0 24 24">
      <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 16H7v-2h10v2zm0-4H7v-2h10v2zm0-4H7V7h10v4z"/>
    </symbol>
    <symbol id="icon-music" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
    </symbol>
    <symbol id="icon-mitten" viewBox="0 0 24 24">
      <path fill="currentColor" d="M19 13.5V8a4 4 0 0 0-8 0v1.2a4.49 4.49 0 0 0-4 4.3V15c0 1.48.81 2.77 2 3.46V21a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-2.54c1.19-.69 2-1.98 2-3.46v-1.5z"/>
    </symbol>
    <symbol id="icon-spa" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 3c-1.5 2.5-3 5-3 7.5a3 3 0 0 0 6 0c0-2.5-1.5-5-3-7.5zm-5 6.5C5.8 11.2 5 13 5 15a4 4 0 0 0 8 0c0-1-.2-2-.6-3-1.4 1.3-3.2 2-5.4 2-1.2 0-2.4-.2-3.4-.6.7-1.4 1.8-2.6 3.4-3.9zm10 0c1.6 1.3 2.7 2.5 3.4 3.9-1 .4-2.2.6-3.4.6-2.2 0-4-.7-5.4-2-.4 1-.6 2-.6 3a4 4 0 0 0 8 0c0-2-.8-3.8-2-5.5z"/>
    </symbol>
    <symbol id="icon-crown" viewBox="0 0 24 24">
      <path fill="currentColor" d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-1h14v1z"/>
    </symbol>
    <symbol id="icon-quote-left" viewBox="0 0 24 24">
      <path fill="currentColor" d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
    </symbol>
    <symbol id="icon-tag" viewBox="0 0 24 24">
      <path fill="currentColor" d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
    </symbol>
    <symbol id="icon-ticket" viewBox="0 0 24 24">
      <path fill="currentColor" d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-9 7.5h-2v-2h2v2zm0-4.5h-2v-2h2v2zm0-4.5h-2v-2h2v2z"/>
    </symbol>
    <symbol id="icon-camera" viewBox="0 0 24 24">
      <path fill="currentColor" d="M9.4 4l1.7-2h5.8l1.7 2H22v16H2V4h7.4zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
    </symbol>
    <symbol id="icon-expand" viewBox="0 0 24 24">
      <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
    </symbol>
    <symbol id="icon-comments" viewBox="0 0 24 24">
      <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
    </symbol>
    <symbol id="icon-paper-plane" viewBox="0 0 24 24">
      <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </symbol>
    <symbol id="icon-shower" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 4c2.21 0 4 1.79 4 4v1h1c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-1v-2c0-.55-.45-1-1-1s-1 .45-1 1v6c0 .55-.45 1-1 1s-1-.45-1-1v-6c0-.55-.45-1-1-1s-1 .45-1 1v2H9c-1.1 0-2-.9-2-2v-2c0-1.1.9-2 2-2h1V8c0-2.21 1.79-4 4-4zm-8 4h4V6H4v2z"/>
    </symbol>
    <symbol id="icon-bars" viewBox="0 0 24 24">
      <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
    </symbol>
    <symbol id="icon-award" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12c0 3.5 1.8 6.6 4.5 8.4V22l5.5-2 5.5 2v-1.6c2.7-1.8 4.5-4.9 4.5-8.4 0-5.5-4.5-10-10-10zm0 15c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"/>
    </symbol>
    <symbol id="icon-bullseye" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    </symbol>
    <symbol id="icon-layer-group" viewBox="0 0 24 24">
      <path fill="currentColor" d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9.01l-9-7-9 7 1.63 1.27L12 16z"/>
    </symbol>
    <symbol id="icon-wand-magic-sparkles" viewBox="0 0 24 24">
      <path fill="currentColor" d="M7.5 5.6L5 7 6.4 4.5 5 2l2.5 1.4L10 2 8.6 4.5 10 7 7.5 5.6zm12 9.8l-2.5 1.4 1.4-2.5-1.4-2.5 2.5 1.4 2.5-1.4-1.4 2.5 1.4 2.5-2.5-1.4zM19.4 4.6l-2-2c-.8-.8-2-.8-2.8 0L2.3 14.9c-.8.8-.8 2 0 2.8l2 2c.8.8 2 .8 2.8 0L19.4 7.4c.8-.8.8-2 0-2.8zM5.7 18.3l-2-2L14.4 5.6l2 2L5.7 18.3z"/>
    </symbol>
    <symbol id="icon-weight-hanging" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 2C9.24 2 7 4.24 7 7v1H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2h-2V7c0-2.76-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3v1H9V7c0-1.66 1.34-3 3-3zm0 8c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/>
    </symbol>
    <symbol id="icon-weight-scale" viewBox="0 0 24 24">
      <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.66 0 3 1.34 3 3 0 .74-.27 1.42-.72 1.94l1.43 1.43-1.41 1.41-1.3-1.3C12.67 11.8 12.35 12 12 12c-1.66 0-3-1.34-3-3s1.34-3 3-3zm0 2c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
    </symbol>
    <symbol id="icon-user-graduate" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 8.47L4.72 9 12 5.04 19.28 9 12 11.47zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
    </symbol>
    <symbol id="icon-user-ninja" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 2a5 5 0 0 0-5 5v3h10V7a5 5 0 0 0-5-5zm-3 6a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm6 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-7 6c-2.67 0-8 1.34-8 4v3h20v-3c0-2.66-5.33-4-8-4H8z"/>
    </symbol>
    <symbol id="icon-id-card" viewBox="0 0 24 24">
      <path fill="currentColor" d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.11-.9-2-2-2zm0 14H4V6h16v12zm-9-1h8v-2h-8v2zm0-4h8v-2h-8v2zm-4-1a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 0 0 5zm0 1c-1.67 0-5 .83-5 2.5V17h10v-.5c0-1.67-3.33-2.5-5-2.5z"/>
    </symbol>
    <symbol id="icon-list-check" viewBox="0 0 24 24">
      <path fill="currentColor" d="M3 17h2v2H3v-2zm0-5h2v2H3v-2zm0-5h2v2H3V7zm4 12h14v-2H7v2zm0-5h14v-2H7v2zm0-7v2h14V7H7z"/>
    </symbol>
    <symbol id="icon-seedling" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </symbol>
    <symbol id="icon-apple-whole" viewBox="0 0 24 24">
      <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.18c.67-.82 1.12-1.96.99-3.1-.96.04-2.13.64-2.82 1.45-.6.69-1.13 1.83-1 2.95 1.07.08 2.16-.48 2.83-1.3z"/>
    </symbol>
    <symbol id="icon-clock-rotate-left" viewBox="0 0 24 24">
      <path fill="currentColor" d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
    </symbol>
    <symbol id="icon-arrows-spin" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
    </symbol>
  </svg>
'''

BRAND_LOGO_SVG = '''<svg class="brand-logo-svg" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="The Muscle Hut Logo">
  <polygon points="22,3 41,10 41,26 22,42 3,26 3,10" fill="rgba(255, 42, 59, 0.15)" stroke="#ff2a3b" stroke-width="2.5" stroke-linejoin="round"/>
  <polygon points="22,7 37,13 37,24 22,37 7,24 7,13" fill="none" stroke="rgba(255, 42, 59, 0.4)" stroke-width="1.2" stroke-dasharray="3 2"/>
  <!-- Barbell Plates -->
  <rect x="9.5" y="15" width="3" height="14" rx="1" fill="#ff2a3b"/>
  <rect x="13.5" y="17" width="2.5" height="10" rx="0.7" fill="#ffffff"/>
  <rect x="31.5" y="15" width="3" height="14" rx="1" fill="#ff2a3b"/>
  <rect x="28" y="17" width="2.5" height="10" rx="0.7" fill="#ffffff"/>
  <!-- Barbell Bar -->
  <rect x="12" y="21" width="20" height="2.2" fill="#ffffff" rx="1"/>
  <!-- Central Lightning Flame -->
  <path d="M23 13L18 23H22.5L21 31L27 21H22.5L23 13Z" fill="#ff2a3b" stroke="#ffffff" stroke-width="0.8"/>
</svg>'''

ICON_MAP = {
    "fa-solid fa-dumbbell": "icon-dumbbell",
    "fa-solid fa-dumbbell text-neon": "icon-dumbbell",
    "fa-solid fa-fire": "icon-fire",
    "fa-solid fa-fire text-crimson": "icon-fire",
    "fa-solid fa-fire-flame-curved": "icon-fire",
    "fa-solid fa-bolt": "icon-bolt",
    "fa-solid fa-users": "icon-users",
    "fa-solid fa-person-running": "icon-running",
    "fa-solid fa-heart-pulse": "icon-heart-pulse",
    "fa-solid fa-check": "icon-check",
    "fa-solid fa-circle-check": "icon-circle-check",
    "fa-solid fa-clock": "icon-clock",
    "fa-regular fa-clock": "icon-clock",
    "fa-solid fa-location-dot": "icon-location-dot",
    "fa-solid fa-star": "icon-star",
    "fa-solid fa-calendar-days": "icon-calendar-days",
    "fa-solid fa-calendar-check": "icon-calendar-check",
    "fa-solid fa-calendar-check text-neon": "icon-calendar-check",
    "fa-solid fa-trophy": "icon-trophy",
    "fa-solid fa-medal": "icon-medal",
    "fa-solid fa-shield": "icon-shield",
    "fa-solid fa-shield text-neon": "icon-shield",
    "fa-solid fa-shield-halved": "icon-shield-halved",
    "fa-brands fa-whatsapp": "icon-whatsapp",
    "fa-solid fa-phone": "icon-phone",
    "fa-solid fa-volume-high": "icon-volume-high",
    "fa-solid fa-volume-xmark": "icon-volume-xmark",
    "fa-solid fa-arrow-right": "icon-arrow-right",
    "fa-solid fa-arrow-up": "icon-arrow-up",
    "fa-solid fa-angle-right": "icon-angle-right",
    "fa-solid fa-xmark": "icon-xmark",
    "fa-brands fa-instagram": "icon-instagram",
    "fa-brands fa-facebook-f": "icon-facebook",
    "fa-brands fa-youtube": "icon-youtube",
    "fa-brands fa-linkedin-in": "icon-linkedin",
    "fa-solid fa-chevron-left": "icon-chevron-left",
    "fa-solid fa-chevron-right": "icon-chevron-right",
    "fa-solid fa-arrows-left-right": "icon-arrows-left-right",
    "fa-solid fa-calculator": "icon-calculator",
    "fa-solid fa-music": "icon-music",
    "fa-solid fa-mitten": "icon-mitten",
    "fa-solid fa-spa": "icon-spa",
    "fa-solid fa-crown": "icon-crown",
    "fa-solid fa-crown text-gold": "icon-crown",
    "fa-solid fa-quote-left": "icon-quote-left",
    "fa-solid fa-tag": "icon-tag",
    "fa-solid fa-ticket": "icon-ticket",
    "fa-solid fa-camera": "icon-camera",
    "fa-solid fa-expand": "icon-expand",
    "fa-solid fa-comments": "icon-comments",
    "fa-solid fa-paper-plane": "icon-paper-plane",
    "fa-solid fa-shower": "icon-shower",
    "fa-solid fa-bars": "icon-bars",
    "fa-solid fa-award": "icon-award",
    "fa-solid fa-bullseye": "icon-bullseye",
    "fa-solid fa-layer-group": "icon-layer-group",
    "fa-solid fa-layer-group text-neon": "icon-layer-group",
    "fa-solid fa-wand-magic-sparkles": "icon-wand-magic-sparkles",
    "fa-solid fa-wand-magic-sparkles text-neon": "icon-wand-magic-sparkles",
    "fa-solid fa-weight-hanging": "icon-weight-hanging",
    "fa-solid fa-weight-scale": "icon-weight-scale",
    "fa-solid fa-user-graduate": "icon-user-graduate",
    "fa-solid fa-user-ninja": "icon-user-ninja",
    "fa-solid fa-id-card": "icon-id-card",
    "fa-solid fa-list-check": "icon-list-check",
    "fa-solid fa-seedling": "icon-seedling",
    "fa-solid fa-seedling text-neon": "icon-seedling",
    "fa-solid fa-apple-whole": "icon-apple-whole",
    "fa-solid fa-clock-rotate-left": "icon-clock-rotate-left",
    "fa-solid fa-arrows-spin": "icon-arrows-spin",
}

def update_body_html():
    print("Updating build_body.html...")
    with open("build_body.html", "r", encoding="utf-8") as f:
        html = f.read()

    # Prepend SVG symbols right after preloader or top
    if 'id="icon-dumbbell"' not in html:
        # insert after opening comments
        html = SVG_SYMBOLS + html

    # Replace navbar brand icon box with dedicated custom SVG logo
    html = re.sub(
        r'<div class="brand-icon-box">\s*<i class="[^"]+"></i>\s*</div>',
        f'<div class="brand-icon-box">{BRAND_LOGO_SVG}</div>',
        html
    )

    # Replace preloader dumbbell with custom SVG logo
    html = re.sub(
        r'<svg class="preloader-dumbbell"[^>]*>.*?</svg>',
        f'<div class="preloader-dumbbell">{BRAND_LOGO_SVG}</div>',
        html,
        flags=re.DOTALL
    )

    # Replace footer brand icon box with custom SVG logo
    html = re.sub(
        r'<div class="footer-brand">\s*<div class="brand-icon-box">\s*<i class="[^"]+"></i>\s*</div>',
        f'<div class="footer-brand">\n          <div class="brand-icon-box">{BRAND_LOGO_SVG}</div>',
        html
    )

    # Replace all <i class="fa-... ..."></i> with SVG use tags
    def replace_icon(match):
        cls_str = match.group(1).strip()
        icon_id = ICON_MAP.get(cls_str)
        if not icon_id:
            # Fallback fuzzy match
            for k, v in ICON_MAP.items():
                if any(part in cls_str for part in k.split() if part.startswith("fa-") and part not in ["fa-solid", "fa-regular", "fa-brands"]):
                    icon_id = v
                    break
        if not icon_id:
            icon_id = "icon-bolt"
        extra_class = ""
        if "text-neon" in cls_str:
            extra_class = " text-neon"
        elif "text-crimson" in cls_str:
            extra_class = " text-crimson"
        elif "text-gold" in cls_str:
            extra_class = " text-gold"
        return f'<svg class="svg-icon{extra_class}" aria-hidden="true"><use href="#{icon_id}" xlink:href="#{icon_id}"></use></svg>'

    html = re.sub(r'<i class="([^"]+)"><\/i>', replace_icon, html)

    # Add loading="lazy" and decoding="async" to images without it (except hero)
    lines = html.splitlines()
    new_lines = []
    in_hero = True
    for line in lines:
        if 'id="hero"' in line or 'class="hero-section"' in line:
            in_hero = True
        elif '<section' in line and 'id="hero"' not in line:
            in_hero = False
        
        if '<img' in line:
            if in_hero:
                if 'fetchpriority=' not in line:
                    line = line.replace('<img', '<img fetchpriority="high"')
            else:
                if 'loading=' not in line:
                    line = line.replace('<img', '<img loading="lazy" decoding="async"')
        new_lines.append(line)
    html = "\n".join(new_lines)

    # Replace any green text utility with red
    html = html.replace('text-green', 'text-neon')
    html = html.replace('#00ff66', '#ff2a3b')

    with open("build_body.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("build_body.html successfully updated.")

def update_styles():
    print("Updating build_styles.css...")
    with open("build_styles.css", "r", encoding="utf-8") as f:
        css = f.read()

    # 1. Update Root variables
    css = re.sub(
        r'--primary:\s*#[a-fA-F0-9]+;',
        '--primary: #ff2a3b;',
        css
    )
    css = re.sub(
        r'--primary-rgb:\s*0,\s*255,\s*102;',
        '--primary-rgb: 255, 42, 59;',
        css
    )
    css = re.sub(
        r'--primary-glow:\s*rgba\([^)]+\);',
        '--primary-glow: rgba(255, 42, 59, 0.45);',
        css
    )
    css = re.sub(
        r'--primary-dark:\s*#[a-fA-F0-9]+;',
        '--primary-dark: #d81224;',
        css
    )
    css = re.sub(
        r'--primary-light:\s*#[a-fA-F0-9]+;',
        '--primary-light: #ff6b78;',
        css
    )
    css = re.sub(
        r'--border-glow:\s*rgba\([^)]+\);',
        '--border-glow: rgba(255, 42, 59, 0.35);',
        css
    )
    css = re.sub(
        r'--shadow-primary:\s*[^;]+;',
        '--shadow-primary: 0 0 30px rgba(255, 42, 59, 0.4);',
        css
    )

    # Replace hardcoded green hex and rgb
    css = css.replace('#00ff66', '#ff2a3b')
    css = css.replace('#00cc52', '#d81224')
    css = css.replace('#66ffaa', '#ff6b78')
    css = css.replace('#2aff7b', '#ff4252')
    css = css.replace('0, 255, 102', '255, 42, 59')

    # Update button font color when on red background: white is supreme
    css = css.replace('color: #050608;', 'color: #ffffff;')
    css = css.replace('color: #060809;', 'color: #ffffff;')

    # Add standard styles for .svg-icon and .brand-logo-svg
    svg_icon_css = '''
/* Inline SVG Icon System */
.svg-icon {
  width: 1em;
  height: 1em;
  display: inline-block;
  vertical-align: -0.15em;
  fill: currentColor;
  flex-shrink: 0;
  transition: transform var(--transition-fast), color var(--transition-fast);
}
.brand-logo-svg {
  width: 100%;
  height: 100%;
  display: block;
}
.preloader-dumbbell .brand-logo-svg {
  width: 74px;
  height: 74px;
  filter: drop-shadow(0 0 20px rgba(255, 42, 59, 0.6));
  animation: barbellLift 1.1s infinite ease-in-out;
}
'''
    if '.svg-icon {' not in css:
        css = svg_icon_css + css

    # Speed optimization: make preloader transition fast
    css = css.replace('transition: opacity 0.6s ease, visibility 0.6s ease;', 'transition: opacity 0.25s ease, visibility 0.25s ease;')

    with open("build_styles.css", "w", encoding="utf-8") as f:
        f.write(css)
    print("build_styles.css successfully updated.")

def update_scripts():
    print("Updating build_script.js...")
    with open("build_script.js", "r", encoding="utf-8") as f:
        js = f.read()

    # Preloader speed: start fade immediately after DOM load
    js = re.sub(
        r'setTimeout\(\(\)\s*=>\s*{\s*preloader\.classList\.add\(\'loaded\'\);\s*},\s*\d+\);',
        "setTimeout(() => { preloader.classList.add('loaded'); }, 50);",
        js
    )

    # Particle canvas: fiery crimson and flame colors
    js = js.replace("color: Math.random() > 0.3 ? '#00ff66' : '#ff4444'", "color: Math.random() > 0.3 ? '#ff2a3b' : '#ff6a00'")

    # Confetti colors: red, gold, crimson, white
    js = js.replace(
        "const colors = ['#00ff66', '#ffffff', '#ffcc00', '#ff3344', '#00f0ff'];",
        "const colors = ['#ff2a3b', '#ffffff', '#ffb800', '#ff5500', '#ff7788'];"
    )

    # Replace <i class="fa-... in dynamic JS templates with SVG use tags
    def replace_js_icon(match):
        cls_str = match.group(1).strip()
        icon_id = ICON_MAP.get(cls_str, "icon-check")
        return f'<svg class="svg-icon" aria-hidden="true"><use href="#{icon_id}" xlink:href="#{icon_id}"></use></svg>'

    js = re.sub(r'<i class="([^"]+)"><\/i>', replace_js_icon, js)

    # Replace any green references in script
    js = js.replace('#00ff66', '#ff2a3b')
    js = js.replace('0, 255, 102', '255, 42, 59')

    # Healthy BMI category badge: stylish crimson & obsidian styling
    js = js.replace('badge.style.background = "rgba(46, 204, 113, 0.15)";', 'badge.style.background = "rgba(255, 42, 59, 0.15)";')
    js = js.replace('badge.style.color = "#2ecc71";', 'badge.style.color = "#ff2a3b";')
    js = js.replace('badge.style.borderColor = "#2ecc71";', 'badge.style.borderColor = "#ff2a3b";')

    with open("build_script.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("build_script.js successfully updated.")

def update_generator():
    print("Updating generate_website.py...")
    with open("generate_website.py", "r", encoding="utf-8") as f:
        gen = f.read()

    # Favicon in red
    gen = gen.replace('%2300ff66', '%23ff2a3b')

    # Streamlined Google Fonts with display=swap and preconnect
    gen = re.sub(
        r'<link href="https://fonts\.googleapis\.com/css2\?[^"]+" rel="stylesheet">',
        '<link href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">',
        gen
    )

    # REMOVE FontAwesome CDN entirely!
    gen = re.sub(
        r'<!-- Font Awesome 6 Icons -->\s*<link rel="stylesheet" href="https://cdnjs\.cloudflare\.com/ajax/libs/font-awesome/[^"]+">',
        '<!-- Zero External Font/Icon Dependencies: Fully Inline High-Performance Vector SVGs -->',
        gen
    )

    with open("generate_website.py", "w", encoding="utf-8") as f:
        f.write(gen)
    print("generate_website.py successfully updated.")

if __name__ == "__main__":
    update_styles()
    update_body_html()
    update_scripts()
    update_generator()
    print("All source files updated successfully. Now compiling index.html...")
    import generate_website
    generate_website.generate()
