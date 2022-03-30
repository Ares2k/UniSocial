const MutualEducation = (props) => {
  return (
    <div className={props.wrapper}>
      {props.icon}
      <p style={{ margin: "0 20px" }}>{props.info || 'N/A'}</p>
    </div> 
  );
}
 
export default MutualEducation; 