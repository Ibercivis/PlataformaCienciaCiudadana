import { useState } from 'react'

//hoock usado para establecer los datos de los formularios

export const useForm = <T extends Object> (initialState: T) => {
    const [state, setState] = useState(initialState);
    
      const onChange = <K extends Object>(value: K, field: keyof T) => {
        setState({
          ...state,
          [field]: value,
        });
      };

      const clear = () =>{
        setState(initialState)
      } 

  return {
    ...state,
    form: state,
    setState,
    onChange,
    clear
  }
}

/*
  Ejemplo de uso

   const {onChange, form} = useForm({
    name: '',
    email: '',
    phone: '',
    isSubscribed: false,
  });
  
*/
