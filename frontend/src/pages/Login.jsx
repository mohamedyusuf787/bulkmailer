import React from 'react'
import { useState } from 'react'
import '../index.css'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const [crendential, setCrendential] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    function handleCrendential(e) {
        setCrendential(e.target.value)
    }

    function handlePassword(e) {
        setPassword(e.target.value)
    }

    function handleLogin(e) {
        e.preventDefault()
        if (crendential === "admin" && password === "admin@123") {
            alert("Login successful!")
            navigate("/BulkMail")
        } else {
            alert("Invalid credentials!")
        }
    }
    return (
        <>
            <header className='bg-blue-600 w-full text-center py-4 text-white border-b-3 border-white drop-shadow-xl/20'>
                <h1 className='text-2xl font-bold'>Login Page</h1>
            </header>

            <div className="card flex flex-col gap-2 p-4 items-center justify-center border border-black rounded-2xl w-[35%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white drop-shadow-xl/50">
                <h2 className='text-lg font-semibold text-center'>Please enter your credentials</h2>
                <input value={crendential} onChange={handleCrendential} className='border border-black rounded-md px-2 py-1' type="text" placeholder="Username" />
                <input value={password} onChange={handlePassword} className='border border-black rounded-md px-2 py-1' type="password" placeholder="Password" />
                <button onClick={handleLogin} className='rounded-xl py-2 px-4 w-[40%] text-white'>Login</button>
            </div>
        </>
    )
}

export default Login