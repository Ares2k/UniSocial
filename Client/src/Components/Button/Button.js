import React, { Component } from 'react';
// import button from './button.module.css';

const Button = (props) => {
  return (
    <button
      className={props.className}
      onClick={props.onClick}>

    {props.label}
    </button>  
  );
}
 
export default Button;

// class Button extends Component {
//   render() {
//     return (
//       <button
//         className={this.props.className}
//         onClick={this.props.onClick}
//       >
//         {this.props.label}
//       </button>
//     );
//   }
// }

// export default Button;