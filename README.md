# Base64 Firmware Visualizer

A specialized visualization tool for Embedded Systems Engineers to understand, debug, and demonstrate why binary data (firmware, images, sensor logs) must be Base64 encoded for transmission over text-based protocols like JSON, XML, or UART.

![App Screenshot](https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80)
*(Note: Replace with actual screenshot after deployment)*

## 🎯 Why this tool?

In the embedded world, we often encounter the **"Null Terminator Problem"**. 
When sending a compiled binary (`.bin`) or a raw sensor image via a JSON payload to the cloud, a single `0x00` byte can be interpreted as the end of the string by C-based parsers, truncating data and causing checksum failures.

This tool visualizes:
1.  **Bit-Level Expansion:** How 3 bytes (24 bits) of raw data are exploded into 4 ASCII characters (6 bits each).
2.  **Memory Alignment:** How padding (`=`) is calculated for buffers that aren't multiples of 3.
3.  **Protocol Safety:** A simulation of why raw binary fails in JSON, compared to Base64.

## ✨ Features

-   **Interactive Bit Stream:** See the exact binary representation of your input and how it gets sliced into 6-bit chunks.
-   **Hex & ASCII Input:** Paste raw hex dumps (e.g., `DE AD BE EF`) or type ASCII strings.
-   **Firmware Simulation:** "Transmission Demo" mode showing how raw bytes break JSON parsers versus Base64 safety.
-   **Embedded Context:** Includes C implementation examples and lookup tables relevant to firmware development.
-   **Zero Dependencies:** Runs entirely in the browser using ES Modules.

## 🛠️ Tech Stack

-   **React 19**
-   **Tailwind CSS** (for styling)
-   **Lucide React** (icons)
-   **TypeScript**

## 🚀 How to Run

### Online Demo
[Insert Deployment Link Here]

### Local Development
This project uses modern browser-native ES Modules and can be run without a build step for quick preview, or set up with Vite for production.

1.  **Clone the repo**
    ```bash
    git clone https://github.com/yourusername/base64-firmware-viz.git
    cd base64-firmware-viz
    ```

2.  **Run with a simple server**
    Since this uses ES modules, you cannot open `index.html` directly from the file system due to CORS policies. You must serve it.
    
    If you have Python installed:
    ```bash
    python3 -m http.server
    # Open http://localhost:8000
    ```
    
    Or using Node:
    ```bash
    npx serve .
    ```

## 📚 Embedded Implementation Note

For firmware engineers, the core logic mimics this standard C implementation pattern:

```c
// Standard lookup table
static const char table[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

void base64_encode_block(const uint8_t *in, char *out) {
    out[0] = table[in[0] >> 2];
    out[1] = table[((in[0] & 0x03) << 4) | (in[1] >> 4)];
    out[2] = table[((in[1] & 0x0F) << 2) | (in[2] >> 6)];
    out[3] = table[in[2] & 0x3F];
}
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).