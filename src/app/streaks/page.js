"use client";
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import "./streaks.css";

export default function Streaks() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysArray = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      daysArray.push(new Date(year, month, i));
    }
    
    setCalendarDays(daysArray);
  }, [currentDate]);

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (newHabit.trim() !== "") {
      const habit = {
        id: Date.now(),
        name: newHabit,
        completedDays: [],
        streak: 0
      };
      
      setHabits([...habits, habit]);
      setNewHabit("");
    }
  };

  const toggleHabitCompletion = (habitId, date) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const dateStr = date.toISOString().split('T')[0];
        let completedDays = [...habit.completedDays];
        
        if (completedDays.includes(dateStr)) {
          completedDays = completedDays.filter(day => day !== dateStr);
        } else {
          completedDays.push(dateStr);
        }
        
        const sortedDays = [...completedDays].sort();
        let currentStreak = 0;

        if (sortedDays.length > 0) {
          const today = new Date().toISOString().split('T')[0];
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          
          if (sortedDays.includes(today)) {
            currentStreak = 1;
            let checkDate = yesterday;
            let i = 2;
            
            while (sortedDays.includes(checkDate)) {
              currentStreak = i;
              i++;
              checkDate = new Date(Date.now() - 86400000 * (i - 1)).toISOString().split('T')[0];
            }
          }
        }
        
        return {
          ...habit,
          completedDays,
          streak: currentStreak
        };
      }
      return habit;
    }));
  };

  const calculateProgress = (habit) => {
    if (calendarDays.length === 0) return 0;
    
    const completedInCurrentMonth = calendarDays.filter(day => 
      habit.completedDays.includes(day.toISOString().split('T')[0])
    ).length;
    
    return Math.round((completedInCurrentMonth / calendarDays.length) * 100);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="streaks-container">
      <Sidebar />
      <div className="main-content">
        <h1 className="page-title">Habit Tracker</h1>
        <div className="divider"></div>
        
        <form className="add-habit-form" onSubmit={handleAddHabit}>
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Enter a new habit..."
            className="habit-input"
          />
          <button type="submit" className="add-btn">Add Habit</button>
        </form>
        
        {habits.length > 0 ? (
          <div className="habits-container">
            <div className="month-navigation">
              <button onClick={previousMonth} className="nav-btn">&lt;</button>
              <h2>{formatDate(currentDate)}</h2>
              <button onClick={nextMonth} className="nav-btn">&gt;</button>
            </div>
            
            <div className="calendar">
              <div className="calendar-header">
                <div className="day-header">Sun</div>
                <div className="day-header">Mon</div>
                <div className="day-header">Tue</div>
                <div className="day-header">Wed</div>
                <div className="day-header">Thu</div>
                <div className="day-header">Fri</div>
                <div className="day-header">Sat</div>
              </div>
              
              <div className="calendar-grid">
                {Array.from({ length: calendarDays[0]?.getDay() || 0 }).map((_, index) => (
                  <div key={`empty-${index}`} className="calendar-day empty"></div>
                ))}
                {calendarDays.map((day) => (
                  <div key={day.toISOString()} className="calendar-day">
                    <div className="day-number">{day.getDate()}</div>
                    <div className="habits-for-day">
                      {habits.map(habit => {
                        const dateStr = day.toISOString().split('T')[0];
                        const completed = habit.completedDays.includes(dateStr);
                        
                        return (
                          <div
                            key={`${habit.id}-${dateStr}`}
                            className="habit-day-item"
                          >
                            <div 
                              className={`habit-mark ${completed ? 'completed' : ''}`}
                              onClick={() => toggleHabitCompletion(habit.id, day)}
                            ></div>
                            <span className="habit-day-name">{habit.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="habits-list">
              <h3>Your Habits</h3>
              {habits.map(habit => (
                <div key={habit.id} className="habit-item">
                  <div className="habit-info">
                    <span className="habit-name">{habit.name}</span>
                    <span className="habit-streak">🔥 {habit.streak} day streak</span>
                  </div>
                  <div className="progress-container">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${calculateProgress(habit)}%` }}
                    ></div>
                    <span className="progress-text">{calculateProgress(habit)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-habits">
            <p>No habits added yet. Add your first habit to start tracking!</p>
          </div>
        )}
      </div>
    </div>
  );
}