import SignIn from "./pages/signin/SignIn.tsx";
import CreateAnAccount from "./pages/create-an-account/CreateAnAccount.tsx";
import ForgotPassword from "./pages/forgot-password/ForgotPassword.tsx";
import ProtectedLayout from "./layouts/ProtectedLayout.tsx";
import PublicLayout from "./layouts/PublicLayout.tsx";
import Players from "./pages/players/Players.tsx";
import TrainingBlocks from "./pages/training-blocks/TrainingBlocks.tsx";
import EmailActions from "./pages/email-actions/EmailActions.tsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { UserProvider } from "./contexts/UserProvider.tsx";
import "@radix-ui/themes/styles.css";
import "./styles/northwestern.css";
import "./styles/gray.css";
import "./styles/background.css";

function App() {
    return (
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/players" replace />}
                    />
                    <Route element={<PublicLayout />}>
                        <Route path="/signin" element={<SignIn />} />
                        <Route
                            path="/create-an-account"
                            element={<CreateAnAccount />}
                        />
                        <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                        />
                    </Route>
                    <Route element={<ProtectedLayout />}>
                        <Route path="/players" element={<Players />} />
                        <Route
                            path="/training-blocks"
                            element={<TrainingBlocks />}
                        />
                    </Route>
                    <Route
                        path="/email-actions"
                        element={<EmailActions />}
                    ></Route>
                </Routes>
            </BrowserRouter>
        </UserProvider>
    );
}

export default App;
