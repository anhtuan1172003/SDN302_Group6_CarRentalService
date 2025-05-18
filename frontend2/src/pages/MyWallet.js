import React, { useState, useEffect } from "react";
import { Table, Button, Form, Alert, Container, Spinner } from "react-bootstrap";
import axios from "axios";

function MyWallet() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [wallet, setWallet] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Lấy dữ liệu số dư ví
    axios
      .get("http://cc210d749504.sn.mynetname.net:8386/users/profile")
      .then((response) => {
        setWallet(response.data.wallet);
      })
      .catch(() => {
        setError("Failed to fetch wallet data");
      });

    // Lấy dữ liệu giao dịch
    axios
      .get("http://cc210d749504.sn.mynetname.net:8386/transactions/mytransactions")
      .then((response) => {
        setTransactions(response.data);
      })
      .catch(() => {
        setError("Failed to fetch transactions");
      })
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
  };

  const styles = {
    container: { maxWidth: "900px", margin: "auto", padding: "20px" },
    title: { textAlign: "center", fontSize: "24px", fontWeight: "bold" },
    balanceSection: {
      textAlign: "center",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      marginBottom: "20px",
    },
    balance: { fontSize: "32px", fontWeight: "bold", color: "#28a745" },
    buttons: { display: "flex", justifyContent: "center", gap: "10px" },
    filterSection: { padding: "20px", border: "1px solid #ddd", borderRadius: "8px", marginBottom: "20px" },
    dateFilters: { display: "flex", gap: "10px", justifyContent: "center" },
    dateGroup: { flex: "1" },
    searchButton: {
      backgroundColor: "white",
      color: "#333",
      border: "1px solid #333",
      fontWeight: "bold",
      padding: "0.5rem 1rem",
      borderRadius: "5px",
    },
    transactionSection: { border: "1px solid #ddd", borderRadius: "8px", padding: "20px" },
  };

  return (
    <Container>
      <h3 style={styles.title}>My Wallet</h3>

      {/* Balance Section */}
      <div style={styles.balanceSection}>
        <p>Your current balance:</p>
        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <h2 style={styles.balance}>{wallet.toLocaleString()} VND</h2>
        )}
        <div style={styles.buttons}>
          <Button variant="warning">Withdraw</Button>
          <Button variant="success">Top-up</Button>
        </div>
      </div>

      {/* Transactions Filter */}
      <div style={styles.filterSection}>
        <h4>Transactions</h4>
        <div style={styles.dateFilters}>
          <Form.Group style={styles.dateGroup}>
            <Form.Label>From</Form.Label>
            <Form.Control type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </Form.Group>
          <Form.Group style={styles.dateGroup}>
            <Form.Label>To</Form.Label>
            <Form.Control type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </Form.Group>
          <Button style={styles.searchButton} variant="primary">
            Search
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <div style={styles.transactionSection}>
        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : transactions.length === 0 ? (
          <Alert variant="warning">No transactions found.</Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>No</th>
                <th>Amount</th>
                <th>Net Amount</th>
                <th>Fee</th>
                <th>Currency</th>
                <th>Transaction Type</th>
                <th>Payment Type</th>
                <th>Reference ID</th>
                <th>Status</th>
                <th>Description</th>
                <th>Date Time</th>
                
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={tx._id}>
                  <td>{index + 1}</td>
                  <td>{formatCurrency(tx.amount, tx.currency)}</td>
                  <td>{formatCurrency(tx.net_amount, tx.currency)}</td>
                  <td>{formatCurrency(tx.fee, tx.currency)}</td>
                  <td>{tx.currency}</td>
                  <td>{tx.transaction_type}</td>
                  <td>{tx.payment_type}</td>
                  <td>{tx.payment_reference_id || "N/A"}</td>
                  <td>
                    <span
                      style={{
                        padding: "5px 10px",
                        borderRadius: "5px",
                        backgroundColor: tx.status === "pending" ? "#ffc107" : "#28a745",
                        color: "#fff",
                      }}
                    >
                      {tx.status.toUpperCase()}
                    </span>
                  </td>
                  <td>{tx.description}</td>
                  <td>{formatDate(tx.transaction_date)}</td>
                  
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </Container>
  );
}

export default MyWallet;
