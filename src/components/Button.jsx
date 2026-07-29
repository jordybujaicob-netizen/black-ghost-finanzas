function Button({ children }) {

  return (

    <button

      className="
      w-full
      py-3
      rounded-lg
      bg-red-700
      hover:bg-red-600
      text-white
      font-bold
      transition
      shadow-lg
      shadow-red-900/30
      "

    >

      {children}

    </button>

  )

}


export default Button;