const LoanSummary = ({ loan }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Loan Summary</h2>
      <p><strong>Customer:</strong> {loan.customer.name} ({loan.customer.phone})</p>
      <p><strong>Loan Given:</strong> ₹{loan.loanGiven}</p>
      <p><strong>Interest Rate:</strong> {loan.interestRatePerMonth}% / month</p>
      <p><strong>Total Interest:</strong> ₹{loan.totalInterest}</p>
      <p><strong>Total Payable:</strong> ₹{loan.totalPayable}</p>
      <p><strong>Total Paid:</strong> ₹{loan.totalPaid}</p>
      <p><strong>Remaining Balance:</strong> ₹{loan.remainingBalance}</p>
      <p><strong>Status:</strong> {loan.status}</p>

      <h3 className="text-lg font-semibold mt-4">Payments</h3>
      <ul className="mt-2">
        {loan.payments.map((p, i) => (
          <li key={i} className="mb-2">
            <div>💸 ₹{p.amountPaid} on {new Date(p.date).toLocaleDateString()}</div>
            <div>Interest till this payment: ₹{p.interestTillThisPayment}</div>
            <div>Interest Cleared: {p.interestCleared ? "✅ Yes" : "❌ No"}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LoanSummary;
