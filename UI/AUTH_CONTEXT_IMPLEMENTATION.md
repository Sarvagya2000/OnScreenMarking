# Authentication Context Implementation

## Overview
Replaced localStorage-based user data storage with a centralized AuthContext that stores only the token and fetches user data from the backend.

## Benefits

### Security
- **Reduced Attack Surface**: Only token stored in localStorage, not sensitive user data
- **Token Expiration**: Can implement token refresh without exposing user data
- **Data Validation**: User data always comes from authenticated API endpoint

### Performance
- **Reduced Storage**: Only token stored (typically < 1KB vs multiple user fields)
- **Cleaner State**: Single source of truth for user data
- **Automatic Sync**: User data always in sync with backend

### Maintainability
- **Centralized Logic**: All auth logic in one place
- **Easy Updates**: Changes to user data structure only need backend updates
- **Consistent Access**: All components use same useAuth hook

## Implementation

### AuthContext.jsx
New context that manages:
- User state (fetched from backend)
- Loading state
- Error state
- Login/logout functions
- User data refresh

### Key Features

#### Token Storage
`javascript
// Only token stored in localStorage
localStorage.setItem('token', response.token);
`

#### User Data Fetching
`javascript
// User data fetched from /users/me endpoint
const userData = await apiCall('/users/me');
setUser(userData);
`

#### Hook Usage
`javascript
const { user, userType, userId, login, logout } = useAuth();
`

## Migration Guide

### Before (Old Approach)
`javascript
// Login page
localStorage.setItem('token', data.token);
localStorage.setItem('userType', data.user.userType);
localStorage.setItem('userName', data.user.name);
localStorage.setItem('userId', data.user.id);
localStorage.setItem('userEmail', data.user.email);
localStorage.setItem('profileImage', data.user.profileImage || '');
localStorage.setItem('universityId', data.user.universityId);
localStorage.setItem('departmentId', data.user.departmentId);

// Other pages
const userType = localStorage.getItem('userType');
const userId = localStorage.getItem('userId');
`

### After (New Approach)
`javascript
// Login page
const { login } = useAuth();
await login(email, password);

// Other pages
const { userType, userId, user } = useAuth();
`

## API Endpoint Required

The backend needs a /users/me endpoint that:
- Requires authentication (Bearer token)
- Returns current user data
- Returns user object with all fields:
  - id
  - name
  - email
  - userType
  - profileImage
  - universityId
  - departmentId

Example response:
`json
{
  "id": 1,
  "name": "Admin User",
  "email": "admin@example.com",
  "userType": "admin",
  "profileImage": "https://...",
  "universityId": 1,
  "departmentId": null
}
`

## Files Changed

### New Files
- UI/src/context/AuthContext.jsx - Authentication context

### Modified Files
- UI/src/App.jsx - Wrapped with AuthProvider
- UI/src/pages/Login.jsx - Uses useAuth hook

### Files to Update (Next Steps)
- UI/src/pages/AdminDashboard.jsx - Replace localStorage with useAuth
- UI/src/pages/CoordinatorDashboard.jsx - Replace localStorage with useAuth
- UI/src/pages/DepartmentManagement.jsx - Replace localStorage with useAuth
- UI/src/pages/SubjectManagement.jsx - Replace localStorage with useAuth
- UI/src/pages/UniversityManagement.jsx - Replace localStorage with useAuth
- UI/src/pages/PapersManagement.jsx - Replace localStorage with useAuth
- UI/src/pages/SessionProjectManagement.jsx - Replace localStorage with useAuth
- UI/src/components/Layout.jsx - Replace localStorage with useAuth
- UI/src/components/Navbar.jsx - Replace localStorage with useAuth
- UI/src/components/Sidebar.jsx - Replace localStorage with useAuth
- UI/src/components/ProtectedRoute.jsx - Replace localStorage with useAuth

## Usage Examples

### In Components
`javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, userType, userId, logout } = useAuth();

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <p>Type: {userType}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
`

### Accessing User Data
`javascript
const { 
  user,                    // Full user object
  userType,               // 'admin', 'coordinator', 'examiner'
  userId,                 // User ID
  userName,               // User name
  userEmail,              // User email
  profileImage,           // Profile image URL
  universityId,           // University ID (if applicable)
  departmentId,           // Department ID (if applicable)
  isAuthenticated,        // Boolean
  loading,                // Boolean
  error                   // Error message if any
} = useAuth();
`

### Login
`javascript
const { login } = useAuth();

try {
  await login(email, password);
  // User is now logged in
  navigate('/dashboard');
} catch (err) {
  console.error('Login failed:', err);
}
`

### Logout
`javascript
const { logout } = useAuth();

logout();
// User is logged out, token removed
navigate('/login');
`

### Refresh User Data
`javascript
const { refreshUser } = useAuth();

// Refresh user data from backend
await refreshUser();
`

## Security Considerations

### Token Storage
- Token stored in localStorage (accessible to XSS attacks)
- Consider using httpOnly cookies for production
- Implement CSRF protection

### Token Refresh
- Implement token refresh mechanism
- Automatically refresh before expiration
- Handle token expiration gracefully

### User Data
- User data fetched from authenticated endpoint
- Always validate on backend
- Don't trust client-side user type for authorization

## Error Handling

### Invalid Token
- If token is invalid, it's automatically removed
- User is redirected to login
- Error message displayed

### Network Errors
- Handled gracefully
- Error message shown to user
- User can retry

### Expired Token
- Implement token refresh
- Or redirect to login
- Show appropriate message

## Testing

### Test Cases
1. Login with valid credentials
2. Login with invalid credentials
3. Logout
4. Refresh page (token should persist)
5. Invalid token (should clear and redirect)
6. Network error during login
7. User data fetch failure

## Next Steps

1. Implement /users/me endpoint in backend
2. Update all components to use useAuth hook
3. Remove all localStorage user data access
4. Implement token refresh mechanism
5. Add error handling for token expiration
6. Test all authentication flows
7. Consider httpOnly cookies for production

## Rollback Plan

If issues occur:
1. Revert App.jsx changes
2. Revert Login.jsx changes
3. Remove AuthContext.jsx
4. Restore localStorage usage in components

## Performance Impact

- **Positive**: Reduced localStorage usage
- **Positive**: Centralized state management
- **Neutral**: One additional API call on app load
- **Neutral**: User data always fresh from backend

## Browser Compatibility

- Works with all modern browsers
- localStorage support required
- Context API support required (React 16.8+)
