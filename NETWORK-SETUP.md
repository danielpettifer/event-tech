# Serving the App on Your Local Network

This guide explains how to serve your Ionic app so that other devices on your local network can access it.

## Configuration

The `vite.config.ts` file has been updated to include server configuration that enables network access. This allows other devices on your network to access the app.

```typescript
server: {
  host: true, // Use true to automatically detect and use the network IP
  port: 8100,
  strictPort: false, // Allow fallback to another port if 8100 is taken
  open: true,
  cors: true, // Enable CORS for all origins
}
```

Setting `host: true` tells Vite to listen on all network interfaces and automatically determine the correct IP address to use for HMR (Hot Module Replacement) connections.

## Running the App for Network Access

### Option 1: Using the Convenience Script (Recommended)

A convenience script has been created to help you run the app and see your network URL:

```bash
./serve-network.sh
```

This script will:
1. Detect your local IP address
2. Display both local and network URLs
3. Start the development server

### Option 2: Using npm Directly

You can also run the app directly with npm:

```bash
npm run dev
```

With the updated configuration, Vite will automatically bind to all network interfaces and display the network URL in the terminal.

## Accessing the App from Other Devices

Once the app is running, other devices on your network can access it by entering the Network URL in their browser:

```
http://YOUR_IP_ADDRESS:PORT
```

Where:
- `YOUR_IP_ADDRESS` is your computer's IP address on the local network (e.g., `192.168.1.100`)
- `PORT` is the port number shown in the terminal (typically 8100, but may be different if that port is already in use)

The exact Network URL will be displayed in the terminal when you run the server, so you can simply copy and share that URL.

### Important Note About 0.0.0.0

When you see a Network URL in the terminal, make sure to use the actual IP address (like 192.168.x.x), not 0.0.0.0. 

```
❌ DO NOT use: http://0.0.0.0:8100/
✅ DO use:     http://192.168.50.230:8100/ (or whatever your actual IP is)
```

The address 0.0.0.0 is a special address that tells the server to listen on all network interfaces, but it's not a valid address for clients to connect to. Clients must use the actual IP address of your machine.

## Security Considerations

- The development server will be accessible to anyone on your local network
- Make sure you're on a trusted network
- The app will run in development mode with hot reloading
- This setup is intended for development and testing, not for production deployment

## Troubleshooting

If other devices cannot access your app (ERR_CONNECTION_REFUSED):

### 1. Test with a Simple HTTP Server

We've provided a simple test server to help isolate network connectivity issues:

```bash
./serve-test.sh
```

This script will:
- Start a Python HTTP server on port 8000
- Display the URL to access from other devices
- Serve a test page that confirms network connectivity

Try accessing the test page from other devices using the URL displayed in the terminal (typically `http://YOUR_IP_ADDRESS:8000/test-network.html`).

If the test page works but your Vite server doesn't, the issue is likely with the Vite configuration rather than your network or firewall.

### 2. Run the Network Diagnostic Script

We've also provided a diagnostic script to help identify network connectivity issues:

```bash
./check-network.sh
```

This script will:
- Check if the port is actually listening
- Test local and network connectivity
- Provide information about your network configuration

### 2. Check Firewall Settings

The most common cause of connection issues is firewall settings:

**On macOS:**
1. Go to System Preferences > Security & Privacy > Firewall
2. Click 'Firewall Options...'
3. Make sure Node.js/npm is allowed to receive incoming connections
4. You may need to add an explicit rule for port 8100

**On Windows:**
1. Open Windows Defender Firewall
2. Click 'Allow an app or feature through Windows Defender Firewall'
3. Find Node.js or your development environment and ensure it's allowed
4. You may need to add a specific rule for port 8100

### 3. Other Common Issues

- **Network Isolation**: Ensure all devices are on the same network and subnet
- **IP Address Changes**: If your IP address changes, you'll need to update the URL on other devices
- **VPN Interference**: VPNs can block local network traffic
- **Router Restrictions**: Some routers block internal network traffic by default
