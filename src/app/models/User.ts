import Role from './Role';

export default class User {
  constructor(
    public id?: number,
    public first_name?: string,
    public last_name?: string,
    public username?: string,
    public password?: string,
    public email?: string,
    public create_date?: string,
    public description?: string,
    public authorities?: Role[]
  ) {  }
}
