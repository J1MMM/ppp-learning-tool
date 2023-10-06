import './App.scss'
import Layout from './components/Layout'
import { Route, Routes, ScrollRestoration, useLocation } from 'react-router-dom'
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

function App() {
  const location = useLocation()

  useEffect(() => {
    document.title = getPageTitle(location.pathname);
  }, [location.pathname]);

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
        return 'Dashboard | Overview';
      case '/users':
        return 'Dashboard | Users Management';
      case '/students':
        return 'Dashboard | Students Management';
      case '/login':
        return 'PPPedu | Login';
      case '/lessons':
        return 'Dashboard | Lessons Management';
      case '/archive':
        return 'Dashboard |  Archived Management';
      case '/reset-password/:token':
        return 'Reset Password';
      case '/unauthorized':
        return 'Unauthorized User';
      default:
        return 'page not found';
    }
  };

  return (
    <Routes>
      <Route element={<PersistLogin />}>
        {/* public routes  */}
        <Route path='/swiper' element={<SwiperComp />} />
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
            <Route path='archive' element={<Archive />} />
          </Route>
          {/* only teachers are allowed on this route  */}
          <Route element={<RequireAuth allowedRoles={[ROLES_LIST.Teacher]} />}>
            <Route path='students' element={<Students />} />
            <Route path='lessons' element={<Lessons />} />
          </Route>
          {/* only admin are allowed  */}
          {/* <Route element={<RequireAuth allowedRoles={[ROLES_LIST.Admin]} />}>
            <Route path='users' element={<Users />} />
          </Route> */}

          {/* catch all  */}
        </Route>
        <Route path='*' element={<Missing />} />
      </Route>
    </Routes>
  )
}

export default App
