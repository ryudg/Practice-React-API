# 1. API 연동

> [https://react.vlpt.us/integrate-api/](https://react.vlpt.us/integrate-api/)

> `https://jsonplaceholder.typicode.com/users`를 이용해 실습

## 1.1 API 호출 위해 [`axios`](https://axios-http.com/) Install

```bash
> npm i axios
## or
> yarn add axios
```

## 1.2 REST API

- axios를 사용해서 GET, PUT, POST, DELETE 등의 메서드로 API 요청을 할 수 있다.

> - [REST](https://velog.io/@ryudg_/REST-REST)
> - [REST API & RESTful](https://velog.io/@ryudg_/REST-REST-API)
> - [RESTfull 예제](https://github.com/ryudg/Practice-RESTfull)

## 1.3 Usage

```javascript
import axios from "axios";

axios.get("/users/1");
```

- `get`이 위치한 자리에는 메서드 이름을 소문자
  - 데이터 조회: `axios.get()`
  - 데이터 등록: `axios.post()`
  - 데이터 삭제: `axios.delete()`
  - 데이터 수정: `axios.put()` or `axios.patch()`
- 파라미터에는 API 의 주소 `axios.get("/users/1")`
- `axios.post()` 로 데이터를 등록 할 때에는 두번째 파라미터에 등록하고자 하는 정보
  - ```javascript
    axios.post("/users", {
      username: "SON",
      name: "son",
      age: 30,
    });
    ```

# 2. `useState`와 `useEffect`로 data loading

- `useState`를 사용하여 요청 상태를 관리하고,
- `useEffect`를 사용하여 컴포넌트가 렌더링되는 시점에 요청을 시작하는 작업
- 요청에 대한 상태를 관리 할 때에는 다음과 같이 총 3가지 상태를 관리
  - 요청의 결과
  - 로딩 상태
  - 에러

```javascript
// User.js

import React, { useState, useEffect } from "react";
import axios from "axios";

function User() {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect 에 첫번째 파라미터로 등록하는 함수에는 async 를 사용 할 수 없기 때문에
  useEffect(() => {
    // 내부에서 async 를 사용하는 새로운 함수를 선언
    const fetchUsers = async () => {
      try {
        // 요청이 시작 할 때에 error와 users를 초기화
        setError(null);
        setUsers(null);
        // loading 상태를 true로 변경
        setLoading(true);
        const res = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );
        setUsers(res.data); // res.data 안에 API 데이터가 있다.
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  if (loading) return <div>로딩중..</div>; // 로딩 상태가 활성화 됐을때 렌더링 될 문구
  if (error) return <div>에러가 발생했습니다</div>; // 에러 발생시 렌더링 될 문구
  if (!users) return null; // users 값이 없을 때에는 null 을 보여주도록 처리

  return (
    <ul>
      {/* users 배열을 렌더링 */}
      {users.map((user) => (
        <li key={user.id}>
          {user.username} ({user.name})
        </li>
      ))}
    </ul>
  );
}

export default User;
```

# 3. 버튼을 눌러서 API 재요청

- 버튼을 눌러서 API를 재요청하는 기능을 구현
  - `fetchUsers` 함수를 바깥으로 꺼내주고, 버튼을 만들어서 해당 함수를 연결

```javascript
// User.js

...

// 함수를 바깥으로 꺼내기
const fetchUsers = async () => {
  try {
    setError(null);
    setUsers(null);
    setLoading(true);
    const res = await axios.get("https://jsonplaceholder.typicode.com/users");
    setUsers(res.data);
  } catch (e) {
    setError(e);
  }
  setLoading(false);
};

useEffect(() => {
  fetchUsers();
}, []);

...

return (
    <>
      <ul>
        {/* users 배열을 렌더링 */}
        {users.map((user) => (
          <li key={user.id}>
            {user.username} ({user.name})
          </li>
        ))}
      </ul>
      <button onClick={fetchUsers}>불러오기</button>
    </>
  );
```

# 4. `useReducer`로 요청 상태 관리

- User 컴포넌트에서 `useState`대신에 `useReducer`를 사용해서 구현
  - `useReducer`를 사용하여 `LOADING`, `SUCCESS`, `ERROR` 액션에 따라 다르게 처리

```javascript
// User.js

import React, { useReducer, useEffect } from "react";
import axios from "axios";

// reducer 함수 정의, state와 action을 인수로 받음
// action의 type에 따라서 loading, data, error 값을 설정하는 과정을 구현
function reducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return {
        loading: true,
        data: null,
        error: null,
      };
    case "SUCCESS":
      return {
        loading: false,
        data: action.data,
        error: null,
      };
    case "ERROR":
      return {
        loading: false,
        data: null,
        error: action.error,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// User 컴포넌트에서 reducer 함수와 useReducer Hook을 사용
function User() {
  // useReducer Hook에서 reducer 함수와 초기 state값을 전달
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: null,
  });

  // fetchUsers 함수 정의
  const fetchUsers = async () => {
    // 요청 상태(LOADING, SUCCESS, ERROR)에 따라 dispatch 호출
    // 기본으로 `type: "LOADING"` dispatch가 호출됨
    dispatch({ type: "LOADING" });
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      dispatch({ type: "SUCCESS", data: response.data });
    } catch (e) {
      dispatch({ type: "ERROR", error: e });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const { loading, data: users, error } = state; // state.data 를 users 키워드로 조회

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!users) return null;

  return (
    <>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} ({user.name})
          </li>
        ))}
      </ul>
      <button onClick={fetchUsers}>불러오기</button>
    </>
  );
}

export default User;
```

- `useReducer`로 구현했을 때의 장점
  - `useState`의 `setState`함수를 여러번 사용하지 않아도 된다는점
  - reducer로 로직을 분리했으니 다른곳에서도 쉽게 재사용을 할 수 있다는 점

# 5. `useAsync` Custom Hook 만들어서 사용

- 데이터를 요청해야 할 때마다 reducer를 작성하는 것은 번거롭다.
- 따라서, 매번 반복되는 코드를 작성하는 대신
- Custom Hook 을 만들어서 요청 상태 관리 로직을 쉽게 재사용

```javascript
// useAsync.js

import { useReducer, useEffect } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return {
        loading: true,
        data: null,
        error: null,
      };
    case "SUCCESS":
      return {
        loading: false,
        data: action.data,
        error: null,
      };
    case "ERROR":
      return {
        loading: false,
        data: null,
        error: action.error,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function useAsync(callback, deps = []) {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: null,
  });

  const fetchData = async () => {
    dispatch({ type: "LOADING" });
    try {
      const data = await callback();
      dispatch({ type: "SUCCESS", data });
    } catch (e) {
      dispatch({ type: "ERROR", error: e });
    }
  };

  useEffect(() => {
    fetchData();
    // eslint 설정을 다음 줄에서만 비활성화
    // eslint-disable-next-line
  }, deps);

  // 이 Hook 에서 반환하는 값은 요청 관련 상태와, fetchData 함수
  // fetchData 함수를 반환하여서 나중에 데이터를 쉽게 리로딩
  return [state, fetchData];
}

export default useAsync;
```

- `useAsync(callback, deps = [])`는 두가지 파라미터

  - 첫번째 파라미터는 API 요청을 시작하는 함수
  - 두번째 파라미터는 deps, deps 값은 해당 함수 안에서 사용하는 useEffect 의 deps 로 설정
  - 이 값은 나중에 우리가 사용 할 비동기 함수에서 파라미터가 필요하고, 그 파라미터가 바뀔 때 새로운 데이터를 불러오고 싶은 경우에 활용 할 수 있다.
  - 이 값의 기본값은 []. 즉, 컴포넌트가 가장 처음 렌더링 할 때만 API 를 호출

- `return [state, fetchData];`
  - 이 Hook 에서 반환하는 값은 요청 관련 상태와, fetchData 함수
  - fetchData 함수를 반환하여서 나중에 데이터를 쉽게 리로딩

## 5.1 `useAsync` 적용

```javascript
// App.js

import React from "react";
import axios from "axios";
import useAsync from "./useAsync";

// useAsync 에서는 Promise 의 결과를 바로 data 에 담기 때문에,
// 요청을 한 이후 response 에서 data 추출하여 반환하는 함수를 따로 만듬
async function getUsers() {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  );
  return response.data;
}

function User() {
  const [state, refetch] = useAsync(getUsers, []);

  const { loading, data: users, error } = state;

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!users) return null;

  return (
    <>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} ({user.name})
          </li>
        ))}
      </ul>
      <button onClick={refetch}>불러오기</button>
    </>
  );
}

export default User;
```

# 6. 데이터 요청시 불러오기

- Users 컴포넌트는 컴포넌트가 처음 렌더링 되는 시점부터 API 를 요청하고있다.
- 만약에 특정 버튼을 눌렀을 때만 API 를 요청하고 싶다면,
  (예를 들어, POST, DELETE, PUT, PATCH 등의 HTTP 메서드를 사용해 필요한 시점에만 API 를 호출해야 한다면)
- `useAsync`에 아래와 같이 세번째 파라미터 넣기

```javascript
// userAsync.js

...

// skip 파라미터의 기본 값을 false 로 지정
// 만약 이 값이 true 라면 useEffect 에서 아무런 작업도 하지 않도록 설정
function useAsync(callback, deps = [], skip = false) {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: null,
  });

  ...


...

 useEffect(() => {
    if (skip) return;
    fetchData();
    // eslint 설정을 다음 줄에서만 비활성화
    // eslint-disable-next-line
  }, deps);

...

}
```

- User 컴포넌트 수정

```javascript
// User.js

...

// useAsync의 세번째 파라미터에 true
function User() {
  const [state, refetch] = useAsync(getUsers, [], true);

  ...

  // !users 인 상황에 불러오기 버튼을 렌더링
  if (!users) return <button onClick={refetch}>불러오기</button>;

  ...

}

...

```
