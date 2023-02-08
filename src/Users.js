import axios from 'axios';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';

const fetchUsers = () => axios.get('http://localhost:4000/users');

const addNewUser = (userName) =>
  axios.post('http://localhost:4000/users', {
    name: userName,
  });

const Users = () => {
  const [username, setUsername] = useState('');
  const { isLoading, data, refetch } = useQuery({
    queryKey: 'users',
    queryFn: fetchUsers,
  });
  const { mutate } = useMutation(addNewUser, {
    onSuccess: refetch,
  });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <input
        placeholder='Enter name'
        value={username}
        onChange={(e) => setUsername(e?.target?.value)}
      />
      <button onClick={refetch}>Fetch Users</button>
      <button onClick={() => mutate(username)}>Add User</button>
      {data?.data?.map((user) => (
        <p key={user?.id}>{user?.name}</p>
      ))}
    </div>
  );
};

export default Users;
