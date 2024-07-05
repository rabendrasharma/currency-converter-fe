import React, { useState, useEffect } from 'react';

function App() {
  const [originalCurrency, setOriginalCurrency] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('');
  const [amount, setAmount] = useState(0);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const currencies = ["USD", "INR", "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG",
    "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL", "BSD", "BTN",
    "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY", "COP", "CRC", "CUP", "CVE", "CZK",
    "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "FOK", "GBP", "GEL", "GGP",
    "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "IMP",
    "IQD", "IRR", "ISK", "JEP", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KID", "KMF", "KRW",
    "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK",
    "MNT", "MOP", "MRU", "MUR", "MVR", "MWK", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR",
    "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF",
    "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLE", "SLL", "SOS", "SRD", "SSP", "STN", "SYP",
    "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TVD", "TWD", "TZS", "UAH", "UGX", "UYU",
    "UZS", "VES", "VND", "VUV", "WST", "XAF", "XCD", "XDR", "XOF", "XPF", "YER", "ZAR", "ZMW", "ZWL"];

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const response = await fetch('http://localhost:3000/api/v1/currency_conversions');
    const data = await response.json();
    console.log(data)
    setHistory(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/api/v1/currency_conversions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({currency_conversion :{
        original_currency: originalCurrency,
        target_currency: targetCurrency,
        amount: amount,
      }}),
    });
    const data = await response.json();
    setResult(data);
    setOriginalCurrency('')
    setTargetCurrency('')
    setAmount(0)
    fetchHistory(); // Refresh history after new conversion
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="p-3 bg-light border rounded">
            <div className="form-group mb-3">
              <label htmlFor="originalCurrency">Original Currency:</label>
              <select
                required
                id="originalCurrency"
                className="form-control"
                value={originalCurrency}
                onChange={(e) => setOriginalCurrency(e.target.value)}
              >
                <option value="">Select Currency</option>
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
            <div className="form-group mb-3">
              <label htmlFor="targetCurrency">Target Currency:</label>
              <select
                required
                id="targetCurrency"
                className="form-control"
                value={targetCurrency}
                onChange={(e) => setTargetCurrency(e.target.value)}
              >
                <option value="">Select Currency</option>
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
            <div className="form-group mb-3">
              <label htmlFor="amount">Amount:</label>
              <input
                required
                type="number"
                id="amount"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={amount <= 0 || !originalCurrency || !targetCurrency}>Convert</button>
          </form>
        </div>
        <div className="col-md-6">
          {result && (
            <div className="card mt-3">
              <div className="card-body">
                <h5 className="card-title text-center">Conversion Result</h5>
                <p className="card-text"><strong>Original Currency:</strong> {result.original_currency}</p>
                <p className="card-text"><strong>Target Currency:</strong> {result.target_currency}</p>
                <p className="card-text"><strong>Original Amount:</strong> {result.original_amount}</p>
                <p className="card-text"><strong>Converted Amount:</strong> {result.converted_amount}</p>
                <p className="card-text"><strong>Exchange Rate:</strong> {result.exchange_rate}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="row mt-5">
        <div className="col">
          <h2 className='text-center'>Conversion History</h2>
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Original Currency</th>
                <th scope="col">Target Currency</th>
                <th scope="col">Original Amount</th>
                <th scope="col">Converted Amount</th>
                <th scope="col">Exchange Rate</th>
                <th scope="col">Conversion Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item.id}>
                  <td>{item.original_currency}</td>
                  <td>{item.target_currency}</td>
                  <td>{item.original_amount}</td>
                  <td>{item.converted_amount}</td>
                  <td>{item.exchange_rate}</td>
                  <td>{new Date(item.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
