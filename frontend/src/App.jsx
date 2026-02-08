import Bulkmail from './Bulkmail.jsx'
import Login from './Login.jsx'
import History from './History.jsx'
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