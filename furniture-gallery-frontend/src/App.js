import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useTransition, animated } from '@react-spring/web';
import { jwtDecode } from "jwt-decode";
import Home from './pages/Home';
import Contact from './pages/Contact';
import Location from './pages/Location';
import ItemListByColor from './pages/ItemListByColor';
import ItemDetail from './pages/ItemDetail';
import ColorList from './pages/ColorList';
import Login from './pages/Login';
import Search from './components/Search';
import Register from './pages/Register';
import CategoryList from './pages/CategoryList';
import ItemListByCategory from './pages/ItemListByCategory';
import RoomTypeList from './pages/RoomTypeList';
import ItemListByRoomType from './pages/ItemListByRoomType';
import BrandList from './pages/BrandList';
import ItemListByBrand from './pages/ItemListByBrand';
import DesignStyleList from './pages/DesignStyleList';
import ItemListByDesignStyle from './pages/ItemListByDesignStyle';
import Footer from './components/Footer';
import Header from './components/Header';
import './App.css'; // Import file CSS của bạn
import AdminDashboard from './admin/AdminDashboard';
import ManageItems from './admin/ManageItems';
import CreateItem from './admin/CreateItem';
import UpdateItem from './admin/UpdateItem';
import ManageColors from './admin/ManageColors';
import ProtectedRoute from './components/ProtectedRoute';
import UserProtectedRoute from "./components/UserProtectedRoute";
import ManageCategory from "./admin/ManageCategory";
import ManageDesignStyle from "./admin/manageDesignStyle";
import ManageRoomType from "./admin/ManageRoomType";
import ManageBrand from "./admin/ManageBrand";
import ProfileManager from "./pages/ProfileManager";
import Offcanvas from "./components/Offcanvas";
import ScrollToTop from "./components/ScrollToTop";
import MyItemManager from './user/MyItemManager';  // Import My Item Manager
import CreateUserItem from './user/CreateItem';
import UpdateUserItem from './user/UpdateItem';

function App() {
    return (
        <div className="app-container">
            <Router>
                <AnimatedRoutes />
                <ScrollToTop />
                <HeaderWrapper />
                <FooterWrapper />
            </Router>
        </div>
    );
};

const HeaderWrapper = () => {
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            const roleIdFromStorage = localStorage.getItem('roleId');
            setUser({
                username: decoded.username,
                roleId: roleIdFromStorage,
                fullName: decoded.fullName,
                avatar: decoded.avatar,
            });
        }
    }, []);

    return <Header user={user} />;
};

const AnimatedRoutes = () => {
    const location = useLocation();
    const transitions = useTransition(location, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { display: 'none' },
        config: { duration: 700, easing: (t) => t * (2 - t) },
    });

    return transitions((props, item) => (
        <animated.div style={props} className="page">
            <Routes location={item}>
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/address" element={<Location />} />
                <Route path="/search" element={<Search />} />
                <Route path="/colors" element={<ColorList />} />
                <Route path="/colors/:colorId/items" element={<ItemListByColor />} />
                <Route path="/items/:id" element={<ItemDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<ProfileManager />} />
                <Route path="/register" element={<Register />} />
                <Route path="/categories" element={<CategoryList />} />
                <Route path="/categories/:categoryId/items" element={<ItemListByCategory />} />
                <Route path="/roomTypes" element={<RoomTypeList />} />
                <Route path="/roomTypes/:roomTypeId/items" element={<ItemListByRoomType />} />
                <Route path="/brands" element={<BrandList />} />
                <Route path="/brands/:brandId/items" element={<ItemListByBrand />} />
                <Route path="/designStyles" element={<DesignStyleList />} />
                <Route path="/designStyles/:designStyleId/items" element={<ItemListByDesignStyle />} />
                {/*admin*/}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['1']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/items" element={<ProtectedRoute allowedRoles={['1']}><ManageItems /></ProtectedRoute>} />
                <Route path="/admin/create-item" element={<ProtectedRoute allowedRoles={['1']}><CreateItem /></ProtectedRoute>} />
                <Route path="/admin/edit-item/:id" element={<ProtectedRoute allowedRoles={['1']}><UpdateItem /></ProtectedRoute>} />
                <Route path="/admin/colors" element={<ProtectedRoute allowedRoles={['1']}><ManageColors /></ProtectedRoute>} />
                <Route path="/admin/categories" element={<ProtectedRoute allowedRoles={['1']}><ManageCategory /></ProtectedRoute>} />
                <Route path="/admin/designstyles" element={<ProtectedRoute allowedRoles={['1']}><ManageDesignStyle /></ProtectedRoute>} />
                <Route path="/admin/roomtypes" element={<ProtectedRoute allowedRoles={['1']}><ManageRoomType /></ProtectedRoute>} />
                <Route path="/admin/brands" element={<ProtectedRoute allowedRoles={['1']}><ManageBrand /></ProtectedRoute>} />
                {/*<Route path="/my-items" element={<UserProtectedRoute allowedRoles={['2']}><MyItemManager /></UserProtectedRoute>} />*/}
                <Route path="/my-items" element={<UserProtectedRoute><MyItemManager /></UserProtectedRoute>} />
                {/*<Route path="/user/create-item" element={<UserProtectedRoute allowedRoles={['2']}><CreateItem /></UserProtectedRoute>} />*/}
                <Route path="/user/create-item" element={<UserProtectedRoute><CreateUserItem /></UserProtectedRoute>} />
                <Route path="/user/edit-item/:id" element={<UserProtectedRoute><UpdateUserItem /></UserProtectedRoute>} />
            </Routes>
        </animated.div>
    ));
}

const FooterWrapper = () => {
    const location = useLocation();
    return location.pathname !== '/' ? <Footer /> : null;
};

export default App;
