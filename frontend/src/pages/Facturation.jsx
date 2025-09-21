import { Routes, Route, Navigate } from "react-router-dom";
import FacturationHome from "./Factures/FacturationHome";
import FacturationMonthly from "./Factures/FacturationMonthly";
import FacturationCalculate from "./Factures/FacturationCalculate";
import FacturationAll from "./Factures/FacturationAll";
import FacturationPredict from "./Factures/FacturationPredict";
import FacturationShow from "./Factures/FacturationShow";
import DailyForm from "./DailyForm";

function Facturation() {
  return (
    <div className="flex-1 p-4">
      {/* Nested routes */}
      <Routes>
        <Route index element={<FacturationHome />} />
        <Route path="daily" element={<DailyForm />} />
        <Route path="monthly" element={<FacturationMonthly />} />
        <Route path="calculate" element={<FacturationCalculate />} />
        <Route path="all" element={<FacturationAll />} />
        <Route path="predict" element={<FacturationPredict />} />
        <Route path="show" element={<FacturationShow />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </div>
  );
}

export default Facturation;
