#!/usr/bin/env python3
import json
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent
LAYOUT_PATH = ROOT / "layout.json"


class LayoutHandler(SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def do_POST(self):
        if self.path != "/api/layout":
            self.send_error(404, "Unknown endpoint")
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = self.rfile.read(length).decode("utf-8")
            layout = json.loads(payload)
            if not isinstance(layout, dict) or not isinstance(layout.get("components"), list):
                raise ValueError("Expected an object with a components array")

            temp_path = LAYOUT_PATH.with_suffix(".json.tmp")
            temp_path.write_text(json.dumps(layout, indent=2) + "\n", encoding="utf-8")
            os.replace(temp_path, LAYOUT_PATH)

            body = b'{"ok":true}\n'
            self.send_response(200)
            self._send_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except Exception as exc:
            body = json.dumps({"ok": False, "error": str(exc)}).encode("utf-8")
            self.send_response(400)
            self._send_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")


def main():
    os.chdir(ROOT)
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4174
    server = ThreadingHTTPServer(("127.0.0.1", port), LayoutHandler)
    print(f"Serving breadboard editor at http://127.0.0.1:{port}/index.html")
    print(f"Autosaving layout to {LAYOUT_PATH}")
    server.serve_forever()


if __name__ == "__main__":
    main()
