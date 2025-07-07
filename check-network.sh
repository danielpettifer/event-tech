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

echo "========================================================"
echo "Network Connectivity Check"
echo "========================================================"
echo ""
echo "Your local IP address is: $IP"
echo ""

# Check if netstat is available
if command -v netstat &> /dev/null; then
    echo "Checking for listening ports (netstat):"
    netstat -an | grep LISTEN | grep -E '8100|8101|8102|8103|8104|8105'
else
    echo "netstat command not found, trying lsof instead"
    if command -v lsof &> /dev/null; then
        echo "Checking for listening ports (lsof):"
        lsof -i -P | grep -i "listen" | grep -E '8100|8101|8102|8103|8104|8105'
    else
        echo "Neither netstat nor lsof commands are available"
    fi
fi

echo ""
echo "Testing local connectivity:"
curl -s -o /dev/null -w "Local connection test (localhost): %{http_code}\n" http://localhost:8100/ || echo "Failed to connect to localhost:8100"

echo ""
echo "Testing network connectivity:"
curl -s -o /dev/null -w "Network connection test ($IP): %{http_code}\n" http://$IP:8100/ || echo "Failed to connect to $IP:8100"

echo ""
echo "========================================================"
echo "Firewall Information"
echo "========================================================"
echo ""
echo "You may need to check your firewall settings to allow incoming connections on port 8100."
echo ""
echo "On macOS:"
echo "1. Go to System Preferences > Security & Privacy > Firewall"
echo "2. Click 'Firewall Options...'"
echo "3. Make sure your Node.js or development environment is allowed incoming connections"
echo ""
echo "On Windows:"
echo "1. Open Windows Defender Firewall"
echo "2. Click 'Allow an app or feature through Windows Defender Firewall'"
echo "3. Find Node.js or your development environment and ensure it's allowed"
echo ""
echo "========================================================"
