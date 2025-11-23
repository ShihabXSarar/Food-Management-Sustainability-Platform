import React from 'react';

import { Navigate } from 'react-router';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({children}) => {
    const { user, loading } = React.useContext(AuthContext);
    
    if(loading){
        return <div>Loading...</div>
    }

    if (!user) {
      return <Navigate to="/" ></Navigate>
    }
    return children;
};

export default PrivateRoute;