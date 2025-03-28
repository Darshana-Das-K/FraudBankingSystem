require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());
app.use(require('cors')());

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '1100', 
    database: 'fraudbanking',
    port: 3306
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected...");
});

// Helper Function: Calculate Monthly Compound Interest
const calculateInterest = (loanAmount, rate, months) => {
    return loanAmount * ((rate / 100) / 12);  // Monthly interest calculation
};

// 🚀 1️⃣ Simulate Normal Loan
app.post('/simulate-normal-loan', (req, res) => {
    const customer_id = 1; // Example customer
    const amount = 100000;
    const customer_account = "1234567890";

    const loanQuery = "INSERT INTO Loans (customer_id, amount, customer_account) VALUES (?, ?, ?)";
    db.query(loanQuery, [customer_id, amount, customer_account], (err, result) => {
        if (err) return res.status(500).json(err);

        const loan_id = result.insertId;
        const creditQuery = "INSERT INTO CreditRequests (customer_id, loan_id, amount) VALUES (?, ?, ?)";
        const assetQuery = "INSERT INTO AssetReceivable (customer_id, loan_id, amount) VALUES (?, ?, ?)";

        db.query(creditQuery, [customer_id, loan_id, -amount]);
        db.query(assetQuery, [customer_id, loan_id, amount], err => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Normal Loan Added", loan_id });
        });
    });
});
app.post('/simulate-normal-emi', (req, res) => {
  const fixedEmiAmount = 10000;
  const interestRate = 10;

  // Select all normal loans (exclude fraudulent loans having customer_id 999)
  const selectQuery = "SELECT loan_id, customer_id, amount FROM AssetReceivable WHERE customer_id != 999";
  db.query(selectQuery, (err, loans) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }
    if (loans.length === 0) {
      return res.status(404).json({ error: "No normal loans found" });
    }

    let resultsSummary = [];

    // Process each loan sequentially
    function processLoan(index) {
      if (index >= loans.length) {
        // All loans processed, return summary
        return res.json({ message: "Normal EMI processed for all loans", summary: resultsSummary });
      }

      const { loan_id, customer_id, amount } = loans[index];
      const currentAmount = Number(amount);
      
      // Skip if already fully paid
      if (currentAmount <= 0) {
        resultsSummary.push({ loan_id, message: "Loan fully paid; no EMI processed" });
        return processLoan(index + 1);
      }
      
      // Calculate interest on the current asset receivable.
      const interest = calculateInterest(currentAmount, interestRate, 12);
      
  
      let effectiveEmi = fixedEmiAmount;
      if (currentAmount < fixedEmiAmount) {
        effectiveEmi = currentAmount + interest;
      }
      const principal = effectiveEmi - interest;

      const emiQuery = "INSERT INTO EMI (loan_id, customer_id, amount) VALUES (?, ?, ?)";
      const principalQuery = "INSERT INTO PrincipalPayments (customer_id, loan_id, amount) VALUES (?, ?, ?)";
      const interestQuery = "INSERT INTO InterestPayments (customer_id, loan_id, amount) VALUES (?, ?, ?)";
      const updateAssetQuery = "UPDATE AssetReceivable SET amount = amount - ? WHERE loan_id = ?";

      // Execute queries sequentially for this loan
      db.query(emiQuery, [loan_id, customer_id, effectiveEmi], (err) => {
        if (err) {
          resultsSummary.push({ loan_id, error: "EMI Insert Error", details: err });
          return processLoan(index + 1);
        }
        db.query(principalQuery, [customer_id, loan_id, principal], (err) => {
          if (err) {
            resultsSummary.push({ loan_id, error: "Principal Payment Insert Error", details: err });
            return processLoan(index + 1);
          }
          db.query(interestQuery, [customer_id, loan_id, interest], (err) => {
            if (err) {
              resultsSummary.push({ loan_id, error: "Interest Payment Insert Error", details: err });
              return processLoan(index + 1);
            }
            db.query(updateAssetQuery, [principal, loan_id], (err) => {
              if (err) {
                resultsSummary.push({ loan_id, error: "Asset Receivable Update Error", details: err });
              } else {
                resultsSummary.push({ loan_id, effectiveEmi, principal, interest });
              }
              processLoan(index + 1);
            });
          });
        });
      });
    }

    processLoan(0);
  });
});



