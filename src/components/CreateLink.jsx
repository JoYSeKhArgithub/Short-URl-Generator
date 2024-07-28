import React, { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { UrlState } from '@/ContextProvider'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import Error from './Error';
import { Card } from './ui/card';
import * as yup from "yup";
import useFetch from '@/hooks/useFetch';
import { createUrl } from '@/database/apiUrls';
import { QRCode } from 'react-qrcode-logo';
import { BeatLoader } from 'react-spinners';

export function CreateLink() {
  const {user} = UrlState();
  const navigate = useNavigate();
  const ref = useRef()
  let [searchParams,setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [error, setError] = useState({});
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
  });

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Long URL is required"),
    customUrl: yup.string(),
  });

  const handleChange = (e)=>{
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };


  const {
    loading,
    errors,
    data,
    fn: fnCreateUrl
  } = useFetch(createUrl,{...formValues, user_id:user.id});

  useEffect(()=>{
    if(errors == null && data){
      navigate(`/link/${data[0].id}`);
    }
  },[errors,data])

  const createNewLink = async()=>{
    setError([]);
    try {
      await schema.validate(formValues,{abortEarly: false});
      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));

      await fnCreateUrl(blob)
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setError(newErrors);
    }
  }

  return (
    
      <Dialog
       defaultOpen={longLink}
       onOpenChange={(res)=>{
        if (!res) setSearchParams({});
       }}
       >
        <DialogTrigger asChild>
          <Button variant="destructive">Create New Link</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
        <DialogHeader>
        <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
        {formValues?.longUrl && (
          <QRCode ref={ref} size={250} value={formValues?.longUrl} />
        )}
        </DialogHeader>
        <Input 
        id="title" 
        placeholder="Short Link's Title"
        value={formValues.title}
        onChange={handleChange}
        />
        {error.title && <Error message={error.title} />}
        <Input 
         id="longUrl"
         placeholder="Enter your Loooong URL"
         value={formValues.longUrl}
         onChange={handleChange}
         />
        {error.longUrl && <Error message={error.longUrl} />}
        <div className="flex items-center gap-2">
          <Card className="p-2">hashbold.com</Card>/
          <Input
            id="customUrl"
            placeholder="Custom Link (optional)"
            value={formValues.customUrl}
            onChange={handleChange}
            />
        </div>
        {errors && <Error message={errors.message} />}
        <DialogFooter className="sm:justify-start">
          <Button
           type="button"
           variant="destructive"
           onClick={createNewLink}
           disable={loading}
           >
            {loading ? <BeatLoader size={10} color="white" /> : "Create"}
           </Button>
        </DialogFooter>
        </DialogContent>
        </Dialog>
  )
}

export default CreateLink
