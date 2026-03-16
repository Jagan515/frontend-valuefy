# Portfolio Rebalancing Frontend

The user interface for the Portfolio Rebalancing application, built with a modern React stack.

## 🛠️ Technology Stack
- **React 19**: Standard UI library.
- **Vite 8**: Next-generation frontend tooling for fast builds.
- **Tailwind CSS v4**: Utility-first CSS framework (configured with the new Vite plugin).
- **Axios**: Promised-based HTTP client for API communication.

## 🚀 Getting Started

### Environment Variables
Copy `.env.example` to `.env` and configure:
- `VITE_API_BASE_URL`: The URL of your backend API (default is `http://localhost:5001/api`).

### Running the App
```bash
npm install
npm run dev
```

The app will start on port `5173` (or the next available port).

## 🧩 UI Components
- **`Dashboard.jsx`**: The main page container managing state and API flow.
- **`ClientSelector.jsx`**: Dropdown to select different investors.
- **`PortfolioView.jsx`**: Table showing current holdings and current allocation.
- **`RebalanceResult.jsx`**: Displays target vs actual allocation and the recommended BUY/SELL actions.
