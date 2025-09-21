import { Routes, Route } from "react-router-dom";

import Data from "./Users/Data";
import Info from "./Users/Info";
import GetContact from "./Users/GetContact";
import Factures from "./Users/Factures";
import Clusters from "./Users/Clusters";
import Analyse from "./Users/Analyse";
import Show from "./Users/Show";
import HomeAdmins from "./Users/HomeAdmins";
import ContactDetail from "./Users/ContactDetail";

const ProfileAdmins = () => {
  return (
    <div className="flex h-screen bg-gray-800 text-white">
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route path="" element={<HomeAdmins />} />
          <Route path="data" element={<Data />} />
          <Route path="info" element={<Info />} />
          <Route path="getContact" element={<GetContact />} />
          <Route path="factures" element={<Factures />} />
          <Route path="clusters" element={<Clusters />} />
          <Route path="analyse" element={<Analyse />} />
          <Route path="show" element={<Show />} />
          <Route path="getContact/:id" element={<ContactDetail />} />
        </Routes>
      </div>
    </div>
  );
};

export default ProfileAdmins;
