import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from "./routes/Home"
import SearchDest from './routes/SearchDest';

function App() {
    // define routes here 
    return (
    <div className="App">
        <Router>
            <Routes>
                <Route path='/' element={<Home/>}></Route>
                <Route path='/search' element={<SearchDest/>}></Route>
            </Routes>
        </Router>
    </div>
)
}

export default App;
