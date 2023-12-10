import './App.scss'
import Layout from './components/Layout'
import { Navigate, Route, Routes, ScrollRestoration, useLocation, } from 'react-router-dom'
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
import { useEffect } from 'react'
import ResetPassword from './components/resetPassword'
import VerifyResetToken from './components/VerifyResetToken'
import Archive from './components/Archive'
import UserArchive from './components/UserArchive'
import Classroom from './components/Classroom'
import ClassroomArchived from './components/ClassroomArchived'
import Section from './components/Section'
import SectionArchived from './components/SectionArchived'

function App() {


  return (
    <Routes>
      <Route element={<PersistLogin />}>
        {/* public routes  */}
        <Route path='/login' element={<LoginComponenet />} />
        <Route path='/unauthorized' element={<Unauthorized />} />

        {/* reset password  */}
        <Route element={<VerifyResetToken />}>
          <Route path='/reset-password/:token' element={<ResetPassword />} />
        </Route>
        {/* protected routes  */}
        <Route path='/' element={<Layout />}>
          {/* admin and teaches allowed  */}
          <Route element={<RequireAuth allowedRoles={[ROLES_LIST.Teacher, ROLES_LIST.Admin]} />}>
            <Route path='/' element={<Home />} />
          </Route>
          {/* only Admin allowed  */}
          <Route element={<RequireAuth allowedRoles={[ROLES_LIST.Admin]} />}>
            <Route path='user-archive' element={<UserArchive />} />
          </Route>

          {/* only teachers are allowed on this route  */}
          <Route element={<RequireAuth allowedRoles={[ROLES_LIST.Teacher]} />}>
            <Route path='classroom' element={<Classroom />} />
            <Route path='archive' element={<ClassroomArchived />} />

            <Route path='classroom/:id' element={<Navigate to={'students'} replace />} />
            <Route path='archive/:id' element={<Navigate to={'students'} replace />} />

            <Route path='classroom/:id' element={<Section />}>
              <Route path='students' element={<Students />} />
              <Route path='lessons' element={<Lessons />} />
              <Route path='archive' element={<Archive />} />
            </Route>

            <Route path='archive/:id' element={<SectionArchived />} >
              <Route path='students' element={<Students />} />
              <Route path='lessons' element={<Lessons />} />
              <Route path='archive' element={<Archive />} />
            </Route>
          </Route>
          {/* catch all  */}
        </Route>
        <Route path='*' element={<Missing />} />
      </Route>
    </Routes>
  )
}

export default App
