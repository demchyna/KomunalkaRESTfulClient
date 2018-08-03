import Category from './Category';
import Unit from './Unit';

export default class Tariff {
  constructor(
    public id?: number,
    public name?: string,
    public currency?: string,
    public rate?: number,
    public begin_date?: string,
    public end_date?: string,
    public description?: string,
    public category: Category = new Category(),
    public unit: Unit = new Unit()
  ) {  }
}
