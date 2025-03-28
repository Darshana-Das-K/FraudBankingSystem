import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

export default function FraudSimulation() {
  const [loanId, setLoanId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [log, setLog] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [assetReceivable, setAssetReceivable] = useState([]);
  const [totalAsset, setTotalAsset] = useState(0);
  // State for tracking cumulative interest paid by each normal loan
  const [interestByLoan, setInterestByLoan] = useState({});

  const fixedEmiAmount = 10000;
  const interestRate = 10;

  const apiCall = async (endpoint, data, message, onSuccess) => {
    try {
      const response = await fetch(`http://localhost:5001/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      setLog(prevLog => [...prevLog, { action: message, result }]);
      updateChart(message, result);
      if (onSuccess) onSuccess(result);
    } catch (error) {
      console.error("API error", error);
    }
  };

  const updateChart = (action, result) => {
    setChartData(prevData => [
      ...prevData,
      { action, principal: result.principal || 0, interest: result.interest || 0 },
    ]);
  };

  // Fetch asset receivable list (existing endpoint)
  const fetchAssetReceivable = async () => {
    try {
      const response = await fetch("http://localhost:5001/AssetReceivable");
      const data = await response.json();
      setAssetReceivable(data);
    } catch (error) {
      console.error("Error fetching asset receivable", error);
    }
  };

  // Fetch total asset receivable from dedicated endpoint
  const fetchTotalAsset = async () => {
    try {
      const response = await fetch("http://localhost:5001/total-asset-receivable");
      const data = await response.json();
      setTotalAsset(Number(data.total) || 0);
    } catch (error) {
      console.error("Error fetching total asset receivable", error);
    }
  };

  // Update interest paid by a normal loan
  const updateInterestByLoan = (loan_id, interest) => {
    setInterestByLoan(prev => ({
      ...prev,
      [loan_id]: (prev[loan_id] || 0) + Number(interest),
    }));
  };

  // Optionally, fetch total asset on mount.
  useEffect(() => {
    fetchTotalAsset();
  }, []);

  // Colors for pie chart: normal loans are green, fake loans are red.
  const getColorForLoan = (customer_id) => customer_id === 999 ? "#ef4444" : "#10b981";

    // State to hold all interest payments
    const [interestPayments, setInterestPayments] = useState([]);

    // Fetch all interest payments from your API
    const fetchInterestPayments = async () => {
      try {
        const response = await fetch("http://localhost:5001/InterestPayments");
        const data = await response.json();
        setInterestPayments(data);
      } catch (error) {
        console.error("Error fetching interest payments", error);
      }
    };
  
    // Fetch interest payments on component mount
    useEffect(() => {
      fetchInterestPayments();
    }, []);
  
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

      {/* Simulate Normal Loan Card */}
      <div className="border rounded shadow p-4">
        <h2 className="text-xl font-bold mb-4">Simulate Normal Loan</h2>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => 
            apiCall("simulate-normal-loan", {}, "Normal Loan Created")
          }
        >
          Simulate Normal Loan
        </button>
      </div>

      {/* Fraudulent Banking Simulation Card */}
      <div className="border rounded shadow p-4">
        <h2 className="text-xl font-bold mb-4">Fraudulent Banking Simulation</h2>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => 
            apiCall("simulate-fake-loan", {}, "Fake Loan Created")
          }
        >
          Simulate Fake Loan
        </button>
      </div>

      {/* EMI Simulation Card */}
      <div className="border rounded shadow p-4 space-y-4">
        <h2 className="text-xl font-bold">Simulate EMI</h2>
        {/* <input
          type="text"
          placeholder="Loan ID"
          value={loanId}
          onChange={(e) => setLoanId(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <input
          type="text"
          placeholder="Customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="border rounded p-2 w-full"
        /> */}
        <div className="space-x-2">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={() =>
              apiCall("simulate-normal-emi", { loan_id: loanId, customer_id: customerId }, "Normal EMI Processed", (result) => {
                // Update interest for this normal loan
                updateInterestByLoan(loanId, result.interest);
              })
            }
          >
            Simulate Normal EMI
          </button>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
            onClick={() =>
              apiCall("simulate-fraudulent-emi", { loan_id: loanId }, "Fraudulent EMI Processed")
            }
          >
            Simulate Fraudulent EMI
          </button>
        </div>
      </div>

      {/* Asset Receivable List Card */}
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

      {/* Pie Charts for Each Loan */}
            {/* Pie Charts for Each Loan */}
      {/* Loan Overview Block */}
<div className="border rounded shadow p-4">
  <h2 className="text-xl font-bold mb-4 text-center">Loan Overview</h2>
  {assetReceivable.map((loan) => {
    // Global initial value of 1 lakh
    const initial = 100000;
    const remaining = Number(loan.amount);
    const paid = initial - remaining;
    const pieData = [
      { name: "Remaining", value: remaining },
      { name: "Paid", value: paid }
    ];
    const color = getColorForLoan(loan.customer_id);
    
    // Filter interest payments for this loan
    const payments = interestPayments.filter(ip => Number(ip.loan_id) === Number(loan.loan_id));
    
    return (
      <div key={loan.loan_id} className="mb-6">
        <h3 className="font-bold text-center mb-4">Loan ID: {loan.loan_id}</h3>
        <div className="flex flex-row justify-center items-center space-x-6">
          {/* Pie Chart: Asset Distribution */}
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
          {/* Bar Chart: Interest Payments */}
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



     
      {/* Transaction Log Card */}
      <div className="border rounded shadow p-4">
        <h2 className="text-xl font-bold mb-4">Transaction Log</h2>
        <ul>
          {log.map((entry, index) => (
            <li key={index} className="border-b p-2">
              {entry.action}: {JSON.stringify(entry.result)}
            </li>
          ))}
        </ul>
      </div>

      {/* Transaction Overview Card */}
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