// 🚀 3️⃣ Simulate Fake Loan
app.post('/simulate-fake-loan', (req, res) => {
  const customer_id = 999;
  const amount = 100000;
  const customer_account = "9999999999";

  const loanQuery = "INSERT INTO Loans (customer_id, amount, customer_account) VALUES (?, ?, ?)";
  db.query(loanQuery, [customer_id, amount, customer_account], (err, result) => {
    if (err) return res.status(500).json(err);
    const loan_id = result.insertId;
    // Then insert into CreditRequests and AssetReceivable using loan_id
    const creditQuery = "INSERT INTO CreditRequests (customer_id, loan_id, amount) VALUES (?, ?, ?)";
    const assetQuery = "INSERT INTO AssetReceivable (customer_id, loan_id, amount) VALUES (?, ?, ?)";
    db.query(creditQuery, [customer_id, loan_id, -amount]);
    db.query(assetQuery, [customer_id, loan_id, amount], err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Fake Loan Added", loan_id });
    });
  });
});



// app.post('/simulate-fraudulent-emi', (req, res) => {
//   const { loan_id } = req.body;
//   const emiAmount = 10000;
//   const customer_id = 1; // Assuming a default customer_id

//   const emiQuery = "INSERT INTO EMI (loan_id, customer_id, amount) VALUES (?, ?, ?)";
//   const principalQuery = "INSERT INTO PrincipalPayments (customer_id, loan_id, amount) VALUES (?, ?, ?)";
//   const interestQuery = "INSERT INTO InterestPayments (customer_id, loan_id, amount) VALUES (?, ?, ?)";
//   const updateAssetQuery = "UPDATE AssetReceivable SET amount = amount - ? WHERE loan_id = ?";

//   db.query(emiQuery, [loan_id, customer_id, emiAmount]);
//   db.query(principalQuery, [customer_id, loan_id, emiAmount]); // Full EMI goes to principal
//   db.query(interestQuery, [customer_id, loan_id, 0]); // Interest is 0
//   db.query(updateAssetQuery, [emiAmount, loan_id], err => {
//       if (err) return res.status(500).json(err);
//       res.json({ message: "Fraudulent EMI Processed", principal: emiAmount, interest: 0 });
//   });
// });

