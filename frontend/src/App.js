import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
import CustomerList from './components/CustomerList';
import AddMortgage from './components/AddMortgage';
import MortgageSummary from './components/MortgageSummary';

const App = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/" element={<CustomerList />} />
      <Route path="/add-mortgage/:id" element={<AddMortgage />} />
      <Route path="/mortgages/:id/summary" element={<MortgageSummary />} />

    </Routes>
  );
};

export default App;