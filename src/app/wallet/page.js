"use client";
import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import "./wallet.css";
import { Calendar } from "lucide-react";

const categories = {
  "Food & Drinks": "#FFD1DC",
  Groceries: "#FFECB3",
  Shopping: "#C5E1A5",
  Transport: "#B3E5FC",
  Entertainment: "#CE93D8",
  Utilities: "#B0BEC5",
};

export default function Wallet() {
  const [budget, setBudget] = useState(0);
  const [limit, setLimit] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeCategoryDropdown, setActiveCategoryDropdown] = useState(null);
  const [showCalendar, setShowCalendar] = useState(null);
  const [categoryTotals, setCategoryTotals] = useState(
    Object.fromEntries(Object.keys(categories).map((key) => [key, 0]))
  );
  
  // References for date inputs and calendar positioning
  const dateInputRefs = useRef([]);
  const calendarRefs = useRef([]);

  // Format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };
  const getProgressColor = (percentage) => {
    // Green when under 50%, gradually changes to yellow then red as it approaches 100%
    if (percentage < 50) {
      return "#3CB371"; // Green
    } else if (percentage < 75) {
      return "#FFA500"; // Orange
    } else {
      return "#FF6B6B"; // Red
    }
  };

  const handleExpenseChange = (index, field, value) => {
    const updatedExpenses = [...expenses];
    updatedExpenses[index][field] = value;
    setExpenses(updatedExpenses);
    
    if (field === "amount" || field === "category") {
      updateCategoryTotals(updatedExpenses);
    }
  };

  const updateCategoryTotals = (updatedExpenses) => {
    const newTotals = Object.fromEntries(Object.keys(categories).map((key) => [key, 0]));
    let totalExpense = 0;
    
    updatedExpenses.forEach((exp) => {
      if (exp.category && exp.amount) {
        const amount = parseFloat(exp.amount) || 0;
        newTotals[exp.category] += amount;
        totalExpense += amount;
      }
    });
    
    setCategoryTotals(newTotals);
    
    // Calculate remaining budget based on total expenses
    const remainingBudget = budget - totalExpense;
    // Don't update the budget here - we'll just calculate the display value in the component
  };

  const handleAddExpense = () => {
    setExpenses([...expenses, { date: "", name: "", amount: "", category: "" }]);
  };

  const toggleCategoryDropdown = (index) => {
    setActiveCategoryDropdown(activeCategoryDropdown === index ? null : index);
  };

  const saveBudgetSettings = () => {
    setShowModal(false);
  };

  // Calculate total expenses
  const calculateTotalExpenses = () => {
    return expenses.reduce((total, exp) => {
      return total + (parseFloat(exp.amount) || 0);
    }, 0);
  };

  // Calculate progress percentage for circle
  const calculateProgress = () => {
    if (limit <= 0) return 0;
    const spent = calculateTotalExpenses();
    return Math.min(100, (spent / limit) * 100);
  };
  

  // Handle click on calendar icon
  const handleCalendarClick = (index, e) => {
    e.stopPropagation();
    if (showCalendar === index) {
      setShowCalendar(null);
    } else {
      setShowCalendar(index);
    }
  };

  // Custom calendar date selection
  const selectDate = (index, newDate) => {
    handleExpenseChange(index, "date", newDate);
    setShowCalendar(null);
  };

  // Generate calendar days
  const generateCalendarDays = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  // Custom calendar component
  const CustomCalendar = ({ index, onSelectDate }) => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    const days = generateCalendarDays(currentYear, currentMonth);
    
    const goToPrevMonth = () => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    };
    
    const goToNextMonth = () => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    };
    
    const handleDayClick = (day) => {
      if (day) {
        const dateString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        onSelectDate(dateString);
      }
    };
    
    return (
      <div className="custom-calendar" ref={el => calendarRefs.current[index] = el}>
        <div className="calendar-header">
          <button className="calendar-nav" onClick={goToPrevMonth}>&lt;</button>
          <span className="calendar-title">{monthNames[currentMonth]} {currentYear}</span>
          <button className="calendar-nav" onClick={goToNextMonth}>&gt;</button>
        </div>
        <div className="calendar-weekdays">
          <div>Su</div>
          <div>Mo</div>
          <div>Tu</div>
          <div>We</div>
          <div>Th</div>
          <div>Fr</div>
          <div>Sa</div>
        </div>
        <div className="calendar-days">
          {days.map((day, i) => (
            <div 
              key={i} 
              className={`calendar-day ${day ? 'active' : 'empty'}`}
              onClick={() => day && handleDayClick(day)}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Calculate available budget (based on input budget, not affected by expenses)
  const getAvailableBudget = () => {
    const totalSpent = calculateTotalExpenses();
    return budget - totalSpent;
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCalendar !== null && calendarRefs.current[showCalendar] && 
          !calendarRefs.current[showCalendar].contains(event.target) &&
          !event.target.classList.contains('calendar-icon')) {
        setShowCalendar(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  // Ensure refs have enough slots for all expenses
  useEffect(() => {
    dateInputRefs.current = dateInputRefs.current.slice(0, expenses.length);
    calendarRefs.current = calendarRefs.current.slice(0, expenses.length);
    
    while (dateInputRefs.current.length < expenses.length) {
      dateInputRefs.current.push(null);
      calendarRefs.current.push(null);
    }
  }, [expenses.length]);

  // Is the available budget below the limit?
  const isBelowLimit = () => {
    const availableBudget = getAvailableBudget();
    return availableBudget < 0 || calculateTotalExpenses() > limit;
  };

  return (
    <div className="wallet-container">
      <Sidebar />
      <div className="wallet-content">
        <h1 className="wallet-title">Wallet</h1>
        <hr className="section-line" />

        {/* Budget Section */}
        <div className="budget-card" onClick={() => setShowModal(true)}>
          <div className="progress-circle-container">
            <div className="progress-circle">
              <svg width="180" height="180" viewBox="0 0 180 180">
                <circle 
                  className="progress-bg" 
                  cx="90" 
                  cy="90" 
                  r="80" 
                  strokeWidth="16" 
                  fill="none"
                />
                <circle
                  className="progress-bar"
                  cx="90"
                  cy="90"
                  r="80"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray="502.4"
                  strokeDashoffset={502.4 - (calculateProgress() / 100) * 502.4}
                  stroke={getProgressColor(calculateProgress())}
                  strokeLinecap="round"
                />
                {/* Budget Limit Marker */}
                {limit > 0 && (
                  <line 
                    x1="90" 
                    y1="10" 
                    x2="90" 
                    y2="25" 
                    stroke="#235055" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                  />
                )}
              </svg>
              <div className="progress-info">
                <span className="progress-amount">₹{getAvailableBudget()}</span>
                <span className="progress-label">Available</span>
              </div>
              {limit > 0 && (
                <div className="limit-label">
                  <span>Limit: ₹{limit}</span>
                </div>
              )}
            </div>
          </div>
          <p className="budget-label">Budget</p>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Set Your Budget</h2>
              <div className="input-group">
                <label>Available Budget</label>
                <input
                  type="number"
                  value={budget}
                  placeholder="Enter your available budget"
                  onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="input-group">
                <label>Spending Limit</label>
                <input
                  type="number"
                  value={limit}
                  placeholder="Enter your spending limit"
                  onChange={(e) => setLimit(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="modal-actions">
                <button className="modal-button cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="modal-button save" onClick={saveBudgetSettings}>Save</button>
              </div>
            </div>
          </div>
        )}

        <hr className="section-line" />
        <h2>Categories</h2>
        <hr className="section-line" />

        {/* Categories */}
        <div className="categories">
          {Object.entries(categoryTotals).map(([category, amount]) => (
            <div key={category} className="category-card" style={{ backgroundColor: categories[category] }}>
              <p className="category-name">{category}</p>
              <span className="category-amount">₹{amount}</span>
            </div>
          ))}
        </div>

        <hr className="section-line" />
        <h2>Expenses</h2>
        <hr className="section-line" />

        {/* Expenses Table */}
        <div className="table-container">
          <table className="expense-table">
            <thead>
              <tr>
                <th className="date-column">Date</th>
                <th className="name-column">Name</th>
                <th className="amount-column">Amount</th>
                <th className="category-column">Category</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr key={index}>
                  <td className="date-cell">
                    <div className="date-picker">
                      <Calendar 
                        className="calendar-icon" 
                        size={18} 
                        onClick={(e) => handleCalendarClick(index, e)}
                      />
                      <span className="formatted-date">{formatDate(expense.date)}</span>
                      
                      {/* Custom Calendar Dropdown */}
                      {showCalendar === index && (
                        <CustomCalendar 
                          index={index} 
                          onSelectDate={(date) => selectDate(index, date)} 
                        />
                      )}
                    </div>
                  </td>
                  <td className="editable-cell">
                    <span 
                      className="editable-content"
                      contentEditable="true"
                      onBlur={(e) => handleExpenseChange(index, "name", e.target.innerText)}
                      suppressContentEditableWarning={true}
                      data-placeholder="Enter name"
                    >
                      {expense.name || ""}
                    </span>
                  </td>
                  <td className="amount-cell">
                    <span className="currency-symbol">₹</span>
                    <span 
                      className="editable-content" 
                      contentEditable="true"
                      onBlur={(e) => {
                        const value = e.target.innerText.replace(/[^\d.]/g, '');
                        e.target.innerText = value;
                        handleExpenseChange(index, "amount", value);
                      }}
                      suppressContentEditableWarning={true}
                      data-placeholder="0"
                    >
                      {expense.amount || ""}
                    </span>
                  </td>
                  <td className="category-cell">
                    <div className="category-selector">
                      <button 
                        className="category-btn"
                        style={{ backgroundColor: categories[expense.category] || "#ccc" }}
                        onClick={() => toggleCategoryDropdown(index)}
                      >
                        {expense.category || "Select Category"}
                      </button>
                      
                      {activeCategoryDropdown === index && (
                        <div className="category-dropdown">
                          {Object.keys(categories).map((cat) => (
                            <button
                              key={cat}
                              className="category-option"
                              style={{ backgroundColor: categories[cat] }}
                              onClick={() => {
                                handleExpenseChange(index, "category", cat);
                                toggleCategoryDropdown(null);
                              }}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="add-expense-row" onClick={handleAddExpense}>
                <td colSpan="4">+ Add New Expense</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}