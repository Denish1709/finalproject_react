import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./App.css";

import Home from "./Home";
import Guns from "./Guns";
import GunAdd from "./GunAdd";
import AgentAdd from "./AgentAdd";
import AgentEdit from "./AgentEdit";
import Maps from "./Maps";
import MapAdd from "./MapAdd";
import Ranks from "./Ranks";
import RankAdd from "./RankAdd";
import Skins from "./Skins";
import SkinAdd from "./SkinAdd";
import Login from "./Login";
import Signup from "./Signup";
import PaymentVerification from "./PaymentVerification";
import Orders from "./Order";
import Carts from "./Cart";
import Checkout from "./Checkout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agents/:id" element={<AgentEdit />} />
        <Route path="/add_agent" element={<AgentAdd />} />
        <Route path="/guns" element={<Guns />} />
        <Route path="/add_gun" element={<GunAdd />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/add_map" element={<MapAdd />} />
        <Route path="/ranks" element={<Ranks />} />
        <Route path="/add_rank" element={<RankAdd />} />
        <Route path="/skins" element={<Skins />} />
        <Route path="/add_skin" element={<SkinAdd />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-payment" element={<PaymentVerification />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/carts" element={<Carts />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;
