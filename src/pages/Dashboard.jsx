import { useState, useEffect } from "react"
import Sidebar from '../components/Sidebar'
import { CATEGORY_ICONS } from "../components/Sidebar"
import api from "../api/axios"

export default function Dashboard() {
  const [expenses, setExpenses] = useState([])
  const [monthly, setMonthly] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=> {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try{
      const[expRes, monthRes, catRes] = await Promise.all([
        api.get('/api/expenses'),
        api.get('/api/reports/monthly'),
        api.get('/api/reports/category')
      ])
      setExpenses(expRes.data)
      setMonthly(monthRes.data)
      setCategories(catRes.data)
    }catch (err){
      console.error(err)
    }finally{
      setLoading(false)
    }
  }
  
  // Total monthly
  const thisMonth = monthly[0]?.total || 0

  // Top Category
  const topCategory = categories.length ? categories.reduce((a, b) => (a.total > b.total ? a:b)): null

  // Most recent expenses (5)
  const recent = expenses.slice(0, 5)

  // Max total for barChart scaling
  const maxCatTotal = categories.length ? Math.max(...categories.map((c) => c.total)) : 1

  if (loading) return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="loading">Loading...</div>
      </div>
    </div>
  )

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">

        <div className="page-header">
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Your spending overview</div>
        </div>

        {/* Stat cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">This month</div>
            <div className="stat-value">
              ₹{Number(thisMonth).toLocaleString('en-IN')}
            </div>
            <div className="stat-sub">{monthly[0]?.month || '—'}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total expenses</div>
            <div className="stat-value">{expenses.length}</div>
            <div className="stat-sub">all time</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Top category</div>
            <div className="stat-value" style={{ fontSize: '16px', marginTop: '4px' }}>
              {topCategory
                ? `${CATEGORY_ICONS[topCategory.category]} ${topCategory.category}`
                : '—'}
            </div>
            <div className="stat-sub">
              {topCategory
                ? `₹${Number(topCategory.total).toLocaleString('en-IN')}`
                : ''}
            </div>
          </div>
        </div>

        <div className="two-col">
          {/* Recent expenses */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Recent expenses</div>
            </div>
            {recent.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-title">No expenses yet</div>
                <div>Add your first expense to get started</div>
              </div>
            ) : (
              <div className="expense-list">
                {recent.map((exp) => (
                  <div className="expense-row" key={exp.id}>
                    <div className={`expense-icon icon-${exp.category}`}>
                      {CATEGORY_ICONS[exp.category]}
                    </div>
                    <div className="expense-info">
                      <div className="expense-title">{exp.title}</div>
                      <div className="expense-date">{exp.expenseDate}</div>
                    </div>
                    <span className={`badge badge-${exp.category}`}>
                      {exp.category}
                    </span>
                    <div className="expense-amount">
                      ₹{Number(exp.amount).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category breakdown */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Spending by category</div>
            </div>
            {categories.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-title">No data yet</div>
              </div>
            ) : (
              categories.map((cat) => (
                <div className="chart-bar-item" key={cat.category}>
                  <div className="chart-bar-label">
                    {CATEGORY_ICONS[cat.category]} {cat.category}
                  </div>
                  <div className="chart-bar-track">
                    <div
                      className="chart-bar-fill"
                      style={{
                        width: `${(cat.total / maxCatTotal) * 100}%`,
                        background: '#1D9E75',
                      }}
                    />
                  </div>
                  <div className="chart-bar-value">
                    ₹{Number(cat.total).toLocaleString('en-IN')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

