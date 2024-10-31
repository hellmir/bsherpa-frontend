import root from "./router/root.jsx"
import './App.css'
import {RouterProvider} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useEffect} from "react";

const queryClient = new QueryClient()

function App() {
    useEffect(() => {
        document.title = 'B셀파';
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={root}/>
        </QueryClientProvider>
    )
}

export default App
