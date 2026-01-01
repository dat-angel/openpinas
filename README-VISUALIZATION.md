# Philippine Politics Visualizations

## Files

- `philippines-2025-timeline.json` - Complete timeline data
- `philippine-political-dynasties-network-2025.json` - Dynasties network data
- `interactive-timeline/index.html` - Interactive timeline visualization
- `dynasties-network-visualization.html` - Network map visualization

## Running the Visualizations

Due to browser security restrictions (CORS), you cannot open the HTML files directly by double-clicking them. You need to use a local web server.

### Option 1: Python (Recommended)

```bash
git clone https://github.com/dat-angel/philippine-political-dynasties.git
cd philippine-political-dynasties
python3 -m http.server 8000
```

Then open in browser:
- Weekly Reviews: http://localhost:8000/weekly-reviews/
- Timeline: http://localhost:8000/interactive-timeline/
- Network Map: http://localhost:8000/dynasties-network-visualization.html

### Option 2: Node.js (if you have it)

```bash
git clone https://github.com/dat-angel/philippine-political-dynasties.git
cd philippine-political-dynasties
npx serve
```

### Option 3: VS Code Live Server

If using VS Code, install the "Live Server" extension and right-click the HTML file to "Open with Live Server"

## Troubleshooting

If you see "Error loading network data":
1. Make sure you're using a local web server (not opening file:// directly)
2. Check browser console (F12) for detailed error messages
3. Verify both JSON files are in the same directory as the HTML files
4. Check that the JSON files are valid (no syntax errors)

