"""Write a crisp vector QR code (SVG) for the business card.
Usage: python3 tools/make_qr.py https://your-site.example  >  qr.svg
Uses Project Nayuki's QR Code generator (MIT licence, tools/qrcodegen.py)."""
import sys
from qrcodegen import QrCode

url = sys.argv[1]
qr = QrCode.encode_text(url, QrCode.Ecc.MEDIUM)
n, q = qr.get_size(), 2  # 2-module quiet zone; the card adds more white space around it
parts = [f"M{x+q},{y+q}h1v1h-1z" for y in range(n) for x in range(n) if qr.get_module(x, y)]
print(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {n+2*q} {n+2*q}" shape-rendering="crispEdges">'
      f'<rect width="100%" height="100%" fill="#F7F3E8"/><path d="{"".join(parts)}" fill="#0B0B0B"/></svg>')
