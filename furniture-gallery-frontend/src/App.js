import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useTransition, animated } from '@react-spring/web';
import Home from './pages/Home';
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
import Header from './components/Header'; // Import Header
import './App.css'; // Import file CSS của bạn
//admin
import AdminDashboard from './admin/AdminDashboard';
import ManageUsers from './admin/ManageUsers';
import ManageItems from './admin/ManageItems';
import CreateItem from './admin/CreateItem';
import UpdateItem from './admin/UpdateItem';
import ManageColors from './admin/ManageColors';
import ProtectedRoute from './components/ProtectedRoute';
import ManageCategory from "./admin/ManageCategory";
import ManageDesignStyle from "./admin/manageDesignStyle";
import ManageRoomType from "./admin/ManageRoomType";
import ManageBrand from "./admin/ManageBrand";
import ProfileManager from "./pages/ProfileManager";
import Offcanvas from "./components/Offcanvas";

function App() {
    return (
        <div className="app-container">
            <Router>
                <HeaderWrapper />
                <AnimatedRoutes />
                <FooterWrapper />
            </Router>
        </div>
    );
};

const HeaderWrapper = () => {
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        const userFromStorage = localStorage.getItem('username');
        const roleIdFromStorage = localStorage.getItem('roleId');
        const fullNameFromStorage = localStorage.getItem('fullName');
        const avatarFromStorage = localStorage.getItem('avatar');
        if (userFromStorage) {
            setUser({ username: userFromStorage, roleId: roleIdFromStorage, fullName:fullNameFromStorage, avatar: avatarFromStorage});
        }
    }, []);

    return <Header user={user} />;
};

const AnimatedRoutes = () => {
    const location = useLocation();
    const transitions = useTransition(location, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 300, easing: (t) => t * (2 - t) },
    });

    return transitions((props, item) => (
        <animated.div style={props} className="page">
            <Routes location={item}>
                <Route path="/" element={<Home />} />
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
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute><ManageUsers /></ProtectedRoute>} />
                <Route path="/admin/items" element={<ProtectedRoute><ManageItems /></ProtectedRoute>} />
                <Route path="/admin/create-item" element={<ProtectedRoute><CreateItem /></ProtectedRoute>} />
                <Route path="/admin/edit-item/:id" element={<ProtectedRoute><UpdateItem /></ProtectedRoute>} />
                <Route path="/admin/colors" element={<ProtectedRoute><ManageColors /></ProtectedRoute>} />
                <Route path="/admin/categories" element={<ProtectedRoute><ManageCategory /></ProtectedRoute>} />
                <Route path="/admin/designstyles" element={<ProtectedRoute><ManageDesignStyle /></ProtectedRoute>} />
                <Route path="/admin/roomtypes" element={<ProtectedRoute><ManageRoomType /></ProtectedRoute>} />
                <Route path="/admin/brands" element={<ProtectedRoute><ManageBrand /></ProtectedRoute>} />

            </Routes>
        </animated.div>
    ));
}

const FooterWrapper = () => {
    const location = useLocation();
    return location.pathname !== '/' ? <Footer /> : null;
};

export default App;
