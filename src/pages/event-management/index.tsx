import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getAuthToken } from "@/lib/utils"
import { 
  getAllEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  getEventAttendees,
  type EventManagementEvent,
  type EventAttendee
} from "@/lib/api"
import { Calendar, MapPin, Users, DollarSign, Plus, Edit, Trash2, Eye, X, Check } from "lucide-react"
import toast from "react-hot-toast"

export default function EventManagementPage() {
  const navigate = useNavigate()
  const [events, setEvents] = useState<EventManagementEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAttendeesModal, setShowAttendeesModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<EventManagementEvent | null>(null)
  const [attendees, setAttendees] = useState<EventAttendee[]>([])
  const [filters, setFilters] = useState({
    status: '',
    city: '',
    page: 1,
    limit: 20
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEvents: 0,
    eventsPerPage: 20
  })

  // Form state for create/edit
  const [formData, setFormData] = useState({
    eventDate: '',
    eventTime: '',
    city: '',
    area: '',
    venue: '',
    venueAddress: '',
    venueDetails: '',
    maxAttendees: 6,
    bookingFee: 0,
    status: 'upcoming'
  })

  useEffect(() => {
    loadEvents()
  }, [filters])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const token = getAuthToken()
      const response = await getAllEvents(filters, token || undefined)
      
      if (response.success) {
        setEvents(response.data.events)
        setPagination(response.data.pagination)
      }
    } catch (error) {
      console.error('Error loading events:', error)
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = async () => {
    try {
      if (!formData.eventDate || !formData.eventTime || !formData.city || !formData.area || !formData.bookingFee) {
        toast.error('Please fill all required fields')
        return
      }

      const token = getAuthToken()
      const response = await createEvent({
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        city: formData.city,
        area: formData.area,
        venue: formData.venue || undefined,
        venueAddress: formData.venueAddress || undefined,
        venueDetails: formData.venueDetails || undefined,
        maxAttendees: formData.maxAttendees,
        bookingFee: formData.bookingFee
      }, token || undefined)

      if (response.success) {
        toast.success('Event created successfully!')
        setShowCreateModal(false)
        resetForm()
        loadEvents()
      }
    } catch (error: any) {
      console.error('Error creating event:', error)
      toast.error(error?.message || 'Failed to create event')
    }
  }

  const handleUpdateEvent = async () => {
    try {
      if (!selectedEvent) return

      const token = getAuthToken()
      const response = await updateEvent(selectedEvent.id, {
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        city: formData.city,
        area: formData.area,
        venue: formData.venue || undefined,
        venueAddress: formData.venueAddress || undefined,
        venueDetails: formData.venueDetails || undefined,
        maxAttendees: formData.maxAttendees,
        bookingFee: formData.bookingFee,
        status: formData.status
      }, token || undefined)

      if (response.success) {
        toast.success('Event updated successfully!')
        setShowEditModal(false)
        setSelectedEvent(null)
        resetForm()
        loadEvents()
      }
    } catch (error: any) {
      console.error('Error updating event:', error)
      toast.error(error?.message || 'Failed to update event')
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const token = getAuthToken()
      const response = await deleteEvent(eventId, token || undefined)

      if (response.success) {
        toast.success('Event deleted successfully!')
        loadEvents()
      }
    } catch (error: any) {
      console.error('Error deleting event:', error)
      toast.error(error?.message || 'Failed to delete event')
    }
  }

  const handleViewAttendees = async (event: EventManagementEvent) => {
    try {
      const token = getAuthToken()
      const response = await getEventAttendees(event.id, token || undefined)

      if (response.success) {
        setAttendees(response.data.attendees)
        setSelectedEvent(event)
        setShowAttendeesModal(true)
      }
    } catch (error) {
      console.error('Error loading attendees:', error)
      toast.error('Failed to load attendees')
    }
  }

  const openEditModal = (event: EventManagementEvent) => {
    setSelectedEvent(event)
    setFormData({
      eventDate: event.eventDate.split('T')[0],
      eventTime: event.eventTime,
      city: event.city,
      area: event.area,
      venue: event.venue || '',
      venueAddress: event.venueAddress || '',
      venueDetails: event.venueDetails || '',
      maxAttendees: event.maxAttendees,
      bookingFee: event.bookingFee,
      status: event.status
    })
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      eventDate: '',
      eventTime: '',
      city: '',
      area: '',
      venue: '',
      venueAddress: '',
      venueDetails: '',
      maxAttendees: 6,
      bookingFee: 0,
      status: 'upcoming'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500/20 text-blue-400'
      case 'full': return 'bg-yellow-500/20 text-yellow-400'
      case 'completed': return 'bg-green-500/20 text-green-400'
      case 'cancelled': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Event Management</h1>
            <p className="text-white/70">Manage all dinner events</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-white text-purple-900 px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-all"
          >
            <Plus size={20} />
            Create Event
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 flex gap-4 flex-wrap">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          >
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="full">Full</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <input
            type="text"
            placeholder="Filter by city"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value, page: 1 })}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
          />

          <button
            onClick={() => setFilters({ status: '', city: '', page: 1, limit: 20 })}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 hover:bg-white/20 transition-all"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4 text-white/70">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/70 text-lg">No events found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(event.status)}`}>
                        {event.status.toUpperCase()}
                      </span>
                      <span className="text-white/70 text-sm">
                        {new Date(event.eventDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-white/70" />
                        <span>{event.eventTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-white/70" />
                        <span>{event.city}, {event.area}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={18} className="text-white/70" />
                        <span>{event.currentAttendees}/{event.maxAttendees} attendees</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign size={18} className="text-white/70" />
                        <span>₹{event.bookingFee}</span>
                      </div>
                    </div>

                    {event.venue && (
                      <div className="text-sm text-white/70 mb-2">
                        <strong>Venue:</strong> {event.venue}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleViewAttendees(event)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all"
                      title="View Attendees"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => openEditModal(event)}
                      className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-all"
                      title="Edit Event"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all"
                      title="Delete Event"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              disabled={filters.page === 1}
              className="px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              disabled={filters.page === pagination.totalPages}
              className="px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Create New Event</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  resetForm()
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Event Date *</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Event Time *</label>
                  <input
                    type="text"
                    placeholder="e.g., 8:00 PM"
                    value={formData.eventTime}
                    onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City *</label>
                  <input
                    type="text"
                    placeholder="e.g., New Delhi"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Area *</label>
                  <input
                    type="text"
                    placeholder="e.g., Connaught Place"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Venue</label>
                <input
                  type="text"
                  placeholder="Restaurant name (optional)"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Venue Address</label>
                <input
                  type="text"
                  placeholder="Full address (optional)"
                  value={formData.venueAddress}
                  onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Venue Details</label>
                <textarea
                  placeholder="Additional details (optional)"
                  value={formData.venueDetails}
                  onChange={(e) => setFormData({ ...formData, venueDetails: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Max Attendees *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxAttendees}
                    onChange={(e) => setFormData({ ...formData, maxAttendees: parseInt(e.target.value) })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Booking Fee (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.bookingFee}
                    onChange={(e) => setFormData({ ...formData, bookingFee: parseFloat(e.target.value) })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCreateEvent}
                  className="flex-1 bg-white text-purple-900 py-3 rounded-xl font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  Create Event
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    resetForm()
                  }}
                  className="px-6 bg-white/10 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Edit Event</h2>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedEvent(null)
                  resetForm()
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Event Date *</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Event Time *</label>
                  <input
                    type="text"
                    placeholder="e.g., 8:00 PM"
                    value={formData.eventTime}
                    onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City *</label>
                  <input
                    type="text"
                    placeholder="e.g., New Delhi"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Area *</label>
                  <input
                    type="text"
                    placeholder="e.g., Connaught Place"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Venue</label>
                <input
                  type="text"
                  placeholder="Restaurant name (optional)"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Venue Address</label>
                <input
                  type="text"
                  placeholder="Full address (optional)"
                  value={formData.venueAddress}
                  onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Venue Details</label>
                <textarea
                  placeholder="Additional details (optional)"
                  value={formData.venueDetails}
                  onChange={(e) => setFormData({ ...formData, venueDetails: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Max Attendees *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxAttendees}
                    onChange={(e) => setFormData({ ...formData, maxAttendees: parseInt(e.target.value) })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Booking Fee (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.bookingFee}
                    onChange={(e) => setFormData({ ...formData, bookingFee: parseFloat(e.target.value) })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="full">Full</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpdateEvent}
                  className="flex-1 bg-white text-purple-900 py-3 rounded-xl font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  Update Event
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedEvent(null)
                    resetForm()
                  }}
                  className="px-6 bg-white/10 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendees Modal */}
      {showAttendeesModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Event Attendees</h2>
                <p className="text-white/70 mt-1">
                  {new Date(selectedEvent.eventDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} at {selectedEvent.eventTime}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAttendeesModal(false)
                  setSelectedEvent(null)
                  setAttendees([])
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {attendees.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-white/70">No attendees yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {attendees.map((attendee) => (
                  <div
                    key={attendee.bookingId}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{attendee.userName}</h3>
                        {attendee.userEmail && (
                          <p className="text-white/70 text-sm mb-1">{attendee.userEmail}</p>
                        )}
                        {attendee.userPhone && (
                          <p className="text-white/70 text-sm mb-2">{attendee.userPhone}</p>
                        )}
                        <div className="flex gap-4 text-sm">
                          <span className="text-white/70">
                            Booked: {new Date(attendee.bookingDate).toLocaleDateString()}
                          </span>
                          <span className="text-white/70">
                            Amount: ₹{attendee.paymentAmount}
                          </span>
                          <span className="text-white/70">
                            Method: {attendee.paymentMethod}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        attendee.paymentStatus === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {attendee.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

