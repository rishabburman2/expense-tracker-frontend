import { useEffect, useState } from "react"
import Sidebar, { CATEGORY_ICONS } from '../components/Sidebar'
import api from '../api/axios'

export default function Reports() {
  
  const [monthly, setMonthly] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try{
      const [monthRes, catRes] = await Promise.all([
        api.get('/api/reports/monthly'),
        api.get('/api/reports/category'),
      ])
      setMonthly(monthRes.data)
      setCategories(catRes.data)
    } catch (err){
      console.error(err)
    } finally{
      setLoading(false)
    }
  }

  const maxMonthly = monthly.length ? Math.max(...monthly.map((m) => Number(m.total))) : 1
  const maxCategory = categories.length ? Math.max(...categories.map((c) => Number(c.total))) :1
  const totalSpend = categories.reduce((sum, c) => sum + Number(c.total), 0)

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
          <div className="page-title">Reports</div>
          <div className="page-subtitle">Spending analysis</div>
        </div>

        {/* Summary stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="stat-card">
            <div className="stat-label">Total spend</div>
            <div className="stat-value">
              ₹{totalSpend.toLocaleString('en-IN')}
            </div>
            <div className="stat-sub">all time</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Months tracked</div>
            <div className="stat-value">{monthly.length}</div>
            <div className="stat-sub">months</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Categories used</div>
            <div className="stat-value">{categories.length}</div>
            <div className="stat-sub">of 5 total</div>
          </div>
        </div>

        <div className="two-col">
          {/* Monthly breakdown */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Monthly spending</div>
            </div>
            {monthly.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-title">No data yet</div>
              </div>
            ) : (
              monthly.map((m) => (
                <div className="chart-bar-item" key={m.month}>
                  <div className="chart-bar-label">{m.month}</div>
                  <div className="chart-bar-track">
                    <div
                      className="chart-bar-fill"
                      style={{
                        width: `${(Number(m.total) / Number(maxMonthly)) * 100}%`,
                        background: '#378ADD',
                      }}
                    />
                  </div>
                  <div className="chart-bar-value">
                    ₹{Number(m.total).toLocaleString('en-IN')}
                  </div>
                </div>
              ))
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
                <div key={cat.category}>
                  <div className="chart-bar-item">
                    <div className="chart-bar-label">
                      {CATEGORY_ICONS[cat.category]} {cat.category}
                    </div>
                    <div className="chart-bar-track">
                      <div
                        className="chart-bar-fill"
                        style={{
                          width: `${(Number(cat.total) / Number(maxCategory)) * 100}%`,
                          background: '#1D9E75',
                        }}
                      />
                    </div>
                    <div className="chart-bar-value">
                      ₹{Number(cat.total).toLocaleString('en-IN')}
                    </div>
                  </div>
                  {/* Percentage of total */}
                  <div style={{
                    fontSize: '11px',
                    color: '#9b9b9b',
                    marginLeft: '70px',
                    marginTop: '-6px',
                    marginBottom: '8px'
                  }}>
                    {totalSpend > 0
                      ? `${((cat.total / totalSpend) * 100).toFixed(1)}% of total`
                      : ''}
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
