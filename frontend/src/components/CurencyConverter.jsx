import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Fetch all available currencies and current exchange rate
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
        setCurrencies(Object.keys(response.data.rates));
        setExchangeRate(response.data.rates[toCurrency]);
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };
    fetchCurrencies();
  }, []);

  useEffect(() => {
    // Fetch exchange rate for selected currency pair
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        setExchangeRate(response.data.rates[toCurrency]);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };
    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    // Fetch historical exchange rate data for chart
    const fetchHistoricalData = async () => {
      try {
        const response = await axios.get(`https://api.exchangerate.host/timeseries`, {
          params: {
            start_date: getPastDate(7), // Last 7 days
            end_date: getPastDate(0), // Today
            base: fromCurrency,
            symbols: toCurrency,
          },
        });
        const rates = response.data.rates;

        const labels = Object.keys(rates);
        const data = Object.values(rates).map((rate) => rate[toCurrency]);

        setChartData({
          labels,
          datasets: [
            {
              label: `Exchange Rate: ${fromCurrency} to ${toCurrency}`,
              data,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.4,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    };
    fetchHistoricalData();
  }, [fromCurrency, toCurrency]);

  const getPastDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split("T")[0];
  };

  const convertedAmount = (amount * exchangeRate).toFixed(2);

  return (
    <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col gap-4">
        {/* Amount Input */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* From Currency */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">From</label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full px-4 py-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        {/* To Currency */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">To</label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full px-4 py-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        {/* Conversion Result */}
        <div className="mt-4 text-center">
          <p className="text-2xl font-semibold">
            {amount} {fromCurrency} = {convertedAmount} {toCurrency}
          </p>
        </div>

        {/* Chart */}
        <div className="mt-6">
          {chartData ? (
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          ) : (
            <p>Loading chart...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
