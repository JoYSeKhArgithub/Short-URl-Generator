import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import Error from './Error'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { BeatLoader } from 'react-spinners'
import * as Yup from "yup"
import useFetch from '@/hooks/useFetch'
import { login } from '@/database/apiAuth'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { UrlState } from '@/ContextProvider'
function Login() {
    
    const [error,setError] = useState({})
    const [formData,setFormData] = useState({
      email: "",
      password: ""
  });
    const navigate = useNavigate();
    let [searchParams]=useSearchParams();
    const longLink = searchParams.get("createNew");
    const handleInputChange = (e) =>{
        const {name,value} = e.target;
        setFormData((prevState) =>({
            ...prevState,
            [name]: value,
        }))
    }

   const {data, errors, loading, fn:fnLogin} = useFetch(login,formData)
    const {fetchUser} = UrlState()
    useEffect(()=>{
      if(errors === null && data){
        navigate(`/dashboard?${longLink ? `createNew=${longLink}`: ""}`);
        fetchUser();
      }
    },[data,errors])

    const handleLogin = async (e) =>{
        setError([]);
        try {
            const schema = Yup.object().shape({
                email: Yup.string()
                .email("Invalid email")
                .required("Email is required"),
                password: Yup.string()
                .min(6,"Password must be at least 6 characters")
                .required("Password is required"),
            })
            await schema.validate(formData,{abortEarly: false});
            //api call 
            await fnLogin();
        } catch (e) {
            const newErrors = {};
            e?.inner?.forEach((err) => {
                newErrors[err.path] = err.message;
            });
            setError(newErrors)
        }
    }

  return (
    <Card>
    <CardHeader>
      <CardTitle>Login</CardTitle>
      <CardDescription>
        to your account if you already have one
      </CardDescription>
      {errors && <Error message={errors.message}/>}
    </CardHeader>
    <CardContent className="space-y-2">
      <div className="space-y-1">
        <Input
          name="email"
          type="email"
          placeholder="Enter Email"
          onChange={handleInputChange}
        />
      </div>
      {error.email && <Error message={error.email}/>}
      <div className="space-y-1">
        <Input
          name="password"
          type="password"
          placeholder="Enter Password"
          onChange={handleInputChange}
        />
      </div>
       {error.password && <Error message={error.password}/>}
    </CardContent>
    <CardFooter>
      <Button onClick={handleLogin}>
        {loading ? <BeatLoader size={10} color="#36d7b7" /> : "Login"}
      </Button>
    </CardFooter>
  </Card>
  )
}

export default Login
