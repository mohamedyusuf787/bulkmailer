import React from 'react'
import image from "/email-bg.jpg"
import '../index.css'
import { useState } from 'react'
import axios from 'axios'
import * as XLSX from 'xlsx'
import { useNavigate } from 'react-router-dom'

const Bulkmail = () => {

    const [msg, setMsg] = useState('')
    const [status, setStatus] = useState(false)
    const [emails, setEmails] = useState([])
    const navigate = useNavigate()

    function handleMsg(e) {
        setMsg(e.target.value)
    }

    function handleFile(e) {
        const file = e.target.files[0];
        console.log("Selected file:", file);
        if (!file) return console.error("No file selected");

        const reader = new FileReader();  //browser API to read files

        reader.onload = (evt) => {
            const data = evt.target.result;

            const workbook = XLSX.read(data, { type: "binary" });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            // Extract emails from first column, skip header if present
            const emailList = jsonData.slice(1).map(row => row[0]).filter(email => email);
            setEmails(emailList);
            console.log("Extracted emails:", emailList);
        };

        reader.readAsBinaryString(file);
    }

    function clickHistory() {
        navigate("/history")
    }


    function handleSubmit() {
        setStatus(true)
        if (!emails.length) {
            setStatus(false)
            return alert("Make sure to upload a file with email addresses");
        }


        axios.post("https://bulkmailer-jjgy.onrender.com/sentmail",
            {
                message: msg,
                emails: emails,
            })

            .then(res => {
                console.log(res.data)
                console.log("message sent:", msg);
                setMsg("")
                alert("mail sent")
                setStatus(false)
            })

            .catch(err => {
                console.log(err)
                alert(err)
            })

            .finally(() => {
                setStatus(false)
            })

    }
    return (
        <>
            <header className='bg-blue-600 flex justify-between items-center px-4 w-full text-left py-4 text-white border-b-3 border-white drop-shadow-xl/20'>
                <div>
                    <h1 className='text-2xl font-bold '>welcome to Bulkmailer...📧</h1>
                    <p className='text-sm'>Send emails to multiple recipients quickly and easily — all in one place.</p>
                </div>
                <p onClick={clickHistory} className='underline px-4 py-2 rounded-md hover:cursor-pointer hover:bg-blue-900 '>History</p>
            </header>

            <div className="main-box flex flex-col items-center gap-2 border border-black rounded-2xl  w-[40%] mb-10 absolute top-100 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-white drop-shadow-xl/50">
                <img src={image} className='w-[90%] m-2 mt-3 rounded-lg' alt="mail image" />
                <div className="input-boxes  flex flex-col items-center gap-2 p-2 mt-2"> <textarea value={msg} onChange={handleMsg} className='border border-black p-4 rounded-md w-full' placeholder='enter your message'></textarea>
                    <input onChange={handleFile} className='border border-black rounded-md p-2 w-full' type="file" id='inputfile' />
                    <button className='rounded-xl py-2 px-4 mb-4 w-[40%] text-white' onClick={handleSubmit}>{status ? "Sending..🚀" : "Send"}</button>
                </div>
                <p className='w-full bg-blue-500 text-sm text-center p-2'>📧total emails in your file: <b>{emails.length}</b></p>
            </div>
        </>
    )
}

export default Bulkmail