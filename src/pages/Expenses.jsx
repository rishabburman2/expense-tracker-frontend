import { useState, useEffect } from 'react'
import Sidebar, { CATEGORY_ICONS } from '../components/Sidebar'
import api from '../api/axios'

const CATEGORIES = ['FOOD', 'TRAVEL', 'RENT', 'HEALTH', 'OTHER']

const emptyForm = {
  title: '',
  amount: '',
  category: 'FOOD',
  expenseDate: new Date().toISOString().split('T')[0],
  note: '',
}

export default function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/api/expenses')
      setExpenses(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const openAdd = () => {
    setForm(emptyForm)
    setEditingId(null)
    setError('')
    setShowModal(true)
  }

  const openEdit = (exp) => {
    setForm({
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      expenseDate: exp.expenseDate,
      note: exp.note || '',
    })
    setEditingId(exp.id)
    setError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    setForm(emptyForm)
    setError('')
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (editingId) {
        await api.put(`/api/expenses/${editingId}`, form)
      } else {
        await api.post('/api/expenses', form)
      }
      await fetchExpenses()
      closeModal()
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return
    try {
      await api.delete(`/api/expenses/${id}`)
      setExpenses(expenses.filter((e) => e.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">

        <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="page-title">Expenses</div>
            <div className="page-subtitle">{expenses.length} total</div>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>
            + Add expense
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : expenses.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-title">No expenses yet</div>
              <div>Click "Add expense" to get started</div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: '0' }}>
            <div className="expense-list" style={{ gap: '0' }}>
              {expenses.map((exp) => (
                <div
                  className="expense-row"
                  key={exp.id}
                  style={{ borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
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
                  <div className="expense-actions">
                    <button className="btn btn-sm" onClick={() => openEdit(exp)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(exp.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add / Edit modal */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">
                  {editingId ? 'Edit expense' : 'Add expense'}
                </div>
                <button className="btn btn-sm" onClick={closeModal}>✕</button>
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    className="form-input"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Swiggy dinner"
                    required
                  />
                </div>

                <div className="two-col">
                  <div className="form-group">
                    <label className="form-label">Amount (₹)</label>
                    <input
                      className="form-input"
                      name="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.amount}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      name="category"
                      value={form.category}
                      onChange={handleChange}>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {CATEGORY_ICONS[cat]} {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    className="form-input"
                    name="expenseDate"
                    type="date"
                    value={form.expenseDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Note (optional)</label>
                  <input
                    className="form-input"
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    placeholder="Any details..."
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn" onClick={closeModal}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}>
                    {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add expense'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}