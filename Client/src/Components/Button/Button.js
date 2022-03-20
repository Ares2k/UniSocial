const Button = (props) => {
  return (
    <button
      className={props.className}
      onClick={props.onClick}
      type={props.type}
      style={props.style}
    >
      {props.label}
    </button>  
  );
}
 
export default Button;