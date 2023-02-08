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

function User() {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: null,
  });

  const fetchUsers = async () => {
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
