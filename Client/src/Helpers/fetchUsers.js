// const fetchUsers = async (url, token) => {
//   let response = await fetch(url, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': 'Bearer ' + token
//     }
//   });
  
//   response = await response.json();

//   if(response.status !== 200)
//     console.log(response);
//   else
//     return response.users;
// }

// export default fetchUsers;

const fetchUsers = (url, token) => {
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
  .then(res => res.json())
  .then(res => {
    if(res.status !== 200) {
      console.log(res);
    } else {
      console.log(res.users);
      return res.users;
    }
  })
  .catch(err => {
    console.log(err);
  })
}
 
export default fetchUsers;