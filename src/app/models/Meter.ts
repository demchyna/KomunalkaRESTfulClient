import Unit from './Unit';
import Category from './Category';
import User from './User';

export default class Meter {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public unit: Unit = new Unit(),
    public category: Category = new Category()
  ) {  }
}
