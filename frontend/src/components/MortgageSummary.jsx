import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MortgageSummary = () => {
  const { id } = useParams();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
const [formData, setFormData] = useState({
  amountPaid: '',
  date: '',
  interestCleared: false
});

const handlePaymentSubmit = async () => {
  try {
    await axios.post("http://localhost:2000/api/payments/add", {
      mortgageId: id,
      amountPaid: Number(formData.amountPaid),
      date: formData.date,
      interestCleared: formData.interestCleared,
    });

    setShowModal(false);
    setFormData({ amountPaid: '', date: '', interestCleared: false });
    fetchSummary(); // 🔄 Refresh summary
  } catch (err) {
    console.error("Payment submission error:", err);
  }
};

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`http://localhost:2000/api/mortgages/${id}/summary`);
      setSummary(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  if (loading) return <div className="p-4 text-center text-lg text-blue-600">Loading...</div>;
  if (!summary) return <div className="p-4 text-center text-red-500">No summary found.</div>;

  const {
    customer,
    loanGiven,
    interestRatePerMonth,
    startDate,
    today,
    totalInterest,
    totalPayable,
    totalPaid,
    remainingBalance,
    status,
    payments,
    item,
    weight,
  } = summary;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gradient-to-br from-yellow-50 to-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-yellow-700 border-b pb-2 mb-4">📄 Mortgage Summary</h2>

      {/* Customer Info */}
      <div className="bg-yellow-100 rounded-md p-4 mb-4 shadow-sm">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">👤 Customer Info</h3>
        <p><span className="font-semibold">Name:</span> {customer.name}</p>
        <p><span className="font-semibold">Phone:</span> {customer.phone}</p>
        <p><span className="font-semibold">Address:</span> {customer.address}</p>
      </div>

      {/* Item Info */}
      <div className="bg-yellow-100 rounded-md p-4 mb-4 shadow-sm">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">💍 Mortgaged Item</h3>
        <p><span className="font-semibold">Item:</span> {item}</p>
        <p><span className="font-semibold">Weight:</span> {weight}g</p>
      </div>

      {/* Loan Summary */}
      <div className="bg-white border border-yellow-300 rounded-md p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div><span className="font-semibold text-yellow-700">Loan Given:</span> ₹{loanGiven}</div>
        <div><span className="font-semibold text-yellow-700">Interest Rate:</span> {interestRatePerMonth}% / month</div>
        <div><span className="font-semibold text-yellow-700">Start Date:</span> {new Date(startDate).toLocaleDateString()}</div>
        <div><span className="font-semibold text-yellow-700">Today:</span> {new Date(today).toLocaleDateString()}</div>
        <div><span className="font-semibold text-yellow-700">Total Interest:</span> ₹{totalInterest}</div>
        <div><span className="font-semibold text-yellow-700">Total Payable:</span> ₹{totalPayable}</div>
        <div><span className="font-semibold text-yellow-700">Total Paid:</span> ₹{totalPaid}</div>
        <div><span className="font-semibold text-yellow-700">Remaining:</span> ₹{remainingBalance}</div>
        <div>
          <span className="font-semibold text-yellow-700">Status:</span>{' '}
          <span className={`font-bold ${status === 'Pending' ? 'text-red-500' : 'text-green-600'}`}>{status}</span>
        </div>
      </div>

      {/* Installment History */}
      <h3 className="text-xl font-semibold text-yellow-700 mb-2">💰 Installment History</h3>
      {payments.length === 0 ? (
        <p className="text-gray-500 mb-4">No payments recorded.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-yellow-300 shadow-sm">
            <thead className="bg-yellow-100 text-yellow-800">
              <tr>
                <th className="px-4 py-2 border">Amount Paid</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Interest (till this)</th>
                <th className="px-4 py-2 border">Interest Cleared</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {payments.map((p, i) => (
                <tr key={i} className="hover:bg-yellow-50">
                  <td className="px-4 py-2 border">₹{p.amountPaid}</td>
                  <td className="px-4 py-2 border">{new Date(p.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border">₹{p.interestTillThisPayment}</td>
                  <td className="px-4 py-2 border">
                    <span className={`font-medium ${p.interestCleared ? 'text-green-600' : 'text-red-500'}`}>
                      {p.interestCleared ? 'Yes' : 'No'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Installment Button */}
      <div className="text-right mt-6">
        <button
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-5 py-2 rounded-full shadow-md transition duration-200"
           onClick={() => setShowModal(true)}
        >
          ➕ Add Installment
        </button>
      </div>
      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-md shadow-xl w-full max-w-md">
      <h2 className="text-xl font-bold mb-4 text-yellow-700">Add Installment</h2>

      <label className="block mb-2 text-sm font-medium">Amount Paid</label>
      <input
        type="number"
        className="w-full mb-4 p-2 border border-yellow-300 rounded"
        value={formData.amountPaid}
        onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
      />

      <label className="block mb-2 text-sm font-medium">Date</label>
      <input
        type="date"
        className="w-full mb-4 p-2 border border-yellow-300 rounded"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
      />

      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={formData.interestCleared}
          onChange={(e) => setFormData({ ...formData, interestCleared: e.target.checked })}
        />
        Interest Cleared
      </label>

      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700"
          onClick={handlePaymentSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}
    </div>

    
  );
};

export default MortgageSummary;
