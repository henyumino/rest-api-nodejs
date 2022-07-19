import {object, string, TypeOf} from 'zod'
import UserModel from '../models/user.model';

export const createUserSchema = object({
  body: object({
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
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.passwordConfirmation"
>;
