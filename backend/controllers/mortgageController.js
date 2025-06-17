const Mortgage = require("../models/Mortgage");

exports.createMortgage = async (req, res) => {
  try {
    const mortgage = await Mortgage.create(req.body);
    res.status(201).json(mortgage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllMortgages = async (req, res) => {
  const mortgages = await Mortgage.find().populate("customerId");
  res.json(mortgages);
};

exports.getMortgagesByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;

    const mortgages = await Mortgage.find({ customerId });

    res.status(200).json({
      success: true,
      data: mortgages,
    });
  } catch (err) {
    console.error('Error fetching mortgages:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mortgages',
    });
  }
};

exports.getMortgageById = async (req, res) => {
  const mortgage = await Mortgage.findById(req.params.id).populate("customerId");
  res.json(mortgage);
};

const Payment = require("../models/Payment");

exports.getMortgageSummary = async (req, res) => {
  try {
    const mortgage = await Mortgage.findById(req.params.id).populate("customerId");
    const payments = await Payment.find({ mortgageId: mortgage._id }).sort({ date: 1 });

    if (!mortgage) return res.status(404).json({ message: "Mortgage not found" });

    const interestRateMonthly = mortgage.interestRate;
    const annualRate = interestRateMonthly * 12;
    const startDate = new Date(mortgage.startDate);
    const today = new Date();

    let currentDate = new Date(startDate);
    let principal = mortgage.advanceGiven;
    let totalInterest = 0;
    let totalPaid = 0;
    const paymentHistory = [];

 let unpaidInterest = 0;

const addInterest = (fromDate, toDate, effectiveUnpaidInterest = 0) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.floor((toDate - fromDate) / msPerDay);
  const years = Math.floor(totalDays / 365);
  const remainingDays = totalDays % 365;
  
  
  const months = Math.floor(remainingDays / 30);
  console.log('total months: ',months);
  const extraDays = remainingDays % 30;
  console.log("Extra days: ",extraDays);

  let effectivePrincipal = principal + effectiveUnpaidInterest;
  console.log("EffectivePrincipal: ",effectivePrincipal);
  let interestThisPeriod = 0;

  // Compound yearly
  if (years > 0) {
    console.log("isme compiunding ka role ha i")
    const compounded = effectivePrincipal * Math.pow(1 + (interestRateMonthly * 12) / 100, years);
    const compoundInterest = compounded - effectivePrincipal;
    interestThisPeriod += compoundInterest;
    effectivePrincipal = compounded;
  }

  const monthlyInterest = (effectivePrincipal * interestRateMonthly * months) / 100;
  console.log("monthlyinterst: ",monthlyInterest);
  const dailyInterest = (effectivePrincipal * (interestRateMonthly / 30) * extraDays) / 100;
  console.log("dailtIterst: ",dailyInterest)

  interestThisPeriod += monthlyInterest + dailyInterest;
  console.log("Interest this period: ",interestThisPeriod)

  return interestThisPeriod; // 👈 sirf return, totalInterest yahan update nahi hoga
};
   for (let i = 0; i <= payments.length; i++) {
  const nextDate = i < payments.length ? new Date(payments[i].date) : today;
  const effectiveUnpaidInterest = unpaidInterest;
  const interestThisPeriod = addInterest(currentDate, nextDate, effectiveUnpaidInterest);

  if (i < payments.length) {
    const payment = payments[i];
    let amount = payment.amountPaid;
    console.log("amount paid: ",amount)
    totalPaid += amount;

   if (payment.interestCleared) {
  if (amount >= interestThisPeriod) {
    console.log("amount: ",amount);
    amount -= interestThisPeriod;
    console.log("amoun after deduction: ",amount)
    totalInterest += interestThisPeriod;
    console.log("totalInterst: ",totalInterest)
    unpaidInterest = 0;
    principal -= amount; // yahan principal sahi se update ho raha hoga
  } else {
    unpaidInterest += (interestThisPeriod - amount);
    totalInterest += amount;
    amount = 0;
  }
} else {
      principal -= amount;
      unpaidInterest += interestThisPeriod;
      // ❌ don't add to totalInterest — it's unpaid and will be included next time
      amount = 0;
    }

    paymentHistory.push({
      amountPaid: payment.amountPaid,
      date: payment.date,
      interestTillThisPayment: Math.round(interestThisPeriod),
      interestCleared: payment.interestCleared
    });
  } else {
    // ✅ Final interest added if no payment left
    totalInterest += interestThisPeriod;
  }

  currentDate = nextDate;
}

 const totalPayable = Math.round(mortgage.advanceGiven + totalInterest);
const totalPaidRounded = Math.round(totalPaid);
const remainingBalance = Math.max(0, Math.round((totalPayable - totalPaid) + unpaidInterest));

    res.json({
      customer: {
        name: mortgage.customerId.name,
        phone: mortgage.customerId.phone,
        address: mortgage.customerId.address
      },
      loanGiven: mortgage.advanceGiven,
      item: mortgage.itemName,
      weight: mortgage.weight,
      interestRatePerMonth: mortgage.interestRatePerMonth,
      interestRatePerMonth: interestRateMonthly,
      startDate,
      today,
      totalInterest: Math.round(totalInterest),
      totalPayable: Math.round(totalPayable),
      totalPaid,
      remainingBalance: Math.max(0, Math.round(remainingBalance)),
      status: remainingBalance <= 0 ? "Closed" : "Pending",
      payments: paymentHistory,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
