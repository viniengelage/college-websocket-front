import React from "react";
import { ToastContainer } from "react-toastify";
import { SocketProvider } from "./hooks/useSocket";
import { Home } from "./pages/Home";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <SocketProvider>
      <Home />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </SocketProvider>
  );
}

export default App;
