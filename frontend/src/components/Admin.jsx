import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LogOut, Calendar, Users, MessageSquare, BarChart3, 
  Check, X, Clock, ChevronRight, RefreshCw, Eye
} from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include'
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem('adminToken');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('adminToken', data.token);
    setUser(data);
    return data;
  };

  const logout = async () => {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    localStorage.removeItem('adminToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Login Page
export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-secondary flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-text-primary mb-2">Admin Login</h1>
            <p className="text-text-secondary">Emavaran Dashboard</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                data-testid="admin-email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                data-testid="admin-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading} data-testid="admin-login-btn">
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// Admin Dashboard
export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [statsRes, bookingsRes, contactsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, { headers }),
        fetch(`${API_URL}/api/admin/bookings`, { headers }),
        fetch(`${API_URL}/api/admin/contacts`, { headers })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (bookingsRes.ok) setBookings(await bookingsRes.json());
      if (contactsRes.ok) setContacts(await contactsRes.json());
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchData();
        setSelectedBooking(null);
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (!user) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'contacts', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-serif text-text-primary">Emavaran Admin</h1>
            <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-sm">
              {user.name}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={fetchData} data-testid="refresh-data">
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} data-testid="admin-logout">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex space-x-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-xl font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-brand-primary text-white' 
                  : 'bg-white text-text-secondary hover:bg-background-primary'
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && stats && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard title="Total Bookings" value={stats.total_bookings} icon={Calendar} />
                  <StatCard title="Pending" value={stats.pending_bookings} icon={Clock} color="yellow" />
                  <StatCard title="Confirmed" value={stats.confirmed_bookings} icon={Check} color="green" />
                  <StatCard title="Today's Sessions" value={stats.today_bookings} icon={Users} color="blue" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-serif text-text-primary mb-4">Recent Bookings</h3>
                    <div className="space-y-3">
                      {bookings.slice(0, 5).map(booking => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-background-secondary rounded-xl">
                          <div>
                            <p className="font-medium text-text-primary">{booking.name}</p>
                            <p className="text-sm text-text-secondary">{booking.date} at {booking.time}</p>
                          </div>
                          <StatusBadge status={booking.status} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-serif text-text-primary mb-4">Recent Messages</h3>
                    <div className="space-y-3">
                      {contacts.slice(0, 5).map(contact => (
                        <div key={contact.id} className="p-3 bg-background-secondary rounded-xl">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-text-primary">{contact.name}</p>
                            <p className="text-xs text-text-secondary">{contact.created_at?.split('T')[0]}</p>
                          </div>
                          <p className="text-sm text-text-secondary truncate">{contact.subject}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-serif text-text-primary">All Bookings</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full" data-testid="bookings-table">
                      <thead className="bg-background-secondary">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Client</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Contact</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Therapist</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Date & Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {bookings.map(booking => (
                          <tr key={booking.id} className="hover:bg-background-secondary/50">
                            <td className="px-6 py-4">
                              <p className="font-medium text-text-primary">{booking.name}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-text-secondary">{booking.email}</p>
                              <p className="text-sm text-text-secondary">{booking.phone}</p>
                            </td>
                            <td className="px-6 py-4 capitalize">{booking.therapist}</td>
                            <td className="px-6 py-4">
                              <p className="text-text-primary">{booking.date}</p>
                              <p className="text-sm text-text-secondary">{booking.time}</p>
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge status={booking.status} />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => setSelectedBooking(booking)}
                                  className="p-2 hover:bg-background-secondary rounded-lg"
                                  data-testid={`view-booking-${booking.id}`}
                                >
                                  <Eye className="h-4 w-4 text-text-secondary" />
                                </button>
                                {booking.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                      className="p-2 hover:bg-green-50 rounded-lg text-green-600"
                                      data-testid={`confirm-booking-${booking.id}`}
                                    >
                                      <Check className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                      className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                                      data-testid={`cancel-booking-${booking.id}`}
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Contacts Tab */}
            {activeTab === 'contacts' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-white rounded-2xl shadow-sm">
                  <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-serif text-text-primary">Contact Messages</h3>
                  </div>
                  <div className="divide-y divide-border">
                    {contacts.map(contact => (
                      <div key={contact.id} className="p-6 hover:bg-background-secondary/50" data-testid={`contact-${contact.id}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-medium text-text-primary">{contact.name}</p>
                            <p className="text-sm text-text-secondary">{contact.email} {contact.phone && `• ${contact.phone}`}</p>
                          </div>
                          <p className="text-xs text-text-secondary">{contact.created_at?.split('T')[0]}</p>
                        </div>
                        <p className="font-medium text-brand-primary mb-2">{contact.subject}</p>
                        <p className="text-text-secondary">{contact.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif text-text-primary">Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-background-secondary rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-secondary uppercase">Client</p>
                  <p className="font-medium text-text-primary">{selectedBooking.name}</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary uppercase">Status</p>
                  <StatusBadge status={selectedBooking.status} />
                </div>
                <div>
                  <p className="text-xs text-text-secondary uppercase">Email</p>
                  <p className="text-text-primary">{selectedBooking.email}</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary uppercase">Phone</p>
                  <p className="text-text-primary">{selectedBooking.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary uppercase">Therapist</p>
                  <p className="text-text-primary capitalize">{selectedBooking.therapist}</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary uppercase">Date & Time</p>
                  <p className="text-text-primary">{selectedBooking.date} at {selectedBooking.time}</p>
                </div>
              </div>

              {selectedBooking.message && (
                <div>
                  <p className="text-xs text-text-secondary uppercase mb-1">Message</p>
                  <p className="text-text-primary bg-background-secondary p-3 rounded-xl">{selectedBooking.message}</p>
                </div>
              )}

              <div className="flex space-x-3 pt-4 border-t border-border">
                {selectedBooking.status === 'pending' && (
                  <>
                    <Button onClick={() => updateBookingStatus(selectedBooking.id, 'confirmed')} className="flex-1">
                      <Check className="h-4 w-4 mr-2" /> Confirm
                    </Button>
                    <Button variant="outline" onClick={() => updateBookingStatus(selectedBooking.id, 'cancelled')} className="flex-1">
                      <X className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                  </>
                )}
                {selectedBooking.status === 'confirmed' && (
                  <Button onClick={() => updateBookingStatus(selectedBooking.id, 'completed')} className="flex-1">
                    Mark as Completed
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function StatCard({ title, value, icon: Icon, color = 'primary' }) {
  const colors = {
    primary: 'bg-brand-primary/10 text-brand-primary',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600'
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <p className="text-3xl font-serif text-text-primary">{value}</p>
      <p className="text-sm text-text-secondary mt-1">{title}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
}

export default AdminDashboard;
