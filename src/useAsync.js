// ----------렌더링될 때 불러오기----------
// import { useReducer, useEffect } from "react";

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
// // useAsync 함수는 두가지 파라미터
// // 첫번째 파라미터는 API 요청을 시작하는 함수
// // 두번째 파라미터는 deps, deps 값은 해당 함수 안에서 사용하는 useEffect 의 deps 로 설정
// // 이 값은 나중에 우리가 사용 할 비동기 함수에서 파라미터가 필요하고, 그 파라미터가 바뀔 때 새로운 데이터를 불러오고 싶은 경우에 활용 할 수 있다.
// // 이 값의 기본값은 []. 즉, 컴포넌트가 가장 처음 렌더링 할 때만 API 를 호출
// function useAsync(callback, deps = []) {
//   const [state, dispatch] = useReducer(reducer, {
//     loading: false,
//     data: null,
//     error: null,
//   });

//   const fetchData = async () => {
//     dispatch({ type: "LOADING" });
//     try {
//       const data = await callback();
//       dispatch({ type: "SUCCESS", data });
//     } catch (e) {
//       dispatch({ type: "ERROR", error: e });
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     // eslint 설정을 다음 줄에서만 비활성화
//     // eslint-disable-next-line
//   }, deps);

//   // 이 Hook 에서 반환하는 값은 요청 관련 상태와, fetchData 함수
//   // fetchData 함수를 반환하여서 나중에 데이터를 쉽게 리로딩
//   return [state, fetchData];
// }

// export default useAsync;

// ----------요청시에만 데이터 불러오기----------
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

// skip 파라미터의 기본 값을 false 로 지정
// 만약 이 값이 true 라면 useEffect 에서 아무런 작업도 하지 않도록 설정
function useAsync(callback, deps = [], skip = false) {
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
    if (skip) return;
    fetchData();
    // eslint 설정을 다음 줄에서만 비활성화
    // eslint-disable-next-line
  }, deps);

  return [state, fetchData];
}

export default useAsync;
