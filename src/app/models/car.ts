import { Users } from "./user";


export class Cars {
  id : number = 0;
  year : Number;
  licensePlate : String;
  model : String;
  color : String;
  user: Users = new Users();
}
