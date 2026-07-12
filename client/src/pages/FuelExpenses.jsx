import React, { useState, useEffect } from "react";
import { EXPENSE_STATUS_STYLE } from "../constants/fuel.js";
import { Plus, RefreshCw } from "lucide-react";
import LogFuelForm from "../components/LogFuelForm.jsx";
import AddExpenseForm from "../components/AddExpenseForm.jsx";
import Pagination from "../components/shared/Pagination.jsx";
import { getVehicles } from "../services/vehicleService.js";
import { getTrips } from "../services/tripService.js";
import { getFuelLogs, createFuelLog, getExpenses, createExpense } from "../services/expenseService.js";

function FuelExpenses() {
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [fuelDrawerOpen, setFuelDrawerOpen] = useState(false);
  const [expenseDrawerOpen, setExpenseDrawerOpen] = useState(false);

  // Pagination State
  const [fuelPage, setFuelPage] = useState(1);
  const [expensePage, setExpensePage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vData, tData, fData, eData] = await Promise.all([
        getVehicles(),
        getTrips({}),
        getFuelLogs(),
        getExpenses()
      ]);
      setVehicles(vData);
      setTrips(tData || []);
      setFuelLogs(fData);
      setExpenses(eData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  async function handleLogFuel(newLog) {
    try {
      await createFuelLog({
        vehicleId: newLog.vehicleId,
        liters: parseFloat(newLog.liters) || 0,
        cost: parseFloat(newLog.cost) || 0
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to save fuel log");
    }
  }

  async function handleAddExpense(newExpense) {
    try {
      await createExpense({
        vehicleId: newExpense.vehicleId || undefined,
        tripId: newExpense.tripId || undefined,
        type: newExpense.type,
        amount: parseFloat(newExpense.amount) || 0
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to save expense");
    }
  }

  const totalFuel = fuelLogs.reduce((acc, log) => acc + log.cost, 0);
  const totalExpense = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const grandTotal = totalFuel + totalExpense;

  const paginatedFuel = fuelLogs.slice((fuelPage - 1) * itemsPerPage, fuelPage * itemsPerPage);
  const paginatedExpenses = expenses.slice((expensePage - 1) * itemsPerPage, expensePage * itemsPerPage);

  return (
    <div className="flex flex-col gap-6 min-h-full">
      {/* ── Page Header ──────────────────────────── */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Fuel & Expense Management</h1>
        <p className="text-slate-500 text-xs mt-0.5">Track fleet fuel consumption and operational costs.</p>
      </div>

      {/* ── Fuel Logs Section ────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Fuel Logs</h2>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setFuelDrawerOpen(true)}
              className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-white text-xs font-bold px-4 py-2 transition-colors shadow-sm">
              <Plus size={13} />
              Log Fuel
            </button>
            <button 
              onClick={() => setExpenseDrawerOpen(true)}
              className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-white text-xs font-bold px-4 py-2 transition-colors shadow-sm">
              <Plus size={13} />
              Add Expense
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-200">
                  <th className="px-5 py-3">Vehicle</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Liters</th>
                  <th className="px-5 py-3 text-right">Fuel Cost (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={4} className="p-4 text-center text-slate-400 text-sm">Loading fuel logs...</td></tr>
                ) : paginatedFuel.length === 0 ? (
                  <tr><td colSpan={4} className="p-4 text-center text-slate-400 text-sm border border-dashed border-slate-200">No fuel logs found</td></tr>
                ) : paginatedFuel.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-800">{log.vehicle?.name || "Unknown"}</td>
                    <td className="px-5 py-3.5 text-slate-600">{new Date(log.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono text-right">{log.liters} L</td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono text-right">₹{log.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* ── Fuel Pagination ── */}
          {fuelLogs.length > 0 && (
            <Pagination
              currentPage={fuelPage}
              totalItems={fuelLogs.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setFuelPage}
            />
          )}
        </div>
      </div>

      {/* ── Other Expenses Section ───────────────── */}
      <div className="flex flex-col gap-3 mt-4">
        <h2 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Other Expenses (Toll / Misc)</h2>
        
        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-200">
                  <th className="px-5 py-3">Trip</th>
                  <th className="px-5 py-3">Vehicle</th>
                  <th className="px-5 py-3 text-right">Toll</th>
                  <th className="px-5 py-3 text-right">Other</th>
                  <th className="px-5 py-3 text-right">Maint. (Linked)</th>
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={6} className="p-4 text-center text-slate-400 text-sm">Loading expenses...</td></tr>
                ) : paginatedExpenses.length === 0 ? (
                  <tr><td colSpan={6} className="p-4 text-center text-slate-400 text-sm border border-dashed border-slate-200">No expenses found</td></tr>
                ) : paginatedExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-slate-500">{exp.tripId ? `#${exp.tripId.slice(-6)}` : "-"}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{exp.vehicle?.name || "-"}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono text-right">{exp.type === "TOLL" ? `₹${exp.amount}` : "-"}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono text-right">{exp.type === "MISCELLANEOUS" ? `₹${exp.amount}` : "-"}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono text-right">{exp.type === "MAINTENANCE" ? `₹${exp.amount}` : "-"}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`inline-block px-3 py-1 text-[11px] font-bold whitespace-nowrap ${EXPENSE_STATUS_STYLE[exp.status] || "bg-slate-100 text-slate-600"}`}>
                        {exp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* ── Expense Pagination ── */}
          {expenses.length > 0 && (
            <Pagination
              currentPage={expensePage}
              totalItems={expenses.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setExpensePage}
            />
          )}
        </div>
      </div>

      {/* ── Total Summary Footer ─────────────────── */}
      <div className="flex items-center justify-between border-t-[3px] border-slate-800 pt-4 mt-2">
        <span className="text-xs font-bold tracking-widest text-slate-600 uppercase">
          Total Operational Cost = Fuel + Maint + Tolls
        </span>
        <span className="text-xl font-extrabold text-amber-500 tracking-tight">
          ₹ {grandTotal.toLocaleString()}
        </span>
      </div>

      <LogFuelForm 
        isOpen={fuelDrawerOpen} 
        onClose={() => setFuelDrawerOpen(false)} 
        onSave={handleLogFuel}
        vehicles={vehicles}
      />
      <AddExpenseForm 
        isOpen={expenseDrawerOpen} 
        onClose={() => setExpenseDrawerOpen(false)} 
        onSave={handleAddExpense}
        vehicles={vehicles}
        trips={trips}
      />
    </div>
  );
}

export default FuelExpenses;
