import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useTransition, animated } from '@react-spring/web';
import Home from './pages/Home';
import ItemListByColor from './pages/ItemListByColor';
import ItemDetail from './pages/ItemDetail';
import ColorList from './pages/ColorList';
import Login from './pages/Login';
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
import ProtectedRoute from './components/ProtectedRoute';
import ManageItems from './admin/ManageItems';

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
    const location = useLocation();
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        const userFromStorage = localStorage.getItem('username');
        const roleIdFromStorage = localStorage.getItem('roleId');
        if (userFromStorage) {
            setUser({ username: userFromStorage, roleId: roleIdFromStorage });
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
                <Route path="/colors" element={<ColorList />} />
                <Route path="/colors/:colorId/items" element={<ItemListByColor />} />
                <Route path="/items/:id" element={<ItemDetail />} />
                <Route path="/login" element={<Login />} />
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
            </Routes>
        </animated.div>
    ));
}

const FooterWrapper = () => {
    const location = useLocation();
    return location.pathname !== '/' ? <Footer /> : null;
};

export default App;
