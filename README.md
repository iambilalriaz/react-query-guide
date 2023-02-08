![React Query](./src/assets/rq.png)
Data fetching is an essential part of building modern web applications. As there is no specific approach to fetch data from API in React, developers do it in their own ways. One of the most popular method is to use React's hook `useEffect`.

## Disadvantages of existing data fetching techniques (useEffect)

One of the biggest disadvantages of using the useEffect hook for data fetching is the unnecessary re-renders that can occur. This can lead to poor performance, especially in complex applications with multiple components and large data sets. Additionally, managing state and handling errors can become challenging when using useEffect.

## Intro to React Query

React Query is a library that makes it easy to fetch, cache, and manage data in your React applications. It provides a simple and effective solution for data fetching that overcomes many of the disadvantages of using useEffect.

## Implementation

Enough talk, let's code now.

### Creating React App

Let's create a react app first.

```bash
npx create-react-app react-query-guide
cd react-query-guide
npm start
```

or

```bash
yarn create react-app react-query-guide
cd react-query-guide
yarn start
```

Your app would be live on [http://localhost:3000](http://localhost:3000)

### Install `react-query`

```bash
npm install react-query
```

or

```bash
yarn add react-query
```

### Setup JSON Server

Now let's setup a json server for users API
Install `json-server` package:

```bash
npm install json-server
```

or

```bash
yarn add json-server
```

Create a file `db.json` and populate following data in it:

```json
{
  "users": [
    {
      "id": 1,
      "name": "Bilal Riaz"
    },
    {
      "id": 2,
      "name": "Haris Ejaz"
    },
    {
      "id": 3,
      "name": "Hamza Hameed"
    },
    {
      "id": 4,
      "name": "Zeeshan Ali"
    }
  ]
}
```

Add a script in `package.json` file as:

```json
"serve-json": "json-server --watch db.json --port 4000"
```

Then execute

```bash
npm run serve-json
```

or

```bash
yarn run serve-json
```

Your server would be running on [http://localhost:4000](http://localhost:4000)

### Introducing React Query

Now it's time to use React Query in our app. Let's update our `App.js` file:

```jsx
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div>App</div>
    </QueryClientProvider>
  );
};

export default App;
```

We have created a `queryClient` with the use of `QueryClient`, provide it to `QueryClientProvider` and wrap the whole app with it. This is essential to make use of React Query's features throughout the app.

### Fetching Data with `useQuery`

Now it's time to make network requests. Let's install `axios` for this purpose.
Install `axios`:

```bash
npm install axios
```

or

```bash
yarn add axios
```

Create a component `Users.js` to display fetched users from API.

```jsx
import axios from 'axios';
import { useQuery } from 'react-query';

const fetchUsers = () => axios.get('http://localhost:4000/users');

const Users = () => {
  const { isLoading, data } = useQuery({
    queryKey: 'users',
    queryFn: fetchUsers,
  });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      {data?.data?.map((user) => (
        <p key={user?.id}>{user?.name}</p>
      ))}
    </div>
  );
};

export default Users;
```

Here we're using `useQuery` hook to fetch users data. We have provided a unique `queryKey` and a function `fetchUsers` which returns a promise to `queryFn` property.

We get several properties from `useQuery` hook as two of them `isLoading` & `data` have been shown in the code.

Then make use of `Users.js` component in `App.js`:

```jsx
import { QueryClient, QueryClientProvider } from 'react-query';
import Users from './Users';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Users />
    </QueryClientProvider>
  );
};

export default App;
```

We have successfully fetched users with the use of React Query.

### `cacheTime`

By default, your query remains in the cache for 5 minutes but you can configure it as:

```jsx
const { isLoading, data } = useQuery({
  queryKey: 'users',
  queryFn: fetchUsers,
  cacheTime: 2000,
});
```

You can configure `cacheTime` in milliseconds.
You are probably thinking what actually cacheTime means? Basically it is the time for how long your query would be cached. For example, you fetch users with `queryKey: "users"`, fetching users would bring data from `cache` and fetching from API continues in the background and then updates the cached data with the data from API.

### `staleTime`

By default, every query will trigger a network request if you are fetching something from API. But you can use the cached data instead of making network request again & again. It is helpful in the case where we know that the data coming from API is static as it doesn’t often change. To do so, you can configure `staleTime` in milliseconds as:

```jsx
const { isLoading, data } = useQuery({
    queryKey: 'users',
    queryFn: fetchUsers,
    staleTime: 30000  //0ms by default
  }
```

### Fetching Data on Button Click

Till now, API request is being made when component mounts. If we want to fetch users on some button click, we would configure `useQuery` hook as:

```jsx
const { isLoading, data, refetch } = useQuery({
    queryKey: 'users',
    queryFn: fetchUsers,
    enabled: false
  }
```

`refetch` is a function to run the `queryFn` function.
We would add a button in jsx and configure it to fetch users on clicking it.

```jsx
<div>
  <button onClick={refetch}>Fetch Users</button>
  {data?.data?.map((user) => (
    <p key={user?.id}>{user?.name}</p>
  ))}
</div>
```

### Posting Data with `useMutation`

Enough for fetching data, it's time to talk about posting/updating data. We would use `useMutation` hook for this purpose. Let's implement adding user feature with it.
Update your `Users.js` file as:

```jsx
import axios from 'axios';
import { useMutation, useQuery } from 'react-query';

const fetchUsers = () => axios.get('http://localhost:4000/users');

const addNewUser = () =>
  axios.post('http://localhost:4000/users', {
    name: 'Ali Zuberi',
  });

const Users = () => {
  const { isLoading, data, refetch } = useQuery({
    queryKey: 'users',
    queryFn: fetchUsers,
  });
  const { mutate } = useMutation(addNewUser);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <button onClick={refetch}>Fetch Users</button>
      <button onClick={mutate}>Add User</button>
      {data?.data?.map((user) => (
        <p key={user?.id}>{user?.name}</p>
      ))}
    </div>
  );
};

export default Users;
```

We have created `addNewUser` function which return a promise and assign it to the `useMutation` hook. We have extracted out `mutate` function from the hook which would be called on clicking `Add User` button.

### Refetch Data After Mutation

New user can be added successfully till now. But the issue is that adding a new user is not re-fetching the updated users list. To do so, configure `useMutation` with `onSuccess` function as:

```jsx
const { mutate } = useMutation(addNewUser, {
  onSuccess: refetch,
});
```

### Mutate Data with Dynamic Values

If you want to add a new user with the name provided by an input, update `Users.js` file as:

```jsx
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
      <div>
        <input
          placeholder='Enter name'
          value={username}
          onChange={(e) => setUsername(e?.target?.value)}
        />
      </div>
      <button onClick={() => mutate(username)}>Add User</button>
      <button onClick={refetch}>Fetch Users</button>
      {data?.data?.map((user) => (
        <p key={user?.id}>{user?.name}</p>
      ))}
    </div>
  );
};

export default Users;
```

## Conclusion

React Query is a powerful tool for simplifying data management in React applications, making it easier to fetch, cache, and manage data with ease. Whether you're a beginner or an experienced developer, incorporating React Query into your workflow can greatly enhance the performance and efficiency of your applications. So, start exploring its capabilities today and elevate your React development game.

## Links

Co-authored by - [harisbinejaz](https://dev.to/harisbinejaz)
