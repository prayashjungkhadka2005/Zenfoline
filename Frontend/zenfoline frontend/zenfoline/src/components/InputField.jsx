const InputField = (props) => {
  return (
    <div className="flex flex-col my-4 ">
    <label className="text-[16px] font-light  pb-1 " htmlFor={props.htmlFor}>
        {props.label}
      </label>
      <input
        name={props.name}
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value} 
        onChange={props.onChange} 
        className="bg-[#F8F9FA] font-light rounded-md  outline-none border border-[#000000]/21 px-4 h-[47px] "
      />
    </div>
  );
};

export default InputField;
