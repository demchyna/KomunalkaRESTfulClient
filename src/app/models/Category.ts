import User from './User';

export default class Category {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public user: User = new User()

  ) {  }
}
