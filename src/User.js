// ----------useState()----------
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function User() {
//   const [users, setUsers] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // 내부에서 async 를 사용하는 새로운 함수를 선언
//   const fetchUsers = async () => {
//     try {
//       // 요청이 시작 할 때에 error와 users를 초기화
//       setError(null);
//       setUsers(null);
//       // loading 상태를 true로 변경
//       setLoading(true);
//       const res = await axios.get("https://jsonplaceholder.typicode.com/users");
//       setUsers(res.data);
//     } catch (e) {
//       setError(e);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   if (loading) return <div>로딩중..</div>; // 로딩 상태가 활성화 됐을 땐 로딩중.. 이라는 문구
//   if (error) return <div>에러가 발생했습니다</div>;
//   if (!users) return null; // users 값이 아직 없을 때에는 null 을 보여주도록 처리

//   return (
//     <>
//       <ul>
//         {/* users 배열을 렌더링 */}
//         {users.map((user) => (
//           <li key={user.id}>
//             {user.username} ({user.name})
//           </li>
//         ))}
//       </ul>
//       <button onClick={fetchUsers}>불러오기</button>
//     </>
//   );
// }

// export default User;

// ----------useReducer()----------
// import React, { useReducer, useEffect } from "react";
// import axios from "axios";

// function reducer(state, action) {
//   switch (action.type) {
//     case "LOADING":
//       return {
//         loading: true,
//         data: null,
//         error: null,
//       };
//     case "SUCCESS":
//       return {
//         loading: false,
//         data: action.data,
//         error: null,
//       };
//     case "ERROR":
//       return {
//         loading: false,
//         data: null,
//         error: action.error,
//       };
//     default:
//       throw new Error(`Unhandled action type: ${action.type}`);
//   }
// }

// function User() {
//   const [state, dispatch] = useReducer(reducer, {
//     loading: false,
//     data: null,
//     error: null,
//   });

//   const fetchUsers = async () => {
//     dispatch({ type: "LOADING" });
//     try {
//       const response = await axios.get(
//         "https://jsonplaceholder.typicode.com/users"
//       );
//       dispatch({ type: "SUCCESS", data: response.data });
//     } catch (e) {
//       dispatch({ type: "ERROR", error: e });
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const { loading, data: users, error } = state; // state.data 를 users 키워드로 조회

//   if (loading) return <div>로딩중..</div>;
//   if (error) return <div>에러가 발생했습니다</div>;
//   if (!users) return null;

//   return (
//     <>
//       <ul>
//         {users.map((user) => (
//           <li key={user.id}>
//             {user.username} ({user.name})
//           </li>
//         ))}
//       </ul>
//       <button onClick={fetchUsers}>불러오기</button>
//     </>
//   );
// }

// export default User;

// ----------useAsync() Custom Hook 적용----------
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
  const [state, refetch] = useAsync(getUsers, [], true);

  const { loading, data: users, error } = state; // state.data 를 users 키워드로 조회

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!users) return <button onClick={refetch}>불러오기</button>;

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
