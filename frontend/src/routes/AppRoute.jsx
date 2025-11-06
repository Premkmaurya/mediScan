import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Home from '../pages/Home'
import Chat from "../pages/Chat"

const AppRoute = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<Login />}/>
        <Route path='/chat' element={<Chat />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </div>
  )
}

export default AppRoute
