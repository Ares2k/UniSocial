import style from './inputBox.module.css';

const InputBox = (props) => {
  return (
    <div className={`${style.inputWrapper} ${props.overrideStyle}`}>
      <div className={style.centeredInput}>
        <p>{props.title || props.label}</p>
        <input
          id={props.id}
          type={props.type || 'text'}
          autoComplete='off'
          value={props.val}
          onChange={props.onChange}
          placeholder={`Enter your ${props.label}`}
          disabled={props.allowInput ? false : true}
          className={props.className}
        />
      </div>
    </div>
  );
}
 
export default InputBox;