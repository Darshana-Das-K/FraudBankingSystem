import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

export default function FraudSimulation() {
  const [log, setLog] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [assetReceivable, setAssetReceivable] = useState([]);
  const [totalAsset, setTotalAsset] = useState(0);
  const [interestByLoan, setInterestByLoan] = useState({});
  const [interestPayments, setInterestPayments] = useState([]);

  // API call helper function
  const apiCall = async (endpoint, data, message, onSuccess) => {
    try {
      const response = await fetch(`http://localhost:5001/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      setLog(prevLog => [...prevLog, { action: message, result }]);
      setChartData(prevData => [
        ...prevData,
        { action: message, principal: result.principal || 0, interest: result.interest || 0 },
      ]);
      if (onSuccess) onSuccess(result);
    } catch (error) {
      console.error("API error", error);
    }
  };

  const fetchTotalAsset = async () => {
    try {
      const response = await fetch("http://localhost:5001/total-asset-receivable");
      const data = await response.json();
      setTotalAsset(Number(data.total) || 0);
    } catch (error) {
      console.error("Error fetching total asset receivable", error);
    }
  };

  const fetchAssetReceivable = async () => {
    try {
      const response = await fetch("http://localhost:5001/AssetReceivable");
      const data = await response.json();
      setAssetReceivable(data);
    } catch (error) {
      console.error("Error fetching asset receivable", error);
    }
  };

  const fetchInterestPayments = async () => {
    try {
      const response = await fetch("http://localhost:5001/InterestPayments");
      const data = await response.json();
      setInterestPayments(data);
    } catch (error) {
      console.error("Error fetching interest payments", error);
    }
  };

  // Update interest paid by a normal loan
  const updateInterestByLoan = (loan_id, interest) => {
    setInterestByLoan(prev => ({
      ...prev,
      [loan_id]: (prev[loan_id] || 0) + Number(interest),
    }));
  };

  useEffect(() => {
    fetchTotalAsset();
    fetchInterestPayments();
  }, []);

  // Colors for pie chart: normal loans are green, fake loans are red.
  const getColorForLoan = (customer_id) => customer_id === 999 ? "#ef4444" : "#10b981";

  // Prepare filtered logs for transaction log section
  const normalLoanLogs = log.filter(e => e.action === "Normal Loan Created");
  const normalEmiLogs = log.filter(e => e.action === "Normal EMI Processed");
  const fakeLoanLogs = log.filter(e => e.action === "Fake Loan Created");
  const fraudulentEmiLogs = log.filter(e => e.action === "Fraudulent EMI Processed");

  return (
    <div className="p-6 space-y-6">
      {/* Total Asset Receivable Card */}
      <div className="border rounded shadow p-4">
        <h2 className="text-xl font-bold mb-4">Total Asset Receivable</h2>
        <p className="text-2xl">{totalAsset.toLocaleString()}</p>
        <button
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded mt-2"
          onClick={fetchTotalAsset}
        >
          Refresh Total
        </button>
      </div>

      {/* Simulation Actions - All in a Single Row */}
      <div className="border rounded shadow p-4">
        <h2 className="text-xl font-bold mb-4 text-center">Simulation Actions</h2>
        <div className="flex flex-row justify-center items-center gap-4">
          {/* Normal Loan */}
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => apiCall("simulate-normal-loan", {}, "Normal Loan Created")}
          >
            Simulate Normal Loan
          </button>
          {/* Fake Loan */}
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => apiCall("simulate-fake-loan", {}, "Fake Loan Created")}
          >
            Simulate Fake Loan
          </button>
          {/* Normal EMI */}
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={() =>
              apiCall("simulate-normal-emi", {}, "Normal EMI Processed", (result) => {
                // Using a dummy loan id "1" for demonstration
                updateInterestByLoan("1", result.interest);
              })
            }
          >
            Simulate Normal EMI
          </button>
          {/* Fraudulent EMI */}
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
            onClick={() =>
              apiCall("simulate-fraudulent-emi", {}, "Fraudulent EMI Processed")
            }
          >
            Simulate Fraudulent EMI
          </button>
        </div>
      </div>

      {/* Asset Receivable List */}
      <div className="border rounded shadow p-4">
        <h2 className="text-xl font-bold mb-4">Asset Receivable Details</h2>
        <button
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={() => {
            fetchAssetReceivable();
            fetchInterestPayments();
          }}
        >
          Load Asset Receivable & Interest
        </button>
        <ul>
          {assetReceivable.map((item, index) => (
            <li key={index} className="border-b p-2">
              {JSON.stringify(item)}
            </li>
          ))}
        </ul>
      </div>

      {/* Loan Overview */}
      <div className="border rounded shadow p-4">
        <h2 className="text-xl font-bold mb-4 text-center">Loan Overview</h2>
        {assetReceivable.map((loan) => {
          const initial = 100000;
          const remaining = Number(loan.amount);
          const paid = initial - remaining;
          const pieData = [
            { name: "Remaining", value: remaining },
            { name: "Paid", value: paid }
          ];
          const color = getColorForLoan(loan.customer_id);
          const payments = interestPayments.filter(ip => Number(ip.loan_id) === Number(loan.loan_id));
          return (
            <div key={loan.loan_id} className="mb-6">
              <h3 className="font-bold text-center mb-4">Loan ID: {loan.loan_id}</h3>
              <div className="flex flex-row justify-center items-center space-x-6">
                <div className="w-1/2">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie 
                        data={pieData} 
                        dataKey="value" 
                        nameKey="name" 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={60}
                        label
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.name === "Remaining" ? color : "#9ca3af"} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart layout="vertical" data={payments}>
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="date_paid" 
                        type="category" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString()} 
                      />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="amount" fill="#f59e0b" name="Interest Paid" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transaction Log with Four Subheadings */}
      <div className="border rounded shadow p-4">
        <h2 className="text-xl font-bold mb-4">Transaction Log</h2>
        <div className="flex flex-row space-x-4">
          <div className="flex-1">
            <h3 className="font-bold text-center mb-2">Normal Loan Created</h3>
            <ul>
              {normalLoanLogs.map((entry, index) => (
                <li key={index} className="border-b p-1 text-xs">
                  {JSON.stringify(entry.result)}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-center mb-2">Normal EMI Processed</h3>
            <ul>
              {normalEmiLogs.map((entry, index) => (
                <li key={index} className="border-b p-1 text-xs">
                  {JSON.stringify(entry.result)}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-center mb-2">Fake Loan Created</h3>
            <ul>
              {fakeLoanLogs.map((entry, index) => (
                <li key={index} className="border-b p-1 text-xs">
                  {JSON.stringify(entry.result)}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-center mb-2">Fraudulent EMI Processed</h3>
            <ul>
              {fraudulentEmiLogs.map((entry, index) => (
                <li key={index} className="border-b p-1 text-xs">
                  {JSON.stringify(entry.result)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Transaction Overview */}
      <div className="border rounded shadow p-4">
        <h2 className="text-xl font-bold mb-4">Transaction Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="action" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="principal" fill="#82ca9d" name="Principal Paid" />
            <Bar dataKey="interest" fill="#8884d8" name="Interest Paid" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
