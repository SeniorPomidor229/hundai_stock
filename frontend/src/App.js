import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './Components/LoginComponent';
import LogoPiece from './Components/LogoComponent';
import TableScreen from './Components/TableComponent';


function App() {
  return (
    <div className="App" >
      <Router>
        <LogoPiece/>
        <Routes>
          <Route path="/" element={<LoginScreen/>}/>
          <Route path="/table" element={<TableScreen/>}  />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
