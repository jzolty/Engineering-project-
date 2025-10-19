
import React from "react";
import AppRouter from "./routes/AppRouter";
import "./App.css";
import SessionWatcher from "./components/SessionWatcher";

function App() {
    return (
        <>
            {/*<SessionWatcher />*/}
            <AppRouter />
        </>
    );
}
export default App;
