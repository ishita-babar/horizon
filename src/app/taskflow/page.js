"use client";
import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import "./taskflow.css";

const CustomCalendar = ({ index, onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selectedDate);
    onSelectDate(selectedDate);
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div 
          key={`day-${day}`} 
          className="calendar-day active"
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="custom-calendar">
      <div className="calendar-header">
        <button className="calendar-nav" onClick={prevMonth}>
          <ChevronLeft size={16} />
        </button>
        <div className="calendar-title">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <button className="calendar-nav" onClick={nextMonth}>
          <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="calendar-weekdays">
        {weekdays.map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>
      
      <div className="calendar-days">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default function Taskflow() {
  const [tasks, setTasks] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [modalTask, setModalTask] = useState(null);
  const [showCalendar, setShowCalendar] = useState(null);

  const handleAddTask = () => {
    setTasks([...tasks, { name: "", status: "Not started", dueDate: "", priority: "Low", description: "", progress: 0 }]);
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].status = newStatus;
    setTasks(updatedTasks);
    setActiveDropdown(null);
  };

  const handlePriorityChange = (index, newPriority) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].priority = newPriority;
    setTasks(updatedTasks);
    setActiveDropdown(null);
  };

  const handleEdit = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };

  const handleProgressClick = (index) => {
    setModalTask(index);
  };

  const closeModal = () => {
    setModalTask(null);
  };

  const toggleDropdown = (dropdownId) => {
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  const handleCalendarClick = (index, e) => {
    e.stopPropagation();
    setShowCalendar(showCalendar === index ? null : index);
    setActiveDropdown(null);
  };

  const selectDate = (index, date) => {
    const formattedDate = formatDate(date);
    handleEdit(index, "dueDate", formattedDate);
    setShowCalendar(null);
  };

  const formatDate = (date) => {
    if (!date) return "";
    if (typeof date === 'string') return date;
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  const handleClickOutside = () => {
    setActiveDropdown(null);
    setShowCalendar(null);
  };

  return (
    <div className="taskflow-container" onClick={handleClickOutside}>
      <Sidebar />
      <div className="content">
        <h1 className="taskflow-title">Taskflow</h1>

        {modalTask !== null && tasks[modalTask] && (
          <div className="modal-overlay">
            <div className="modal">
              <h2 className="modal-title">{tasks[modalTask].name || "Unnamed Task"}</h2>
              <div className="progress-container">
                <svg width="180" height="180">
                  <circle cx="90" cy="90" r="80" stroke="#C2D2D1" strokeWidth="12" fill="none"/>
                  <circle
                    cx="90"
                    cy="90"
                    r="80"
                    stroke="#27593E"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray="502.4"
                    strokeDashoffset={502.4 - (tasks[modalTask].progress / 100) * 502.4}
                    strokeLinecap="round"
                    transform="rotate(-90 90 90)"
                  />
                </svg>
                <p className="progress-text">{tasks[modalTask].progress}%</p>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={tasks[modalTask].progress}
                onChange={(e) => handleEdit(modalTask, "progress", parseInt(e.target.value, 10))}
                className="progress-slider"
              />
              <button className="close-modal" onClick={closeModal}>Close</button>
            </div>
          </div>
        )}

        <div className="progress-section">
          {tasks.map((task, index) => (
            <div key={index} className="task-progress-card" onClick={() => handleProgressClick(index)}>
              <div className="progress-circle">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle className="progress-bg" cx="70" cy="70" r="60" strokeWidth="8" />
                  <circle
                    className="progress-bar"
                    cx="70" cy="70" r="60"
                    strokeWidth="8"
                    strokeDasharray="377"
                    strokeDashoffset={377 - (task.progress / 100) * 377}
                    transform="rotate(-90 70 70)"
                  />
                </svg>
                <span className="progress-text">{task.progress}%</span>
              </div>
              <p className="task-name">{task.name || "Unnamed Task"}</p>
            </div>
          ))}
        </div>

        <table className="task-table">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td
                  contentEditable
                  className="editable"
                  suppressContentEditableWarning
                  onInput={(e) => handleEdit(index, "name", e.target.innerText)}
                ></td>

                <td>
                  <div className="status-dropdown" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className={`status-btn ${task.status.toLowerCase().replace(" ", "-")}`} 
                      onClick={() => toggleDropdown(`status-${index}`)}
                    >
                      {task.status}
                    </button>
                    {activeDropdown === `status-${index}` && (
                      <div className="dropdown-menu">
                        <button className="status-option in-progress" onClick={() => handleStatusChange(index, "In Progress")}>In Progress</button>
                        <button className="status-option done" onClick={() => handleStatusChange(index, "Done")}>Done</button>
                        <button className="status-option not-started" onClick={() => handleStatusChange(index, "Not started")}>Not Started</button>
                      </div>
                    )}
                  </div>
                </td>

                <td className="date-cell">
                  <div className="date-picker" onClick={(e) => e.stopPropagation()}>
                    <Calendar 
                      className="calendar-icon" 
                      size={18} 
                      onClick={(e) => handleCalendarClick(index, e)}
                    />
                    <span className="formatted-date">
                      {task.dueDate || "Select Date"}
                    </span>
                    
                    {/* Custom Calendar Dropdown */}
                    {showCalendar === index && (
                      <CustomCalendar 
                        index={index} 
                        onSelectDate={(date) => selectDate(index, date)} 
                      />
                    )}
                  </div>
                </td>

                <td>
                  <div className="priority-dropdown" onClick={(e) => e.stopPropagation()}>
                    <button
                      className={`priority-btn ${task.priority ? task.priority.toLowerCase() : 'low'}`}
                      onClick={() => toggleDropdown(`priority-${index}`)}
                    >
                      {task.priority || "Low"}
                    </button>
                    {activeDropdown === `priority-${index}` && (
                      <div className="dropdown-menu">
                        <button className="priority-option low" onClick={() => handlePriorityChange(index, "Low")}>Low</button>
                        <button className="priority-option medium" onClick={() => handlePriorityChange(index, "Medium")}>Medium</button>
                        <button className="priority-option high" onClick={() => handlePriorityChange(index, "High")}>High</button>
                      </div>
                    )}
                  </div>
                </td>

                <td
                  contentEditable
                  className="editable"
                  suppressContentEditableWarning
                  onInput={(e) => handleEdit(index, "description", e.target.innerText)}
                ></td>
              </tr>
            ))}
            <tr className="add-task-row" onClick={handleAddTask}>
              <td colSpan="5">+ New Task</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}