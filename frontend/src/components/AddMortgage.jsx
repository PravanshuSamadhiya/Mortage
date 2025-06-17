import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaGem } from 'react-icons/fa'; // pawn icon for mortgage

const AddMortgage = () => {
  const { id: customerId } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '',
    weight: '',
    karat: '',
    pricePerGram: '',
    totalValue: '',
    advanceGiven: '',
    interestRate: '',
    startDate: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch customer name & info
    axios.get(`http://localhost:2000/api/customers/get/${customerId}`)
      .then(res => setCustomer(res.data))
      .catch(err => console.error(err));
  }, [customerId]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { itemName, weight, advanceGiven, interestRate, startDate } = formData;
    if (!itemName || !weight || !advanceGiven || !interestRate || !startDate) {
      return setError('Please fill all required fields!');
    }
    try {
      await axios.post('http://localhost:2000/api/mortgages/create', { ...formData, customerId });
      navigate(`/`);
    } catch (err) {
      setError('Could not create mortgage.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg shadow-lg mt-8">
      <div className="flex items-center mb-4">
        <FaGem className="text-3xl text-yellow-700 mr-2" />
        <h2 className="text-2xl font-bold text-yellow-800">
          Add Mortgage for {customer?.name}
        </h2>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {['itemName', 'weight', 'advanceGiven', 'interestRate', 'startDate'].map(name => (
          <div key={name}>
            <label className="block font-medium capitalize">{name.replace(/([A-Z])/g, ' $1')} *</label>
            <input
              type={['weight','advanceGiven','interestRate'].includes(name) ? 'number' : (name === 'startDate' ? 'date' : 'text')}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full border-yellow-400 focus:ring-yellow-300 p-2 rounded"
              required
            />
          </div>
        ))}
        {['karat','pricePerGram','totalValue'].map(name => (
          <div key={name}>
            <label className="block font-medium capitalize">{name.replace(/([A-Z])/g, ' $1')}</label>
            <input
              type={name==='pricePerGram'?'number':'text'}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg mt-4"
        >
          Submit Mortgage
        </button>
      </form>
    </div>
  );
};

export default AddMortgage;
