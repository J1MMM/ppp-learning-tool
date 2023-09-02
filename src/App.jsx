import './App.scss'
import Layout from './components/Layout'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Missing from './components/Missing'
import RequireAuth from './components/RequireAuth'
import Unauthorized from './components/Unauthorized'
import Users from './components/Users'
import PersistLogin from './components/PersistLogin'
import ROLES_LIST from './components/ROLES_LIST'
import Lessons from './components/Lessons'
import Students from './components/Students'
import LoginComponenet from './components/LoginComponent'
import SwiperComp from './components/SwiperComp'

function App() {
  return (
    <Routes>
      <Route element={<PersistLogin />}>
        {/* public routes  */}
        <Route path='/swiper' element={<SwiperComp />} />
        <Route path='/login' element={<LoginComponenet />} />
        <Route path='/unauthorized' element={<Unauthorized />} />

        {/* protected routes  */}
        <Route path='/' element={<Layout />}>
          {/* admin and teaches allowed  */}
          <Route element={<RequireAuth allowedRoles={[ROLES_LIST.Admin, ROLES_LIST.Teacher]} />}>
            <Route path='/' element={<Home />} />
            <Route path='students' element={<Students />} />
            <Route path='lessons' element={<Lessons />} />
          </Route>
          {/* only admin are allowed  */}
          <Route element={<RequireAuth allowedRoles={[ROLES_LIST.Admin]} />}>
            <Route path='users' element={<Users />} />
          </Route>

          {/* catch all  */}
        </Route>

        <Route path='*' element={<Missing />} />
      </Route>
    </Routes>
  )
}

export default App
