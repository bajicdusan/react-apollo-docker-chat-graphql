import { Redirect, Route } from 'react-router-dom';
import { useAuthState } from '../context/auth';

export default function DynamicRoute(props) {
	const { user } = useAuthState();

	if (props.authenticated && !user) {
		// authenticated route (homepage...) and no user data
		return <Redirect to="/login" />;
	} else if (props.guest && user) {
		// guest route and have user data
		return <Redirect to="/" />;
	} else {
		return <Route component={props.component} {...props} />;
	}
}
