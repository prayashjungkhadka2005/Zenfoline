const InputField = (props) => {
    return (
      <>
        <div className="flex flex-col  my-4 px-2">
          <label className="text-[16px]  pb-1" htmlFor={props.htmlFor}>
            {props.label}
          </label>
          <input
            name={props.name}
            od={props.id}
            type={props.type}
            placeholder={props.placeholder}
            className="bg-white rounded-md py-2  outline-none border-2 border-red-100 px-4"
          />
        </div>
      </>
    );
  };
  export default InputField;