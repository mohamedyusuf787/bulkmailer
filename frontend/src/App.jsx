import Bulkmail from './pages/Bulkmail.jsx'
import Login from './pages/Login.jsx'
import History from './pages/History.jsx'
import { Routes, Route } from 'react-router-dom'
const App = () => {
  return (
    <>
    <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/BulkMail" element={<Bulkmail/>}/>
        <Route path="/history" element={<History/>}/>
    </Routes>
       </>
  )
}

export default App