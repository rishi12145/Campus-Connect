import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { useNotification } from '../../context/NotificationContext';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import {
  Bus,
  Plus,
  Search,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  Phone,
  Car,
  Cake,
  Utensils,
  Tag,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminTransport = () => {
  const [activeTab, setActiveTab] = useState('buses'); // 'buses' or 'services'
  const [routes, setRoutes] = useState([]);
  const [localServices, setLocalServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Bus Route Modal states
  const [isBusModalOpen, setIsBusModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [routeToDelete, setRouteToDelete] = useState(null);

  // Local Service Modal states
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const { showToast } = useNotification();

  const [routeForm, setRouteForm] = useState({
    routeName: '',
    source: '',
    destination: 'Education Hub Campus, Kevdi',
    stops: '',
    departureTime: '',
    frequency: 'Regular Schedule (Cost: Flat ₹10)',
    busNumber: 'DD-02-Campus',
    driverName: 'Asvinbhai',
    driverContact: '9426402875',
    daysOfOperation: 'All 7 Days',
    isDemo: false,
    notes: 'Kevdi midpoint arrival ±10 min'
  });

  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: 'Food & Delivery',
    phone: '',
    type: '',
    coverage: 'Kevdi College Gate & Diu',
    badge: '100% Delivery',
    notes: ''
  });

  const loadData = () => {
    setRoutes(storageService.getTransport());
    setLocalServices(storageService.getLocalServices());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('campus_connect_update', loadData);
    return () => window.removeEventListener('campus_connect_update', loadData);
  }, []);

  // --- BUS ROUTE HANDLERS ---
  const handleOpenCreateBus = () => {
    setEditingRoute(null);
    setRouteForm({
      routeName: '',
      source: '',
      destination: 'Education Hub Campus, Kevdi',
      stops: '',
      departureTime: '',
      frequency: 'Regular Municipal Schedule (Cost: Flat ₹10)',
      busNumber: 'Diu Govt Municipal Shuttle',
      driverName: 'Asvinbhai',
      driverContact: '9426402875',
      daysOfOperation: 'All 7 Days',
      isDemo: false,
      notes: 'CAMPUS IS MIDWAY: Reaches IIITV-ICD Kevdi at ±10 minutes'
    });
    setIsBusModalOpen(true);
  };

  const handleOpenEditBus = (rt) => {
    setEditingRoute(rt);
    setRouteForm({
      ...rt,
      stops: Array.isArray(rt.stops) ? rt.stops.join(', ') : rt.stops
    });
    setIsBusModalOpen(true);
  };

  const handleSaveBus = (e) => {
    e.preventDefault();
    if (!routeForm.routeName.trim() || !routeForm.source.trim()) {
      showToast('Route name and origin are required.', 'error');
      return;
    }

    try {
      if (editingRoute) {
        storageService.updateTransport(editingRoute.id, routeForm);
        showToast('Route details updated!', 'success');
      } else {
        storageService.createTransport(routeForm);
        showToast('New bus route published!', 'success');
      }
      setIsBusModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Action failed.', 'error');
    }
  };

  const handleDeleteBus = () => {
    if (!routeToDelete) return;
    try {
      storageService.deleteTransport(routeToDelete.id);
      showToast('Route deleted.', 'success');
      setRouteToDelete(null);
      loadData();
    } catch (err) {
      showToast('Delete failed.', 'error');
    }
  };

  // --- LOCAL SERVICE HANDLERS ---
  const handleOpenCreateService = () => {
    setEditingService(null);
    setServiceForm({
      name: '',
      category: 'Food & Delivery',
      phone: '',
      type: 'Campus Doorstep Delivery',
      coverage: 'Kevdi College Gate & Hostels',
      badge: 'Verified Contact',
      notes: ''
    });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (srv) => {
    setEditingService(srv);
    setServiceForm({
      name: srv.name || '',
      category: srv.category || 'Food & Delivery',
      phone: srv.phone || '',
      type: srv.type || '',
      coverage: srv.coverage || '',
      badge: srv.badge || '',
      notes: srv.notes || ''
    });
    setIsServiceModalOpen(true);
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    if (!serviceForm.name.trim() || !serviceForm.phone.trim()) {
      showToast('Name and phone number are required.', 'error');
      return;
    }

    try {
      if (editingService) {
        storageService.updateLocalService(editingService.id, serviceForm);
        showToast('Contact updated successfully!', 'success');
      } else {
        storageService.createLocalService(serviceForm);
        showToast('New speed dial contact added!', 'success');
      }
      setIsServiceModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Action failed.', 'error');
    }
  };

  const handleDeleteService = () => {
    if (!serviceToDelete) return;
    try {
      storageService.deleteLocalService(serviceToDelete.id);
      showToast('Service contact removed.', 'success');
      setServiceToDelete(null);
      loadData();
    } catch (err) {
      showToast('Delete failed.', 'error');
    }
  };

  const filteredRoutes = routes.filter((r) =>
    r.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.driverName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredServices = localServices.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#161616] border border-[#262626] shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#B7F34A]/20 text-[#B7F34A] border border-[#B7F34A]/40 flex items-center gap-1">
              <Bus className="w-3.5 h-3.5" />
              Transport Master Management
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Manage Transport & Local Speed-Dials
          </h2>
          <p className="text-xs text-[#AAAAAA]">
            Full admin control over municipal ₹10 buses, Chagda 3-wheelers, hostel food delivery boys (Saddam), and bakeries (Shankar Cake).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'buses' ? (
            <button
              onClick={handleOpenCreateBus}
              className="btn-lime text-xs font-bold px-4 py-2.5 flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Bus Route</span>
            </button>
          ) : (
            <button
              onClick={handleOpenCreateService}
              className="btn-lime text-xs font-bold px-4 py-2.5 flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Speed Dial</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Switcher and Search */}
      <div className="p-4 rounded-2xl bg-[#161616] border border-[#262626] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-[#202020] p-1.5 rounded-xl border border-[#2E2E2E] w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('buses')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'buses'
                ? 'bg-[#B7F34A] text-[#0A0A0A] shadow'
                : 'text-[#AAAAAA] hover:text-white'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Bus Routes ({routes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'services'
                ? 'bg-[#FF9F43] text-[#0A0A0A] shadow'
                : 'text-[#AAAAAA] hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Speed Dials & Contacts ({localServices.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'buses' ? 'Search bus routes or drivers...' : 'Search contacts, delivery, food...'}
            className="w-full pl-10 pr-4 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white placeholder-[#777777] focus:border-[#B7F34A] outline-none"
          />
        </div>
      </div>

      {/* Content depending on active tab */}
      {activeTab === 'buses' ? (
        /* BUSES TABLE */
        <div className="bg-[#161616] rounded-3xl border border-[#262626] shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs text-white">
              <thead>
                <tr className="bg-[#1A1A1A] border-b border-[#262626] text-[#888888] font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Route Name & Shuttle</th>
                  <th className="p-4">Origin & Terminus</th>
                  <th className="p-4">Departures & Schedule</th>
                  <th className="p-4">Driver / Incharge</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {filteredRoutes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-xs text-[#777777]">
                      No transport routes found matching query.
                    </td>
                  </tr>
                ) : (
                  filteredRoutes.map((rt) => (
                    <tr key={rt.id} className="hover:bg-[#1E1E1E] transition-colors">
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-white">{rt.routeName}</h4>
                          <span className="text-[10px] font-mono text-[#B7F34A]">{rt.busNumber}</span>
                        </div>
                      </td>
                      <td className="p-4 space-y-0.5">
                        <p className="text-xs font-semibold text-white flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#B7F34A]" />
                          <span>{rt.source} ➔ {rt.destination}</span>
                        </p>
                        <p className="text-[10px] text-[#888888] truncate max-w-xs">
                          Via: {Array.isArray(rt.stops) ? rt.stops.join(' • ') : rt.stops}
                        </p>
                      </td>
                      <td className="p-4 space-y-0.5">
                        <span className="text-xs font-bold text-[#FF9F43]">{rt.frequency}</span>
                        <p className="text-[10px] text-[#AAAAAA] line-clamp-1">{rt.departureTime}</p>
                      </td>
                      <td className="p-4 space-y-0.5">
                        <span className="text-xs font-bold text-white">{rt.driverName}</span>
                        <p className="text-[10px] text-[#888888] flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#B7F34A]" />
                          {rt.driverContact}
                        </p>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditBus(rt)}
                            className="p-1.5 rounded-lg bg-[#222222] hover:bg-[#B7F34A] hover:text-[#0A0A0A] text-[#CCCCCC] transition-colors"
                            title="Edit Route"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setRouteToDelete(rt)}
                            className="p-1.5 rounded-lg bg-[#222222] hover:bg-rose-900/40 text-[#888888] hover:text-rose-400 transition-colors"
                            title="Delete Route"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* LOCAL SERVICES TABLE */
        <div className="bg-[#161616] rounded-3xl border border-[#262626] shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs text-white">
              <thead>
                <tr className="bg-[#1A1A1A] border-b border-[#262626] text-[#888888] font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Contact / Service Name</th>
                  <th className="p-4">Category & Badge</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">Coverage & Notes</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-xs text-[#777777]">
                      No speed dial contacts found matching query.
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((srv) => (
                    <tr key={srv.id} className="hover:bg-[#1E1E1E] transition-colors">
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-white">{srv.name}</h4>
                          <span className="text-[10px] text-[#AAAAAA]">{srv.type}</span>
                        </div>
                      </td>
                      <td className="p-4 space-y-0.5">
                        <span className="text-xs font-bold text-[#FF9F43]">{srv.category}</span>
                        {srv.badge && (
                          <span className="block text-[9px] font-mono text-[#B7F34A] bg-[#222222] px-1.5 py-0.5 rounded w-max">
                            {srv.badge}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#B7F34A]" />
                          {srv.phone}
                        </span>
                      </td>
                      <td className="p-4 space-y-0.5 max-w-xs">
                        <p className="text-[11px] text-white truncate">{srv.coverage}</p>
                        <p className="text-[10px] text-[#888888] truncate">{srv.notes}</p>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditService(srv)}
                            className="p-1.5 rounded-lg bg-[#222222] hover:bg-[#B7F34A] hover:text-[#0A0A0A] text-[#CCCCCC] transition-colors"
                            title="Edit Contact"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setServiceToDelete(srv)}
                            className="p-1.5 rounded-lg bg-[#222222] hover:bg-rose-900/40 text-[#888888] hover:text-rose-400 transition-colors"
                            title="Delete Contact"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bus Route Modal */}
      <Modal
        isOpen={isBusModalOpen}
        onClose={() => setIsBusModalOpen(false)}
        title={editingRoute ? 'Edit Bus Route' : 'Add New Bus Route'}
        subtitle="Manage municipal schedule, ±10 min Kevdi midpoint timings, and driver contact."
      >
        <form onSubmit={handleSaveBus} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
              Route Name *
            </label>
            <input
              type="text"
              value={routeForm.routeName}
              onChange={(e) => setRouteForm({ ...routeForm, routeName: e.target.value })}
              placeholder="e.g. Diu Govt Bus: Diu ⇄ Kevdi College ⇄ Vanakbara"
              className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Origin / Starting Point *
              </label>
              <input
                type="text"
                value={routeForm.source}
                onChange={(e) => setRouteForm({ ...routeForm, source: e.target.value })}
                placeholder="e.g. Diu Main Bus Stand"
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Destination Terminus *
              </label>
              <input
                type="text"
                value={routeForm.destination}
                onChange={(e) => setRouteForm({ ...routeForm, destination: e.target.value })}
                placeholder="e.g. Vanakbara Bus Terminus"
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
              Intermediate Stops (Comma separated)
            </label>
            <input
              type="text"
              value={routeForm.stops}
              onChange={(e) => setRouteForm({ ...routeForm, stops: e.target.value })}
              placeholder="e.g. Diu Stand, Fudam, Kevdi (IIITV-ICD Gate), Malala, Nagoa, Vanakbara"
              className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Departure Timings
              </label>
              <input
                type="text"
                value={routeForm.departureTime}
                onChange={(e) => setRouteForm({ ...routeForm, departureTime: e.target.value })}
                placeholder="e.g. 6:15 AM, 8:00 AM, 9:40 AM, 11:30 AM"
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Frequency / Cost
              </label>
              <input
                type="text"
                value={routeForm.frequency}
                onChange={(e) => setRouteForm({ ...routeForm, frequency: e.target.value })}
                placeholder="e.g. Regular Municipal Schedule (Cost: Flat ₹10)"
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Driver / Incharge Name
              </label>
              <input
                type="text"
                value={routeForm.driverName}
                onChange={(e) => setRouteForm({ ...routeForm, driverName: e.target.value })}
                placeholder="e.g. Asvinbhai"
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Driver Phone (+91)
              </label>
              <input
                type="text"
                value={routeForm.driverContact}
                onChange={(e) => setRouteForm({ ...routeForm, driverContact: e.target.value })}
                placeholder="9426402875"
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
              Midpoint Notes / College Timing Rule
            </label>
            <input
              type="text"
              value={routeForm.notes}
              onChange={(e) => setRouteForm({ ...routeForm, notes: e.target.value })}
              placeholder="e.g. Reaches Kevdi college gate at ±10 min after departure from both ends"
              className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-lime text-xs font-bold py-3 uppercase tracking-wider shadow-lg shadow-[#B7F34A]/25"
          >
            {editingRoute ? 'Save Route Changes' : 'Publish Transit Route'}
          </button>
        </form>
      </Modal>

      {/* Local Service Modal */}
      <Modal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        title={editingService ? 'Edit Speed Dial Contact' : 'Add Speed Dial Contact'}
        subtitle="Manage hostel delivery boys, bakeries, restaurants, and local autos."
      >
        <form onSubmit={handleSaveService} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
              Contact / Business Name *
            </label>
            <input
              type="text"
              value={serviceForm.name}
              onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
              placeholder="e.g. Saddam Delivery Boy, Shankar Cake, Ambica Restaurant"
              className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={serviceForm.category}
                onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              >
                <option value="Food & Delivery">Food & Delivery</option>
                <option value="Bakery & Cakes">Bakery & Cakes</option>
                <option value="Auto & Local Transport">Auto & Local Transport</option>
                <option value="Printing & Xerox">Printing & Xerox</option>
                <option value="Entertainment & Daily Life">Entertainment & Daily Life</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Mobile Phone (+91) *
              </label>
              <input
                type="text"
                value={serviceForm.phone}
                onChange={(e) => setServiceForm({ ...serviceForm, phone: e.target.value })}
                placeholder="e.g. 8200106584"
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Service Type
              </label>
              <input
                type="text"
                value={serviceForm.type}
                onChange={(e) => setServiceForm({ ...serviceForm, type: e.target.value })}
                placeholder="e.g. Market to College Gate Delivery"
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                Badge
              </label>
              <input
                type="text"
                value={serviceForm.badge}
                onChange={(e) => setServiceForm({ ...serviceForm, badge: e.target.value })}
                placeholder="e.g. 100% Delivery, Top Rated"
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
              Coverage / Delivery Area
            </label>
            <input
              type="text"
              value={serviceForm.coverage}
              onChange={(e) => setServiceForm({ ...serviceForm, coverage: e.target.value })}
              placeholder="e.g. Diu Market to IIITV-ICD hostel gate delivery"
              className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
              Notes / Delivery Instructions
            </label>
            <input
              type="text"
              value={serviceForm.notes}
              onChange={(e) => setServiceForm({ ...serviceForm, notes: e.target.value })}
              placeholder="e.g. Delivers packages, parcels, medicines & stationeries to college gate"
              className="w-full px-3 py-2 bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl text-xs text-white outline-none focus:border-[#B7F34A]"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-lime text-xs font-bold py-3 uppercase tracking-wider shadow-lg shadow-[#B7F34A]/25"
          >
            {editingService ? 'Save Contact Changes' : 'Add Speed Dial Contact'}
          </button>
        </form>
      </Modal>

      {/* Delete Bus Dialog */}
      <ConfirmDialog
        isOpen={!!routeToDelete}
        onClose={() => setRouteToDelete(null)}
        onConfirm={handleDeleteBus}
        title="Delete Transport Route"
        message={`Are you sure you want to delete "${routeToDelete?.routeName}"?`}
        isDestructive
        confirmText="Delete Route"
      />

      {/* Delete Service Dialog */}
      <ConfirmDialog
        isOpen={!!serviceToDelete}
        onClose={() => setServiceToDelete(null)}
        onConfirm={handleDeleteService}
        title="Delete Speed Dial Contact"
        message={`Are you sure you want to remove "${serviceToDelete?.name}" (${serviceToDelete?.phone})?`}
        isDestructive
        confirmText="Delete Contact"
      />
    </div>
  );
};
