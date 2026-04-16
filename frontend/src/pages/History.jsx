import React from 'react'
import '../index.css'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const History = () => {

  const [history, setHistory] = useState([])
  const navigate = useNavigate()

  function handleBack() {
    navigate("/Bulkmail")
  }

  useEffect(() => {
    axios.get("https://bulkmailer-jjgy.onrender.com/history")
      .then(res => {
        console.log("history data:", res.data)
        setHistory(res.data)
      })
      .catch(err => {
        console.log("error fetching history:", err)
      })
  }, [])



  return (
    <>
      <header className='bg-blue-600 flex justify-between items-center px-4 w-full text-left py-4 text-white border-b-3 border-white drop-shadow-xl/20'>
        <div>
          <h1 className='text-2xl font-bold '>Your Email History...📧</h1>
          <p className='text-sm'>your sent emails will appear here</p>
        </div>
        <p onClick={handleBack} className='underline px-4 py-2 rounded-md hover:cursor-pointer hover:bg-blue-900 '>Back </p>
      </header>

      <div className="history-containerbox flex flex-col gap-4 rounded-xl bg-gray-300 p-4 m-4">
        {
          history.length === 0 ? (
            <div className="history-card">
              <p className='text-center text-gray-500'>No history found. Send some emails to see the history here.</p>
            </div>
          ) : (
            history.map(data => {
              return (
                <div key={data._id} className="history-card flex justify-between p-2 rounded-lg border border-b-black">
                  <div className="history-card_left">
                    <p><span className='font-bold'>Message:</span> {data.message}</p>
                    <p><span className='font-bold'>Total Emails:</span> {data.totalCount}</p>
                    <p><span className='font-bold'>Successful:</span> {data.successCount}</p>
                    <p><span className='font-bold'>Failed:</span> {data.failedCount}</p>
                    <p><span className='font-bold'>Sent At:</span> {new Date(data.sentAt).toLocaleString()}</p>
                  </div>
                  <p><span className='font-bold'>Status:</span> {data.status}</p>

                </div>
              )
            })
          )
        }
      </div>
    </>
  )
}
export default History