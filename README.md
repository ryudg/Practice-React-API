# 1. API 연동

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
-

# 2. `useState`와 `useEffect`로 data loading

- `useState`를 사용하여 요청 상태를 관리하고,
- `useEffect`를 사용하여 컴포넌트가 렌더링되는 시점에 요청을 시작하는 작업
- 요청에 대한 상태를 관리 할 때에는 다음과 같이 총 3가지 상태를 관리
  - 요청의 결과
  - 로딩 상태
  - 에러

```javascript
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
          "https://jsonplaceholder.typicode.com/user"
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
