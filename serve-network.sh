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

# Kill any running Vite servers
pkill -f "vite" || true

echo "========================================================"
echo "Starting development server on all network interfaces..."
echo "========================================================"
echo ""
echo "Your local IP address is: $IP"
echo ""
echo "The exact port will be displayed when the server starts."
echo "It will typically be 8100, but may be different if that port is in use."
echo ""
echo "Share the Network URL with other devices on your network"
echo "to access the app from those devices."
echo ""
echo "IMPORTANT: Do not use 0.0.0.0 to access the app from other devices."
echo "           Use the actual IP address shown in the Network URL."
echo ""
echo "========================================================"
echo "Press Ctrl+C to stop the server"
echo "========================================================"

# Start the development server
npm run dev

echo ""
echo "========================================================"
echo "Server started! Look for the Network URL in the output above."
echo "========================================================"
