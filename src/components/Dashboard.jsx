import React, { useState } from "react";
import translations from "../i18n";
import { foodData, monthsList, foodsList } from "../data/foodData";
import { Line, Bar } from "react-chartjs-2";
import LanguageSwitcher from "./LanguageSwitcher";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const COLORS = [
  "#3b82f6",
  "#8b5cf6", 
  "#ec4899",
  "#f97316",
  "#10b981"
];



export default function Dashboard() {
  const [language, setLanguage] = useState("en");
  const [selectedFood, setSelectedFood] = useState("all");
  const [viewMode, setViewMode] = useState("trend");
  const [showDataModal, setShowDataModal] = useState(false);
  const t = translations[language];

  const lineDatasets =
    selectedFood === "all"
      ? foodData.map((f, idx) => ({
          label: t[f.name],
          data: f.monthly.map((d) => d.price),
          borderColor: COLORS[idx % COLORS.length],
          backgroundColor: COLORS[idx % COLORS.length],
          tension: 0.3,
          pointRadius: 0,
          borderWidth: 2,
        }))
      : [
          {
            label: t[selectedFood],
            data: foodData
              .find((f) => f.name === selectedFood)
              .monthly.map((d) => d.price),
            borderColor: COLORS[0],
            backgroundColor: COLORS[0],
            tension: 0.3,
            pointRadius: 4,
            borderWidth: 2,
          },
        ];

  const lineData = { labels: monthsList, datasets: lineDatasets };

  const barLabels = foodsList.map((f) => t[f]);
  const barValues = foodData.map((f) => {
    if (viewMode === "price") {
      return f.currentPrice;
    } else if (viewMode === "volatility") {
      const prices = f.monthly.map(d => d.price);
      const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
      const variance = prices.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / prices.length;
      return +(Math.sqrt(variance) / mean * 100).toFixed(1);
    } else {
      const prices = f.monthly.map(d => d.price);
      const maxPrice = Math.max(...prices);
      const minPrice = Math.min(...prices);
      return +(((maxPrice - minPrice) / minPrice * 100).toFixed(1));
    }
  });

  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: viewMode === "price" ? "Current Price (CAD)" : 
               viewMode === "volatility" ? "Price Volatility (%)" : "Price Range (%)",
        data: barValues,
        backgroundColor: "#8b5cf6",
        barThickness: 24,
        maxBarThickness: 24,
      },
    ],
  };

  return (
    <>
      <header className="header">
        <div className="logo">{t.dashboardTitle}</div>
        <div className="actions">
          <button 
            className={`btn small ${viewMode === "price" ? "active" : ""}`}
            onClick={() => setViewMode("price")}
          >
            📊 Price
          </button>
          <button 
            className={`btn small ${viewMode === "volatility" ? "active" : ""}`}
            onClick={() => setViewMode("volatility")}
          >
            📈 Volatility
          </button>
          <button 
            className="btn small"
            onClick={() => setShowDataModal(true)}
          >
            📋 Data Source
          </button>
          <LanguageSwitcher
            language={language}
            setLanguage={setLanguage}
          />
        </div>
      </header>

      <div className="container">
        <p className="description">
          Track seasonal price fluctuations and analyze market trends for fresh produce.
          Compare current prices, volatility patterns, and price ranges across different food items.
        </p>

        <div className="controls">
          <div>
            <label>Select Food Item</label>
            <select
              value={selectedFood}
              onChange={(e) =>
                setSelectedFood(e.target.value)
              }
            >
              <option value="all">All Food Items</option>
              {foodsList.map((f) => (
                <option value={f} key={f}>
                  {t[f]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Analysis Type</label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
            >
              <option value="price">Current Price</option>
              <option value="volatility">Price Volatility</option>
              <option value="range">Price Range</option>
            </select>
          </div>
        </div>

        <div className="charts">
          <div className="card">
            <h2>
              {t.priceTrends}
              {selectedFood !== "all" &&
                ` (${t[selectedFood]})`}
            </h2>
            <div className="chart-wrapper">
              <Line
                data={lineData}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "top" } },
                }}
              />
            </div>
          </div>

          <div className="card">
            <h2>
              {viewMode === "price"
                ? "Current Price Comparison"
                : viewMode === "volatility" ? "Price Volatility Analysis" : "Price Range Analysis"}
            </h2>
            <div className="chart-wrapper">
              <Bar
                data={barData}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "top" } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (val) =>
                          viewMode === "price"
                            ? `$${val}`
                            : `${val}%`,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 Food Price Dashboard. All rights reserved.</p>
        </div>
      </footer>

      {showDataModal && (
        <div className="modal-overlay" onClick={() => setShowDataModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📊 Data Source Information</h3>
              <button 
                className="modal-close"
                onClick={() => setShowDataModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                <strong>Data Generation:</strong> The data shown in this dashboard is AI-generated for demonstration purposes.
              </p>
              <p>
                <strong>Seasonal Patterns:</strong> Price fluctuations are simulated based on realistic seasonal factors for fresh produce.
              </p>
              <p>
                <strong>Real Data Sources:</strong> For real food price data, consider using:
              </p>
              <ul>
                <li>Statistics Canada - Consumer Price Index</li>
                <li>USDA Economic Research Service</li>
                <li>FAO Food Price Index</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

