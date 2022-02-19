const DisplayUsers = ({ users }) => {
  return (
    <div>
      {users.map((user) => (
        <div className="user" key={user._id}>
          <h2>name: { user.username }</h2>
          {user.hobbies.map(hobby => (
            <p key={hobby}>Hobby: {hobby}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
 
export default DisplayUsers;