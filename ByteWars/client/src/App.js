import React from "react";
import { Routes, Route } from "react-router-dom";
import classes from "./App.module.css";
import { Header } from "./components/header/Header";
import { Home } from "./components/home/Home";
import { Footer } from "./components/footer/Footer";
import { TopResults } from "./components/home/TopResults";
import { AuthProvider } from "./components/home/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className={classes.main}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/TopResults" element={<TopResults />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
