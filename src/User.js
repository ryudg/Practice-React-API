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
        setUsers(res.data);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  if (loading) return <div>로딩중..</div>; // 로딩 상태가 활성화 됐을 땐 로딩중.. 이라는 문구
  if (error) return <div>에러가 발생했습니다</div>;
  if (!users) return null; // users 값이 아직 없을 때에는 null 을 보여주도록 처리

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
