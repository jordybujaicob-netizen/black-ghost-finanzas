function Input({ 
  type = "text", 
  placeholder 
}) {

  return (

    <input
      type={type}
      placeholder={placeholder}
      className="
        w-full
        px-4
        py-3
        rounded-lg
        bg-black/50
        border
        border-red-900
        text-white
        placeholder-gray-500
        focus:outline-none
        focus:border-red-500
        transition
      "
    />

  )

}

export default Input;