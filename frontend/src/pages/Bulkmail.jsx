import React from 'react'
import image from "/email-bg.jpg"
import '../index.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import * as XLSX from 'xlsx'

const Bulkmail = () => {

    const [msg, setMsg] = useState('')
    const [status, setStatus] = useState(false)
    const [file, setFile] = useState(null)
    const [emails, setEmails] = useState([])
    const navigate = useNavigate()

    function handleMsg(e) {
        setMsg(e.target.value)
    }

    function handlResume(e) {
        setFile(e.target.files[0])
    }

    function handleFile(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (evt) => {
            const data = evt.target.result;

            const workbook = XLSX.read(data, { type: "array" });

            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            const emailList = jsonData
                .slice(1)
                .map(row => row[0])
                .filter(email => /\S+@\S+\.\S+/.test(email));

            setEmails(emailList);
        };

        reader.readAsArrayBuffer(file);
    }

    function clickHistory() {
        navigate("/history")
    }

    const formData = new FormData();
    formData.append("emailid", msg)
    formData.append("message", msg);
    formData.append("emails", emails);
    if (file) {
        formData.append("attachment", file);
    }


    async function handleSubmit() {
        setStatus(true);

        if (!emails.length) {
            setStatus(false);
            return alert("Make sure to upload a file with email addresses");
        }

        try {
            const res = await axios.post("https://bulkmailer-jjgy.onrender.com/sentmail", formData,
                {
                    emails: emails,
                    // headers:{"Content-Type": "multipart/form-data"},
                }
            );
            console.log(res.data);
            setMsg("");
            alert("Mail sent");

        } catch (err) {
            console.log(err);
            alert("Failed to send mail");

        } finally {
            setStatus(false);
        }
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

            <div className="main-box flex flex-col items-center justify-center gap-2 border border-black rounded-2xl  w-[70%] relative left-1/2 -translate-x-1/2 top-20 overflow-hidden bg-white drop-shadow-xl/50">
                <img src={image} className='w-[90%] m-2 mt-3 rounded-lg' alt="mail image" />
                <div className="input-box flex items-start gap-3 p-2">
                    <div className="input-boxes-left flex flex-col items-center gap-2">

                        <div className='flex flex-col gap-1'>
                            <p>choose your Excel file:</p>
                            <input onChange={handleFile} className='border border-black rounded-md p-2 w-full' type="file" id='inputfile' />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>choose your resume:</p>
                            <input onChange={handlResume} className='border border-black rounded-md p-2 w-full' type="file" accept='.pdf,.jpg,.png,.docx' id='inputfile' />
                        </div>

                    </div>
                    <div className="input-boxes-right flex flex-col items-center gap-2">
                        <div className='flex flex-col gap-1'>
                            <p>Enter your emailID:</p>
                            <input onChange={handleFile} className='border border-black rounded-md p-2 w-full' type="file" id='inputfile' />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Enter your App Code:</p>
                            <input onChange={handlResume} className='border border-black rounded-md p-2 w-full' type="file" accept='.pdf,.jpg,.png,.docx' id='inputfile' />
                        </div>
                    </div>

                </div>
                <textarea value={msg} onChange={handleMsg} className='border border-black p-4 mx-2 rounded-md w-[90%]' placeholder='enter your message'></textarea>

                <button className='rounded-xl py-2 px-4 mb-4 w-[40%] text-white' onClick={handleSubmit}>{status ? "Sending..🚀" : "Send"}</button>

                <p className='w-full bg-blue-500 text-sm text-center p-2'>📧total emails in your file: <b>{emails.length}</b></p>
            </div>
        </>
    )
}

export default Bulkmail