import { gql, useLazyQuery, useQuery } from '@apollo/client';
import React, { Fragment, useEffect, useState } from 'react';
import { Button, Col, Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuthDispatch } from '../context/auth';

const GET_USERS = gql`
	query getUsers {
		getUsers {
			username
			email
			createdAt
			imageUrl
			latestMessage {
				uuid
				content
				from
				to
				createdAt
			}
		}
	}
`;

const GET_MESSAGES = gql`
	query getMessages($from: String!) {
		getMessages(from: $from) {
			uuid
			content
			from
			to
			createdAt
		}
	}
`;

export default function Home({ history }) {
	const dispatch = useAuthDispatch();
	const [selectedUser, setSelectedUser] = useState(null);

	const logout = () => {
		dispatch({ type: 'LOGOUT' });
		history.push('/login');
	};

	const { loading, data, error } = useQuery(GET_USERS);

	const [getMessages, { loading: messagesLoading, data: messagesData }] = useLazyQuery(
		GET_MESSAGES
	);

	useEffect(() => {
		if (selectedUser) {
			getMessages({ variables: { from: selectedUser } });
		}
	}, [selectedUser]);

	if (messagesData) {
		console.log(messagesData.getMessages);
	}

	let usersMarkup = null;
	if (!data || loading) {
		usersMarkup = <p>Loading...</p>;
	} else if (data.getUsers.length === 0) {
		usersMarkup = <p>No users online at the moment</p>;
	} else if (data.getUsers.length > 0) {
		usersMarkup = data.getUsers.map((user) => (
			<div
				className="d-flex p-3"
				key={user.username}
				onClick={() => setSelectedUser(user.username)}
			>
				<Image
					src={user.imageUrl}
					roundedCircle
					className="mr-2"
					style={{ width: 50, height: 50, objectFit: 'cover' }}
				/>
				<div>
					<p className="text-success">{user.username}</p>
					<p className="font-weight-light">
						{user.latestMessage ? user.latestMessage.content : 'You are now connected'}
					</p>
				</div>
			</div>
		));
	}
	return (
		<Fragment>
			<Row
				className="bg-white justify-content-around mb-1"
				style={{ border: '1px solid black' }}
			>
				<Link to="/login">
					<Button variant="link">Login</Button>
				</Link>
				<Link to="/register">
					<Button variant="link">Register</Button>
				</Link>
				<Button variant="link" onClick={logout}>
					Logout
				</Button>
			</Row>

			<Row className="bg-white" style={{ border: '1px solid black' }}>
				<Col xs={4} className="p-0 bg-secondary">
					{usersMarkup}
				</Col>
				<Col xs={8}>
					{messagesData && messagesData.getMessages.length > 0 ? (
						messagesData.getMessages.map((message) => (
							<p key={message.uuid}>{message.content}</p>
						))
					) : (
						<p>Messages</p>
					)}
				</Col>
			</Row>
		</Fragment>
	);
}
