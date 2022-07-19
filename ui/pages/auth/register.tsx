import {useState} from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";
import {zodResolver} from "@hookform/resolvers/zod";
import {object, string, TypeOf} from "zod";

export const createUserSchema = object({
    name: string({
      required_error: 'Name is required'
    }),
    password: string({
      required_error: 'password is required'
    }).min(6, "Password to short - min 6 char"),
    passwordConfirmation: string({
      required_error: 'password confirmation required'
    }),
    email: string({
      required_error: "email is required"
    }).email('not a valid email')
  
}).refine((data) => data.password === data.passwordConfirmation,{
  message: "password do not match",
  path: ["passwordConfirmation"]
})

type CreateUserInput = TypeOf<typeof createUserSchema>;

function RegisterPage(){
  const router = useRouter()
  const {registerError, setRegisterError} = useState(null)
  const {register, 
    formState:{errors},
    handleSubmit
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  async function onSubmit(values: CreateUserInput){
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users`, values);
      router.push("/");

    } catch (e) {
      setRegisterError(e.message)

    }
  }

  console.log({errors})

  return (
    <>
    <p>{registerError}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-element">
          <label htmlFor="email">Email</label>
          <input 
            id="email" 
            type="email" 
            placeholder="email" 
            {...register("email")} 
          />
          <p>{errors.email?.message}</p>
        </div>

        <div className="form-element">
          <label htmlFor="name">Name</label>
          <input 
            id="name" 
            type="text" 
            placeholder="name" 
            {...register("name")} 
          />
          <p>{errors.name?.message}</p>
        </div>

        <div className="form-element">
          <label htmlFor="password">Password</label>
          <input 
            id="password" 
            type="password" 
            placeholder="password" 
            {...register("password")} 
          />
          <p>{errors.password?.message}</p>
        </div>

        <div className="form-element">
          <label htmlFor="passwordConfirmation">password confirmation</label>
          <input 
            id="passwordConfirmation" 
            type="password" 
            placeholder="password confirmation" 
            {...register("passwordConfirmation")} 
          />
          <p>{errors.passwordConfirmation?.message}</p>
        </div>

        <button type="submit">submit</button>
      </form>
    </>
  ); 
}

export default RegisterPage