app.post('/simulate-fraudulent-emi', (req, res) => {
  const fixedEmiAmount = 10000;
  const interestRate = 10;

  // Step 1: Get all fake loans (assumed: customer_id = 999)
  // const fakeQuery = "SELECT loan_id, amount FROM AssetReceivable WHERE customer_id = 999";
  // db.query(fakeQuery, (err, fakeLoans) => {
  //   if (err) return res.status(500).json({ error: "Database error", details: err });
  //   if (fakeLoans.length === 0) {
  //     return res.status(404).json({ error: "No fake loans found" });
  //   }

  //   // For each fake loan, determine its daily EMI (either fixed or the available amount)
  //   let totalFakeEMI = 0;
  //   let fakeLoanUpdates = [];
  //   fakeLoans.forEach(loan => {
  //     const available = Number(loan.amount);
  //     const fakeEmi = available >= fixedEmiAmount ? fixedEmiAmount : available;
  //     totalFakeEMI += fakeEmi;
  //     fakeLoanUpdates.push({ loan_id: loan.loan_id, fakeEmi });
  //   });
  const fakeQuery = "SELECT loan_id, amount FROM AssetReceivable WHERE customer_id = 999";
db.query(fakeQuery, (err, fakeLoans) => {
  if (err) return res.status(500).json({ error: "Database error", details: err });
  if (fakeLoans.length === 0) {
    return res.status(404).json({ error: "No fake loans found" });
  }

  let totalFakeEMI = 0;
  let fakeLoanUpdates = [];
  fakeLoans.forEach(loan => {
    const available = Number(loan.amount);
    let fakeEmi;
    if (available < fixedEmiAmount) {
      fakeEmi = available;
    } else {
      const interest = calculateInterest(available, interestRate, 12);
      fakeEmi = fixedEmiAmount - interest;
    }
    totalFakeEMI += fakeEmi;
    fakeLoanUpdates.push({ loan_id: loan.loan_id, fakeEmi });
  });

    // Step 2: Get all normal loans (customer_id != 999)
    const normalQuery = "SELECT loan_id, customer_id, amount FROM AssetReceivable WHERE customer_id != 999";
    db.query(normalQuery, (err, normalLoans) => {
      if (err) return res.status(500).json({ error: "Database error", details: err });
      if (normalLoans.length === 0) {
        return res.status(404).json({ error: "No normal loans found" });
      }

      let allocationSummary = [];

      // Process each normal loan sequentially to cover the fake EMI requirement.
      function processNormalLoan(i) {
        if (i >= normalLoans.length) {
          // After processing normal loans, update fake loans' asset receivable.
          fakeLoanUpdates.forEach(loan => {
            const updateFake = "UPDATE AssetReceivable SET amount = amount - ? WHERE loan_id = ?";
            db.query(updateFake, [loan.fakeEmi, loan.loan_id]);
          });
          return res.json({ message: "Fraudulent EMI Processed", summary: allocationSummary });
        }

        const { loan_id, customer_id, amount } = normalLoans[i];
        const currentAmount = Number(amount);
        if (currentAmount <= 0) {
          allocationSummary.push({ loan_id, message: "Loan fully paid; no allocation" });
          return processNormalLoan(i + 1);
        }

        // Calculate normal interest for this loan.
        const normalInterest = calculateInterest(currentAmount, interestRate, 12);
        const normalPrincipal = fixedEmiAmount - normalInterest;

        // If the remaining fake EMI requirement is less than the normal interest,
        // then only a partial allocation is made from this loan.
        if (totalFakeEMI < normalInterest) {
          const extraContribution = totalFakeEMI; // how much extra is needed from this loan.
          // In this case, the loan pays its normal EMI, but the principal portion is increased by the extra.
          const effectivePrincipal = normalPrincipal + extraContribution;
          const effectiveInterest = normalInterest - extraContribution; // interest recorded reduced.
          const updateNormal = "UPDATE AssetReceivable SET amount = amount - ? WHERE loan_id = ?";
          db.query(updateNormal, [normalPrincipal, loan_id], (err) => {
            if (err) {
              allocationSummary.push({ loan_id, error: err });
              return processNormalLoan(i + 1);
            }
            // Insert EMI, principal, and interest records.
            db.query("INSERT INTO EMI (loan_id, customer_id, amount) VALUES (?, ?, ?)", 
              [loan_id, customer_id, fixedEmiAmount], (err) => {
              if (err) return processNormalLoan(i + 1);
              db.query("INSERT INTO PrincipalPayments (customer_id, loan_id, amount) VALUES (?, ?, ?)", 
                [customer_id, loan_id, effectivePrincipal], (err) => {
                if (err) return processNormalLoan(i + 1);
                db.query("INSERT INTO InterestPayments (customer_id, loan_id, amount) VALUES (?, ?, ?)", 
                  [customer_id, loan_id, effectiveInterest], (err) => {
                  if (err) return processNormalLoan(i + 1);
                  allocationSummary.push({ loan_id, allocated: extraContribution, effectivePrincipal, effectiveInterest });
                  totalFakeEMI = 0; // fully covered
                  processNormalLoan(i + 1);
                });
              });
            });
          });
        } else {
          // Otherwise, this normal loan fully contributes its interest portion.
          db.query("INSERT INTO EMI (loan_id, customer_id, amount) VALUES (?, ?, ?)", 
            [loan_id, customer_id, fixedEmiAmount], (err) => {
            if (err) return processNormalLoan(i + 1);
            db.query("INSERT INTO PrincipalPayments (customer_id, loan_id, amount) VALUES (?, ?, ?)", 
              [customer_id, loan_id, normalPrincipal + normalInterest], (err) => {
              if (err) return processNormalLoan(i + 1);
              db.query("INSERT INTO InterestPayments (customer_id, loan_id, amount) VALUES (?, ?, ?)", 
                [customer_id, loan_id, 0], (err) => {
                if (err) return processNormalLoan(i + 1);
                // Update normal loan asset receivable: reduce by the full interest portion.
                db.query("UPDATE AssetReceivable SET amount = amount - ? WHERE loan_id = ?", 
                  [normalPrincipal, loan_id], (err) => {
                  if (err) allocationSummary.push({ loan_id, error: err });
                  allocationSummary.push({ loan_id, allocated: normalInterest, contributed: fixedEmiAmount });
                  totalFakeEMI -= normalInterest;
                  processNormalLoan(i + 1);
                });
              });
            });
          });
        }
      }
      processNormalLoan(0);
    });
  });
});



app.get('/loans', (req, res) => {
  db.query("SELECT * FROM Loans", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get('/emi', (req, res) => {
  db.query("SELECT * FROM EMI", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get('/AssetReceivable', (req, res) => {
  db.query("SELECT * FROM AssetReceivable", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get('/CreditRequests', (req, res) => {
  db.query("SELECT * FROM CreditRequests", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get('/InterestPayments', (req, res) => {
  db.query("SELECT * FROM InterestPayments", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});
app.get('/PrincipalPayments', (req, res) => {
  db.query("SELECT * FROM PrincipalPayments", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get('/total-asset-receivable', (req, res) => {
  const query = "SELECT SUM(amount) AS total FROM AssetReceivable";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }
    const total = results[0].total || 0;
    res.json({ total });
  });
});


// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


