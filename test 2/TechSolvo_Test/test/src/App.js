
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './user/SignUp';
import Table from './student/Table'
import Login from './user/Login';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/table" element={<Table />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
