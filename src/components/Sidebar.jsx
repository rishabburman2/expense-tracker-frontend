import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext'

export const CATEGORY_ICONS = {
    FOOD: '🍔',
    TRAVEL: '✈️',
    RENT: '🏠',
    HEALTH: '💊',
    OTHER: '📦',
}

export default function Sidebar() {
    
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    // Get Initials from name for avatar
    const initials = user?.name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <div className="sidebar">
        <div className="sidebar-logo">💰 ExpenseTracker</div>

        <nav className="sidebar-nav">
            {/* NavLink automatically adds 'active' class when route matches */}
            <NavLink to="/" end className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`}>
            📊 Dashboard
            </NavLink>
            <NavLink to="/expenses" className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`}>
            🧾 Expenses
            </NavLink>
            <NavLink to="/reports" className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`}>
            📈 Reports
            </NavLink>
        </nav>

        <div className="sidebar-user">
            <div className="user-row">
            <div className="avatar">{initials}</div>
            <div className="user-info">
                <div className="user-name">{user?.name}</div>
                <div className="user-email">{user?.email}</div>
            </div>
            </div>
            <button
            className="logout-btn"
            onClick={handleLogout}
            style={{ marginTop: '10px' }}>
            Sign out
            </button>
        </div>
        </div>
    )    

}