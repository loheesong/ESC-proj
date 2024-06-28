import './App.css';
import axios from "axios";
import { useEffect, useState } from 'react';

function App() {
    const [info, setInfo] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:3001").then((response) => {
            console.log(response);
            setInfo(response.data);
        })
    }, [])
    return (
        <div className="App">
        {info}
        </div>
    );
}

export default App;
