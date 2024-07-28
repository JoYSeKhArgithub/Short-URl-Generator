import { useState } from 'react'
function useFetch(cb,options = {}) {
  const [data,setData] = useState(null);
  const [loading,setLoading] = useState(null);
  const [errors,setErrors] = useState(null);

  const fn = async(...args)=>{
    setLoading(true);
    setErrors(null);
    try {
      const response = await cb(options,...args);
      setData(response);
      setErrors(null);
    } catch (errors) {
      setErrors(errors)
    } finally{
      setLoading(false);
    }
  }


  return {data,loading,errors,fn}
}

export default useFetch
