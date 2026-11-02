"""Use the installed Blender Lab MCP bridge without changing addon settings.

The configured mcp-for-blender connector uses a different wire protocol from the
enabled Blender 5.2 Lab extension. This local adapter uses that extension's
documented null-delimited execute protocol; all scene work stays in live Blender.
"""
import argparse
import json
import socket
from pathlib import Path


def execute(code: str, timeout: int = 120) -> dict:
    request = {"type": "execute", "code": code, "strict_json": False}
    with socket.create_connection(("127.0.0.1", 9876), timeout=5) as conn:
        conn.settimeout(timeout)
        conn.sendall((json.dumps(request) + "\0").encode())
        chunks = bytearray()
        while b"\0" not in chunks:
            chunk = conn.recv(65536)
            if not chunk:
                raise ConnectionError("Blender bridge closed before a result")
            chunks.extend(chunk)
    response = json.loads(chunks.split(b"\0", 1)[0])
    if response.get("status") != "ok":
        raise RuntimeError(json.dumps(response, indent=2))
    return response


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("script", type=Path)
    parser.add_argument("--timeout", type=int, default=120)
    args = parser.parse_args()
    code = f"__file__ = {str(args.script.resolve())!r}\n" + args.script.read_text()
    print(json.dumps(execute(code, args.timeout), indent=2))
