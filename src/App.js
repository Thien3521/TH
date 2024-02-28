import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
// import Products from "./pages/product";
import Layout from "./components/Layout";
import NotFound from "./pages/404";
import NganhNghe from "./pages/danh-muc/nganh-nghe/index";
import { UserProvider } from "./contexts/userContext";
import QuanTriThanhVien from "./pages/quan-tri-thanh-vien";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import KhoaContainer from "./pages/danh-muc/khoa";
function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            {/* <Route path="/products" element={<Products />} /> */}
            <Route path="/danh-muc">
              <Route path="nganh-nghe" element={<NganhNghe />} />
              <Route path="khoa" element={<KhoaContainer />} />
            </Route>
            <Route path="/quan-tri-thanh-vien" element={<QuanTriThanhVien />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </UserProvider>
  );
}

export default App;
