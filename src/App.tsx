import { Toaster } from "@/components/ui/toaster";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import PWAInstallBanner from "./components/PWAInstallBanner";
import DebugInfo from "./components/DebugInfo";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LancamentosFinanceiros from "./pages/LancamentosFinanceiros";
import FluxoCaixa from "./pages/FluxoCaixa";
import DRE from "./pages/DRE";
import Precificacao from "./pages/Precificacao";
import EstoqueManagement from "./pages/EstoqueManagement";
import CadastrosUnified from "./pages/CadastrosUnified";
import SaldosBancarios from "./pages/SaldosBancarios";
import Lembretes from "./pages/Lembretes";
import PontoEquilibrio from "./pages/PontoEquilibrio";
import Suporte from "./pages/Suporte";
import VideosSistema from "./pages/VideosSistema";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AdminSettings from "./pages/AdminSettings";
import Pipeline from "./pages/Pipeline";

const App = () => (
  <>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/perfil"
        element={
          <DashboardLayout>
            <Profile />
          </DashboardLayout>
        }
      />
      <Route
        path="/lancamentos"
        element={
          <DashboardLayout>
            <LancamentosFinanceiros />
          </DashboardLayout>
        }
      />
      <Route
        path="/fluxo-caixa"
        element={
          <DashboardLayout>
            <FluxoCaixa />
          </DashboardLayout>
        }
      />
      <Route
        path="/dre"
        element={
          <DashboardLayout>
            <DRE />
          </DashboardLayout>
        }
      />
      <Route
        path="/precificacao"
        element={
          <DashboardLayout>
            <Precificacao />
          </DashboardLayout>
        }
      />
      <Route
        path="/estoque"
        element={
          <DashboardLayout>
            <EstoqueManagement />
          </DashboardLayout>
        }
      />
      <Route
        path="/cadastros"
        element={
          <DashboardLayout>
            <CadastrosUnified />
          </DashboardLayout>
        }
      />
      <Route
        path="/pipeline"
        element={
          <DashboardLayout>
            <Pipeline />
          </DashboardLayout>
        }
      />
      <Route
        path="/saldos-bancarios"
        element={
          <DashboardLayout>
            <SaldosBancarios />
          </DashboardLayout>
        }
      />
      <Route
        path="/lembretes"
        element={
          <DashboardLayout>
            <Lembretes />
          </DashboardLayout>
        }
      />
      <Route
        path="/ponto-equilibrio"
        element={
          <DashboardLayout>
            <PontoEquilibrio />
          </DashboardLayout>
        }
      />
      <Route
        path="/suporte"
        element={
          <DashboardLayout>
            <Suporte />
          </DashboardLayout>
        }
      />
      <Route
        path="/videos-sistema"
        element={
          <DashboardLayout>
            <VideosSistema />
          </DashboardLayout>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <DashboardLayout>
            <AdminSettings />
          </DashboardLayout>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <PWAInstallBanner />
    <Toaster />
    {import.meta.env.DEV && <DebugInfo />}
  </>
);

export default App;
