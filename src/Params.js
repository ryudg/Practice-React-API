// ----------Custom Hook-----
// import React from "react";
// import axios from "axios";
// import useAsync from "./useAsync";

// async function getUser(id) {
//   const response = await axios.get(
//     `https://jsonplaceholder.typicode.com/users/${id}`
//   );
//   return response.data;
// }

// function Params({ id }) {
//   const [state] = useAsync(() => getUser(id), [id]);
//   const { loading, data: user, error } = state;

//   if (loading) return <div>로딩중..</div>;
//   if (error) return <div>에러가 발생했습니다</div>;
//   if (!user) return null;

//   return (
//     <div>
//       <h2>{user.username}</h2>
//       <p>
//         <b>Email:</b> {user.email}
//       </p>
//     </div>
//   );
// }

// export default Params;

// ----------react-async 의 useAsync----------
import React from "react";
import axios from "axios";
import { useAsync } from "react-async";

async function getUser(id) {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  return response.data;
}

function Params({ id }) {
  // useAsync 를 사용할 때에는 프로미스를 반환하는 함수의 파라미터를 객체형태로
  // ex) async function getUser({ id }) { ... }
  // useAsync 를 사용 할 때 watch 값에 특정 값을 넣어주면 이 값이 바뀔 때마다 promiseFn 에 넣은 함수를 다시 호출해줌
  const {
    data: user,
    error,
    isLoading,
  } = useAsync({
    promiseFn: getUser,
    id,
    watch: id,
  });

  if (isLoading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!user) return null;

  return (
    <div>
      <h2>{user.username}</h2>
      <p>
        <b>Email:</b> {user.email}
      </p>
    </div>
  );
}

export default Params;
