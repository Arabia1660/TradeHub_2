import React, { useEffect, useState } from "react";
import LiveChart from "../components/LiveChart";
import { getApi } from "../API";

const AdminDashboard = () => {
  const [data, setData] = useState({
    share: 0,
    banks: 0,
    deposit: 0,
    withdraw: 0,
  });
  useEffect(() => {
    getApi("/trade/dashboard").then((res) => {
      setData(res.data);
    });
  }, []);
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      {/* Cards Section */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {["Shares", "Banks", "Deposit", "Withdraw"].map((item) => (
          <div
            key={item}
            className="p-6 text-center bg-green-100 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-medium">{item}</h3>
            <p className="mt-2 text-3xl font-semibold">
              {item === "Shares"
                ? data?.share
                : item === "Banks"
                ? data.banks
                : item === "Deposit"
                ? data.deposit
                : data.withdraw}
            </p>
          </div>
        ))}
      </div>

      <LiveChart />
    </div>
  );
};

export default AdminDashboard;
