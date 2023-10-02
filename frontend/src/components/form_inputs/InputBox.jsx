export default function InputBox ({type,name,label,placeHolder,restClass,...rest}){
    return (
        <div className="mb-2 flex flex-col-reverse w-full">
            <input type={type} id={name} name={name} className={`focus:bg-teal-50 border border-teal-700 focus:border-teal-800 focus:text-teal-900 px-3 py-2 rounded-sm w-[100%] outline-none peer ${restClass}`} placeholder={placeHolder} {...rest}/>
            <label htmlFor={name} className="block mb-1 text-sm font-medium text-teal-700 peer-focus:text-black">{label}</label>
        </div>
    )
}


// after:content-['*'] after:text-red-600 after:ml-2