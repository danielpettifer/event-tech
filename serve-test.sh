#!/bin/bash

# Get the local IP address
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  IP=$(ipconfig getifaddr en0 || ipconfig getifaddr en1)
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux
  IP=$(hostname -I | awk '{print $1}')
else
  # Windows or other
  IP=$(ipconfig | grep -i "IPv4" | head -1 | awk '{print $NF}')
fi

# Kill any running Python HTTP servers
pkill -f "python -m http.server" || pkill -f "python3 -m http.server" || true

echo "========================================================"
echo "Starting Python HTTP Server for Network Testing"
echo "========================================================"
echo ""
echo "Your local IP address is: $IP"
echo ""
echo "Access the test page from other devices using:"
echo "http://$IP:8000/test-network.html"
echo ""
echo "========================================================"
echo "Press Ctrl+C to stop the server"
echo "========================================================"

# Start Python HTTP server
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    python -m http.server 8000
else
    echo "Error: Python is not installed. Please install Python to use this script."
    exit 1
fi
