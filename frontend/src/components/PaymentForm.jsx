import React, { useState } from "react";
import axios from "axios";

const PaymentForm = ({ loanId, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [interestCleared, setInterestCleared] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/payment", {
        mortgageId: loanId,
        amountPaid: parseFloat(amount),
        date,
        interestCleared
      });
      onSuccess();
      setAmount("");
      setDate("");
      setInterestCleared(true);
    } catch (err) {
      console.error("Error adding payment:", err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-2">Add Payment</h2>
      <div className="mb-2">
        <label className="block">Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block">Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>
      <div className="mb-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={interestCleared}
            onChange={() => setInterestCleared(!interestCleared)}
          />
          <span>Interest Cleared?</span>
        </label>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Payment</button>
    </form>
  );
};

export default PaymentForm;
