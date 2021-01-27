import { Product } from "./product";

export class User{

  myProduct?: Product[];

  constructor(
    public username: string,
    public name: string,
    public surename: string,
    public address: string,
    public phone: string,
    public password: string
  )
  {}

}
