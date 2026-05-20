# Component Update Guide

## How to Update Components to Use AuthContext

### Pattern 1: Simple User Data Access

#### Before
\\\javascript
const userType = localStorage.getItem('userType');
const userId = localStorage.getItem('userId');
const userName = localStorage.getItem('userName');

useEffect(() => {
  if (userType === 'admin') {
    // do something
  }
}, [userType]);
\\\

#### After
\\\javascript
import { useAuth } from '../context/AuthContext';

const { userType, userId, userName } = useAuth();

useEffect(() => {
  if (userType === 'admin') {
    // do something
  }
}, [userType]);
\\\

### Pattern 2: Conditional Rendering

#### Before
\\\javascript
const userType = localStorage.getItem('userType');

return (
  <div>
    {userType === 'admin' && <AdminPanel />}
    {userType === 'coordinator' && <CoordinatorPanel />}
  </div>
);
\\\

#### After
\\\javascript
import { useAuth } from '../context/AuthContext';

const { userType } = useAuth();

return (
  <div>
    {userType === 'admin' && <AdminPanel />}
    {userType === 'coordinator' && <CoordinatorPanel />}
  </div>
);
\\\

### Pattern 3: Logout

#### Before
\\\javascript
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
  localStorage.removeItem('userId');
  // ... remove all other items
  navigate('/login');
};
\\\

#### After
\\\javascript
import { useAuth } from '../context/AuthContext';

const { logout } = useAuth();

const handleLogout = () => {
  logout();
  navigate('/login');
};
\\\

### Pattern 4: Protected Routes

#### Before
\\\javascript
const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (userType !== 'admin') {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};
\\\

#### After
\\\javascript
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, userType, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (userType !== 'admin') {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};
\\\

### Pattern 5: Display User Info

#### Before
\\\javascript
const userName = localStorage.getItem('userName');
const userEmail = localStorage.getItem('userEmail');
const profileImage = localStorage.getItem('profileImage');

return (
  <div>
    <img src={profileImage} alt={userName} />
    <p>{userName}</p>
    <p>{userEmail}</p>
  </div>
);
\\\

#### After
\\\javascript
import { useAuth } from '../context/AuthContext';

const { user } = useAuth();

return (
  <div>
    <img src={user?.profileImage} alt={user?.name} />
    <p>{user?.name}</p>
    <p>{user?.email}</p>
  </div>
);
\\\

## Components to Update

### 1. AdminDashboard.jsx
- Replace localStorage.getItem('userType') with useAuth
- Replace localStorage.getItem('userId') with useAuth

### 2. CoordinatorDashboard.jsx
- Replace localStorage.getItem('userType') with useAuth
- Replace localStorage.getItem('universityId') with useAuth

### 3. DepartmentManagement.jsx
- Replace localStorage.getItem('userType') with useAuth
- Replace localStorage.getItem('universityId') with useAuth

### 4. SubjectManagement.jsx
- Replace localStorage.getItem('userType') with useAuth

### 5. UniversityManagement.jsx
- Replace localStorage.getItem('userType') with useAuth

### 6. PapersManagement.jsx
- Replace localStorage.getItem('userType') with useAuth

### 7. SessionProjectManagement.jsx
- Replace localStorage.getItem('userType') with useAuth
- Replace localStorage.getItem('universityId') with useAuth

### 8. Layout.jsx
- Replace localStorage.getItem('userType') with useAuth
- Replace localStorage.getItem('userName') with useAuth

### 9. Navbar.jsx
- Replace localStorage.getItem('userName') with useAuth
- Replace localStorage.getItem('profileImage') with useAuth
- Replace localStorage.removeItem() calls with logout()

### 10. Sidebar.jsx
- Replace localStorage.getItem('userType') with useAuth

### 11. ProtectedRoute.jsx
- Replace localStorage.getItem('token') with useAuth
- Replace localStorage.getItem('userType') with useAuth
- Add loading state handling

## Quick Checklist

For each component:
- [ ] Import useAuth hook
- [ ] Call useAuth() in component
- [ ] Replace all localStorage.getItem() calls
- [ ] Replace all localStorage.removeItem() calls with logout()
- [ ] Remove localStorage.setItem() calls (only in Login)
- [ ] Test component works correctly
- [ ] Check console for errors

## Common Mistakes to Avoid

1. **Forgetting to import useAuth**
   - ? const userType = localStorage.getItem('userType');
   - ? const { userType } = useAuth();

2. **Not handling loading state**
   - ? if (!user) return null;
   - ? if (loading) return <Spinner />; if (!user) return null;

3. **Accessing nested properties without optional chaining**
   - ? user.profileImage
   - ? user?.profileImage

4. **Forgetting to add useAuth to dependencies**
   - ? useEffect(() => { ... }, [])
   - ? useEffect(() => { ... }, [userType, userId])

5. **Not removing old localStorage code**
   - ? const userType = localStorage.getItem('userType'); const { userType: authUserType } = useAuth();
   - ? const { userType } = useAuth();

## Testing Each Component

After updating, test:
1. Component renders without errors
2. User data displays correctly
3. Conditional rendering works
4. Logout works
5. Page refresh maintains auth state
6. Invalid token clears properly

## Rollback

If something breaks:
1. Revert the component file
2. Check AuthContext is working
3. Check /users/me endpoint exists
4. Check token is valid
