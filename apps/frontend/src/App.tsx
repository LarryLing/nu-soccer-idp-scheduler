import "@radix-ui/themes/styles.css";
import "./styles/northwestern.css";
import "./styles/gray.css";
import "./styles/background.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./layouts/layout.tsx";
import Signin from "./pages/signin/signin.tsx";
import CreateAnAccount from "./pages/create-an-account/create-an-account.tsx";
import ForgotPassword from "./pages/forgot-password/forgot-password.tsx";
import ResetPassword from "./pages/reset-password/reset-password.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index path="signin" element={<Signin />} />
          <Route path="create-an-account" element={<CreateAnAccount />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="players" element={<></>} />
          <Route path="training-blocks" element={<></>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
