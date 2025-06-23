import React, { useState, useContext, createContext, useEffect } from 'react';
import './App.css';

// Theme Context
const ThemeContext = createContext();

// Theme Provider Component
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom Hook for Theme
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Header Component
const Header = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">Admin Dashboard</h1>
        <div className="header-actions">
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <div className="user-profile">
            <span>Admin User</span>
            <div className="avatar">👤</div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Sidebar Component
const Sidebar = ({ activeTab, setActiveTab, isSidebarOpen, toggleSidebar }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'tables', label: 'Data Tables', icon: '📋' },
    { id: 'charts', label: 'Charts', icon: '📈' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'kanban', label: 'Kanban Board', icon: '🗂️' }
  ];

  return (
    <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isSidebarOpen ? '◀' : '▶'}
      </button>
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {isSidebarOpen && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
};

// Dashboard Overview Component
const Dashboard = () => {
  const stats = [
    { title: 'Total Users', value: '12,345', trend: '+5.2%', color: 'blue' },
    { title: 'Revenue', value: '$45,678', trend: '+12.3%', color: 'green' },
    { title: 'Orders', value: '2,456', trend: '-2.1%', color: 'orange' },
    { title: 'Conversion Rate', value: '3.24%', trend: '+0.8%', color: 'purple' }
  ];

  return (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-header">
              <h3>{stat.title}</h3>
              <span className={`trend ${stat.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                {stat.trend}
              </span>
            </div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>
      <div className="dashboard-charts">
        <div className="chart-container">
          <h3>Monthly Revenue</h3>
          <div className="mini-chart">
            <div className="chart-bars">
              {[40, 65, 45, 80, 55, 70, 85, 60, 75, 90, 65, 80].map((height, i) => (
                <div key={i} className="bar" style={{ height: `${height}%` }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Data Tables Component
const DataTables = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [data, setData] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', status: 'Pending' },
    { id: 6, name: 'Diana Davis', email: 'diana@example.com', role: 'User', status: 'Active' },
    { id: 7, name: 'Edward Miller', email: 'edward@example.com', role: 'Manager', status: 'Inactive' }
  ]);

  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
  };

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  return (
    <div className="data-tables">
      <h2>Data Tables</h2>
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="export-btn">Export CSV</button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('email')} className="sortable">
                Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('role')} className="sortable">
                Role {sortField === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('status')} className="sortable">
                Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.role}</td>
                <td>
                  <span className={`status ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <button className="action-btn edit">✏️</button>
                  <button className="action-btn delete">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Charts Component
const Charts = () => {
  const [activeChart, setActiveChart] = useState('line');
  const [chartData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [65, 78, 66, 89, 78, 95],
    categories: ['Product A', 'Product B', 'Product C', 'Product D'],
    categoryValues: [35, 25, 25, 15]
  });

  const LineChart = () => (
    <div className="chart-wrapper">
      <h3>Revenue Trend</h3>
      <div className="line-chart">
        <div className="chart-grid">
          {chartData.values.map((value, index) => (
            <div key={index} className="data-point" style={{ height: `${value}%` }}>
              <div className="point"></div>
              <span className="label">{chartData.labels[index]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const BarChart = () => (
    <div className="chart-wrapper">
      <h3>Sales by Category</h3>
      <div className="bar-chart">
        {chartData.categoryValues.map((value, index) => (
          <div key={index} className="bar-item">
            <div className="bar" style={{ height: `${value * 4}px` }}></div>
            <span className="bar-label">{chartData.categories[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const PieChart = () => (
    <div className="chart-wrapper">
      <h3>Market Share</h3>
      <div className="pie-chart">
        <div className="pie-slice slice-1" style={{ '--percentage': '35' }}></div>
        <div className="pie-slice slice-2" style={{ '--percentage': '25' }}></div>
        <div className="pie-slice slice-3" style={{ '--percentage': '25' }}></div>
        <div className="pie-slice slice-4" style={{ '--percentage': '15' }}></div>
        <div className="pie-center">100%</div>
      </div>
      <div className="pie-legend">
        {chartData.categories.map((category, index) => (
          <div key={index} className={`legend-item color-${index + 1}`}>
            <span className="legend-color"></span>
            <span>{category}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="charts">
      <h2>Charts & Analytics</h2>
      <div className="chart-tabs">
        <button
          className={activeChart === 'line' ? 'active' : ''}
          onClick={() => setActiveChart('line')}
        >
          Line Chart
        </button>
        <button
          className={activeChart === 'bar' ? 'active' : ''}
          onClick={() => setActiveChart('bar')}
        >
          Bar Chart
        </button>
        <button
          className={activeChart === 'pie' ? 'active' : ''}
          onClick={() => setActiveChart('pie')}
        >
          Pie Chart
        </button>
      </div>
      <div className="chart-content">
        {activeChart === 'line' && <LineChart />}
        {activeChart === 'bar' && <BarChart />}
        {activeChart === 'pie' && <PieChart />}
      </div>
    </div>
  );
};

// Calendar Component
const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([
    { id: 1, date: '2024-01-15', title: 'Team Meeting', type: 'meeting' },
    { id: 2, date: '2024-01-18', title: 'Project Deadline', type: 'deadline' },
    { id: 3, date: '2024-01-22', title: 'Client Presentation', type: 'presentation' }
  ]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'meeting' });

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setNewEvent({ ...newEvent, date: clickedDate.toISOString().split('T')[0] });
    setShowEventModal(true);
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date) {
      setEvents([...events, { ...newEvent, id: Date.now() }]);
      setNewEvent({ title: '', date: '', type: 'meeting' });
      setShowEventModal(false);
    }
  };

  const getEventsForDate = (day) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  return (
    <div className="calendar">
      <h2>Calendar</h2>
      <div className="calendar-header">
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
          ◀ Previous
        </button>
        <h3>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
          Next ▶
        </button>
      </div>
      <div className="calendar-grid">
        <div className="calendar-days">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="day-header">{day}</div>
          ))}
        </div>
        <div className="calendar-dates">
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} className="calendar-date empty"></div>
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDate(day);
            return (
              <div
                key={day}
                className="calendar-date"
                onClick={() => handleDateClick(day)}
              >
                <span className="date-number">{day}</span>
                {dayEvents.length > 0 && (
                  <div className="event-indicators">
                    {dayEvents.map(event => (
                      <div key={event.id} className={`event-dot ${event.type}`}></div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showEventModal && (
        <div className="modal-overlay" onClick={() => setShowEventModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Event</h3>
            <input
              type="text"
              placeholder="Event title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            />
            <select
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
            >
              <option value="meeting">Meeting</option>
              <option value="deadline">Deadline</option>
              <option value="presentation">Presentation</option>
            </select>
            <div className="modal-actions">
              <button onClick={handleAddEvent}>Add Event</button>
              <button onClick={() => setShowEventModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Kanban Board Component
const KanbanBoard = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Design Homepage', description: 'Create wireframes and mockups', status: 'todo', priority: 'high' },
    { id: 2, title: 'Implement Authentication', description: 'Add login and signup functionality', status: 'inprogress', priority: 'medium' },
    { id: 3, title: 'Database Setup', description: 'Configure PostgreSQL database', status: 'testing', priority: 'high' },
    { id: 4, title: 'Deploy to Production', description: 'Setup CI/CD pipeline', status: 'done', priority: 'low' },
  ]);
  const [draggedTask, setDraggedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' });

  const columns = [
    { id: 'todo', title: 'To Do', color: 'blue' },
    { id: 'inprogress', title: 'In Progress', color: 'orange' },
    { id: 'testing', title: 'Testing', color: 'purple' },
    { id: 'done', title: 'Done', color: 'green' }
  ];

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    if (draggedTask) {
      setTasks(tasks.map(task =>
        task.id === draggedTask.id ? { ...task, status } : task
      ));
      setDraggedTask(null);
    }
  };

  const handleAddTask = () => {
    if (newTask.title) {
      setTasks([...tasks, { ...newTask, id: Date.now(), status: 'todo' }]);
      setNewTask({ title: '', description: '', priority: 'medium' });
      setShowTaskModal(false);
    }
  };

  const TaskCard = ({ task }) => (
    <div
      className={`task-card priority-${task.priority}`}
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
    >
      <div className="task-header">
        <h4>{task.title}</h4>
        <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
      </div>
      <p>{task.description}</p>
      <div className="task-footer">
        <span className="task-id">#{task.id}</span>
      </div>
    </div>
  );

  return (
    <div className="kanban-board">
      <div className="kanban-header">
        <h2>Kanban Board</h2>
        <button className="add-task-btn" onClick={() => setShowTaskModal(true)}>
          + Add Task
        </button>
      </div>
      <div className="kanban-columns">
        {columns.map(column => (
          <div
            key={column.id}
            className={`kanban-column ${column.color}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="column-header">
              <h3>{column.title}</h3>
              <span className="task-count">
                {tasks.filter(task => task.status === column.id).length}
              </span>
            </div>
            <div className="column-tasks">
              {tasks
                .filter(task => task.status === column.id)
                .map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
            </div>
          </div>
        ))}
      </div>

      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Task</h3>
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <textarea
              placeholder="Task description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <div className="modal-actions">
              <button onClick={handleAddTask}>Add Task</button>
              <button onClick={() => setShowTaskModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Component
const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tables':
        return <DataTables />;
      case 'charts':
        return <Charts />;
      case 'calendar':
        return <Calendar />;
      case 'kanban':
        return <KanbanBoard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
          <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            {renderContent()}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
