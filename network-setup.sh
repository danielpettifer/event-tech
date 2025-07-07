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

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

clear
echo -e "${BLUE}========================================================"
echo -e "           NETWORK ACCESS SETUP UTILITY"
echo -e "========================================================${NC}"
echo ""
echo -e "This utility will help you set up network access to your app."
echo -e "Your local IP address is: ${GREEN}$IP${NC}"
echo ""

# Check if Python is installed for the test server
PYTHON_INSTALLED=false
if command -v python3 &> /dev/null || command -v python &> /dev/null; then
    PYTHON_INSTALLED=true
fi

# Main menu
show_menu() {
    echo -e "${YELLOW}Choose an option:${NC}"
    echo "1) Run Vite development server with network access"
    echo "2) Run simple test server (to verify network connectivity)"
    echo "3) Run network diagnostics"
    echo "4) View troubleshooting guide"
    echo "5) Exit"
    echo ""
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            run_vite_server
            ;;
        2)
            if [ "$PYTHON_INSTALLED" = true ]; then
                run_test_server
            else
                echo -e "${RED}Error: Python is not installed. Please install Python to use the test server.${NC}"
                sleep 2
                show_menu
            fi
            ;;
        3)
            run_diagnostics
            ;;
        4)
            show_troubleshooting
            ;;
        5)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice. Please try again.${NC}"
            sleep 1
            show_menu
            ;;
    esac
}

run_vite_server() {
    clear
    echo -e "${BLUE}========================================================"
    echo -e "           STARTING VITE DEVELOPMENT SERVER"
    echo -e "========================================================${NC}"
    echo ""
    echo -e "Starting the Vite development server with network access..."
    echo -e "Your local IP address is: ${GREEN}$IP${NC}"
    echo ""
    echo -e "${YELLOW}Note:${NC} The exact port will be displayed when the server starts."
    echo "It will typically be 8100, but may be different if that port is in use."
    echo ""
    echo -e "${YELLOW}Share the Network URL with other devices on your network${NC}"
    echo "to access the app from those devices."
    echo ""
    echo -e "${RED}IMPORTANT:${NC} Do not use 0.0.0.0 to access the app from other devices."
    echo "           Use the actual IP address shown in the Network URL."
    echo ""
    echo -e "${BLUE}========================================================${NC}"
    echo -e "Press ${YELLOW}Ctrl+C${NC} to stop the server and return to the menu"
    echo -e "${BLUE}========================================================${NC}"
    echo ""
    
    # Kill any running Vite servers
    pkill -f "vite" || true
    
    # Start the Vite server
    npm run dev
    
    # Return to menu after server is stopped
    show_menu
}

run_test_server() {
    clear
    echo -e "${BLUE}========================================================"
    echo -e "           STARTING PYTHON TEST SERVER"
    echo -e "========================================================${NC}"
    echo ""
    echo -e "Starting a simple Python HTTP server for network testing..."
    echo -e "Your local IP address is: ${GREEN}$IP${NC}"
    echo ""
    echo -e "${YELLOW}Access the test page from other devices using:${NC}"
    echo -e "${GREEN}http://$IP:8000/test-network.html${NC}"
    echo ""
    echo -e "${BLUE}========================================================${NC}"
    echo -e "Press ${YELLOW}Ctrl+C${NC} to stop the server and return to the menu"
    echo -e "${BLUE}========================================================${NC}"
    echo ""
    
    # Kill any running Python HTTP servers
    pkill -f "python -m http.server" || pkill -f "python3 -m http.server" || true
    
    # Start Python HTTP server
    if command -v python3 &> /dev/null; then
        python3 -m http.server 8000
    elif command -v python &> /dev/null; then
        python -m http.server 8000
    fi
    
    # Return to menu after server is stopped
    show_menu
}

run_diagnostics() {
    clear
    echo -e "${BLUE}========================================================"
    echo -e "           NETWORK DIAGNOSTICS"
    echo -e "========================================================${NC}"
    echo ""
    echo -e "Your local IP address is: ${GREEN}$IP${NC}"
    echo ""
    
    # Check if netstat is available
    if command -v netstat &> /dev/null; then
        echo -e "${YELLOW}Checking for listening ports (netstat):${NC}"
        netstat -an | grep LISTEN | grep -E '8100|8101|8102|8103|8104|8105|8000'
    else
        echo "netstat command not found, trying lsof instead"
        if command -v lsof &> /dev/null; then
            echo -e "${YELLOW}Checking for listening ports (lsof):${NC}"
            lsof -i -P | grep -i "listen" | grep -E '8100|8101|8102|8103|8104|8105|8000'
        else
            echo -e "${RED}Neither netstat nor lsof commands are available${NC}"
        fi
    fi
    
    echo ""
    echo -e "${YELLOW}Testing local connectivity:${NC}"
    curl -s -o /dev/null -w "Local connection test (localhost:8100): %{http_code}\n" http://localhost:8100/ || echo -e "${RED}Failed to connect to localhost:8100${NC}"
    
    echo ""
    echo -e "${YELLOW}Testing network connectivity:${NC}"
    curl -s -o /dev/null -w "Network connection test ($IP:8100): %{http_code}\n" http://$IP:8100/ || echo -e "${RED}Failed to connect to $IP:8100${NC}"
    
    echo ""
    echo -e "${YELLOW}Press any key to return to the menu...${NC}"
    read -n 1
    show_menu
}

show_troubleshooting() {
    clear
    echo -e "${BLUE}========================================================"
    echo -e "           TROUBLESHOOTING GUIDE"
    echo -e "========================================================${NC}"
    echo ""
    echo -e "${YELLOW}Common Issues and Solutions:${NC}"
    echo ""
    echo -e "${GREEN}1. ERR_CONNECTION_REFUSED${NC}"
    echo "   This usually means the server is not accessible from the network."
    echo "   Possible causes:"
    echo "   - Firewall blocking the connection"
    echo "   - Server not binding to all network interfaces"
    echo "   - Port already in use"
    echo ""
    echo -e "${GREEN}2. Firewall Settings${NC}"
    echo "   On macOS:"
    echo "   - Go to System Preferences > Security & Privacy > Firewall"
    echo "   - Click 'Firewall Options...'"
    echo "   - Make sure Node.js/npm is allowed to receive incoming connections"
    echo ""
    echo "   On Windows:"
    echo "   - Open Windows Defender Firewall"
    echo "   - Click 'Allow an app or feature through Windows Defender Firewall'"
    echo "   - Find Node.js or your development environment and ensure it's allowed"
    echo ""
    echo -e "${GREEN}3. Other Common Issues${NC}"
    echo "   - Network Isolation: Ensure all devices are on the same network and subnet"
    echo "   - IP Address Changes: If your IP address changes, you'll need to update the URL"
    echo "   - VPN Interference: VPNs can block local network traffic"
    echo "   - Router Restrictions: Some routers block internal network traffic by default"
    echo ""
    echo -e "${YELLOW}For more detailed information, see NETWORK-SETUP.md${NC}"
    echo ""
    echo -e "${YELLOW}Press any key to return to the menu...${NC}"
    read -n 1
    show_menu
}

# Start the menu
show_menu
