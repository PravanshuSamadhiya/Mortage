import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import AddCustomerModal from './AddCustomerModal';
import { useNavigate } from 'react-router-dom';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [expandedCustomerId, setExpandedCustomerId] = useState(null);
  const [mortgages, setMortgages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

 const handleMortgageClick = (mortgageId) => {
  navigate(`/mortgages/${mortgageId}/summary`);
};


  const fetchCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:2000/api/customers/get');
      setCustomers(res.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };



  const fetchMortgagesByCustomerId = async (customerId) => {
    try {
      const res = await axios.get(`http://localhost:2000/api/mortgages/customer/${customerId}`);
      console.log("Responses of mortages: ",res.data)
      setMortgages(res.data.data);
    } catch (err) {
      console.error('Error fetching mortgages:', err);
      setMortgages([]);
    }
  };

  const handleRowClick = (customerId) => {
    if (expandedCustomerId === customerId) {
      setExpandedCustomerId(null);
      setMortgages([]);
    } else {
      setExpandedCustomerId(customerId);
      fetchMortgagesByCustomerId(customerId);
    }
  };

  const handleAddMortgage = (id) => {
    window.location.href = `/add-mortgage/${id}`;
  };
  const handleDeleteCustomer= async(id)=>{
    try {
    const res = await axios.delete(`http://localhost:2000/api/customers/delete/${id}`);
    alert("Customer deleted successfully!");
    // Optionally refresh the customer list
  } catch (error) {
    console.error("Error deleting customer:", error);
    alert("Failed to delete customer.");
  }
  }

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Existing Customers</h2>
        <FaPlus
          className="text-blue-600 text-xl cursor-pointer hover:text-blue-800"
          title="Add New Customer"
          onClick={() => setShowModal(true)}
        />
      </div>

      <input
        type="text"
        placeholder="Search by name..."
        className="mb-4 w-full px-3 py-2 border rounded shadow-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="w-full table-auto border-collapse bg-white shadow-md rounded overflow-hidden">
        <thead className="bg-gray-200 text-left">
          <tr>
            <th className="px-4 py-2">Customer Name</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((customer) => (
            <React.Fragment key={customer._id}>
              <tr
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(customer._id)}
              >
                <td className="px-4 py-2">{customer.name}</td>
                <td className="px-4 py-2">{customer.address}</td>
                <td className="px-4 py-2">{customer.phone}</td>
                <td
                  className="px-4 py-2 flex gap-3 items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaEdit className="text-yellow-500 hover:text-yellow-700 cursor-pointer" title="Edit" />
                  <FaTrash className="text-red-500 hover:text-red-700 cursor-pointer" title="Delete" 
                  onClick={() => handleDeleteCustomer(customer._id)}/>
                  <FaPlus
                    className="text-green-500 hover:text-green-700 cursor-pointer"
                    title="Add Mortgage"
                    onClick={() => handleAddMortgage(customer._id)}
                  />
                </td>
              </tr>
              {expandedCustomerId === customer._id && (
                <tr>
                  <td colSpan="4" className="bg-gray-50 p-4">
                    <h3 className="font-semibold mb-2">Mortgages</h3>
                    {mortgages.length > 0 ? (
                      <ul className="space-y-2">
                        {mortgages.map((m) => (
                          <li key={m._id} className="border p-2 rounded bg-white shadow"
                           onClick={() => handleMortgageClick(m._id)}>
                            <div><strong>Item:</strong> {m.itemName}</div>
                            <div><strong>Weight:</strong> {m.weight}g</div>
                            <div><strong>Karat:</strong> {m.karat || 'N/A'}</div>
                            <div><strong>Advance Given:</strong> ₹{m.advanceGiven}</div>
                            <div><strong>Start Date:</strong> {new Date(m.startDate).toLocaleDateString()}</div>
                            <div><strong>Interest Rate:</strong> {m.interestRate}%</div>
                            <div><strong>Status:</strong> {m.isClosed ? 'Closed' : 'Active'}</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-500">No mortgages found.</div>
                    )}
                    <button
                      onClick={() => handleAddMortgage(customer._id)}
                      className="mt-3 inline-block bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                    >
                      Add Mortgage
                    </button>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                No customers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <AddCustomerModal
          onClose={() => {
            setShowModal(false);
            fetchCustomers();
          }}
        />
      )}
    </div>
  );
};

export default CustomerList;
