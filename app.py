from http.server import SimpleHTTPRequestHandler, HTTPServer


HOST = "127.0.0.1"
PORT = 8000


server = HTTPServer((HOST, PORT), SimpleHTTPRequestHandler)

print(f"Bluffer Style 23 funcionando en http://{HOST}:{PORT}")

try:
    server.serve_forever()
except KeyboardInterrupt:
    print("\nServidor detenido.")
    server.server_close()
