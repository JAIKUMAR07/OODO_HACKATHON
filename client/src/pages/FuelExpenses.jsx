import React from "react";
import { 
  FUEL_LOGS, 
  OTHER_EXPENSES,
  EXPENSE_STATUS_STYLE 
} from "../constants/fuel.js";
import { Plus } from "lucide-react";
import LogFuelForm from "../components/LogFuelForm.jsx";
import AddExpenseForm from "../components/AddExpenseForm.jsx";

function FuelExpenses() {
  const [fuelLogs, setFuelLogs] = React.useState(FUEL_LOGS);
  const [expenses, setExpenses] = React.useState(OTHER_EXPENSES);
  
  const [fuelDrawerOpen, setFuelDrawerOpen] = React.useState(false);
  const [expenseDrawerOpen, setExpenseDrawerOpen] = React.useState(false);

  function handleLogFuel(newLog) {
    setFuelLogs((prev) => [...prev, newLog]);
  }

  function handleAddExpense(newExpense) {
    setExpenses((prev) => [...prev, newExpense]);
  }

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
                {fuelLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-800">{log.vehicle}</td>
                    <td className="px-5 py-3.5 text-slate-600">{log.date}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono text-right">{log.liters}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono text-right">{log.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-slate-500">{exp.trip}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{exp.vehicle}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono text-right">{exp.toll}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono text-right">{exp.other}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono text-right">{exp.maint}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`inline-block px-3 py-1 text-[11px] font-bold whitespace-nowrap ${EXPENSE_STATUS_STYLE[exp.status]}`}>
                        {exp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Total Summary Footer ─────────────────── */}
      <div className="flex items-center justify-between border-t-[3px] border-slate-800 pt-4 mt-2">
        <span className="text-xs font-bold tracking-widest text-slate-600 uppercase">
          Total Operational Cost (Auto) = Fuel + Maint
        </span>
        <span className="text-xl font-extrabold text-amber-500 tracking-tight">
          ₹ 34,070
        </span>
      </div>

      <LogFuelForm 
        isOpen={fuelDrawerOpen} 
        onClose={() => setFuelDrawerOpen(false)} 
        onSave={handleLogFuel} 
      />
      <AddExpenseForm 
        isOpen={expenseDrawerOpen} 
        onClose={() => setExpenseDrawerOpen(false)} 
        onSave={handleAddExpense} 
      />
    </div>
  );
}

export default FuelExpenses;
