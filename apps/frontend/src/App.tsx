import SignIn from "./pages/signin/signin.tsx";
import CreateAnAccount from "./pages/create-an-account/create-an-account.tsx";
import ForgotPassword from "./pages/forgot-password/forgot-password.tsx";
import ResetPassword from "./pages/reset-password/reset-password.tsx";
import ProtectedLayout from "./layouts/protected-layout.tsx";
import Players from "./pages/players/players.tsx";
import TrainingBlocks from "./pages/training-blocks/training-blocks.tsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import "@radix-ui/themes/styles.css";
import "./styles/northwestern.css";
import "./styles/gray.css";
import "./styles/background.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/players" replace />} />
        <Route index path="signin" element={<SignIn />} />
        <Route path="create-an-account" element={<CreateAnAccount />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route element={<ProtectedLayout />}>
          <Route path="players" element={<Players />} />
          <Route path="training-blocks" element={<TrainingBlocks />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
