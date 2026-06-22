import React, { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import SiteLayout from "@/components/neoverse/SiteLayout";
import HomePage from "@/pages/HomePage";
import ArchivePage from "@/pages/ArchivePage";
import AlbumPage from "@/pages/AlbumPage";
import LibraryPage from "@/pages/LibraryPage";
import LibraryEntryPage from "@/pages/LibraryEntryPage";
import SymbolsPage from "@/pages/SymbolsPage";
import SymbolPage from "@/pages/SymbolPage";
import RoadhousePage from "@/pages/RoadhousePage";
import RoadhousePostPage from "@/pages/RoadhousePostPage";
import ObservatoryPage from "@/pages/ObservatoryPage";
import InvocationPage from "@/pages/InvocationPage";
import NotFoundPage from "@/pages/NotFoundPage";

import { AdminAuthProvider } from "@/admin/AdminAuthContext";
import ProtectedAdmin from "@/admin/ProtectedAdmin";
import AdminLoginPage from "@/admin/AdminLoginPage";
import AdminLayout from "@/admin/AdminLayout";
import AdminDashboard from "@/admin/AdminDashboard";
import AdminContentList from "@/admin/AdminContentList";
import AdminContentEdit from "@/admin/AdminContentEdit";
import AdminSubscribers from "@/admin/AdminSubscribers";

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <AdminAuthProvider>
          <Routes>
            {/* Public site */}
            <Route element={<SiteLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/archive" element={<ArchivePage />} />
              <Route path="/archive/:slug" element={<AlbumPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/library/:slug" element={<LibraryEntryPage />} />
              <Route path="/symbols" element={<SymbolsPage />} />
              <Route path="/symbols/:slug" element={<SymbolPage />} />
              <Route path="/roadhouse" element={<RoadhousePage />} />
              <Route path="/roadhouse/:slug" element={<RoadhousePostPage />} />
              <Route path="/observatory" element={<ObservatoryPage />} />
              <Route path="/invocation" element={<InvocationPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdmin>
                  <AdminLayout />
                </ProtectedAdmin>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path=":resource" element={<AdminContentList />} />
              <Route path=":resource/:id" element={<AdminContentEdit />} />
              <Route path="subscribers" element={<AdminSubscribers />} />
            </Route>

            <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
          </Routes>
          <Toaster richColors position="bottom-center" />
        </AdminAuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
