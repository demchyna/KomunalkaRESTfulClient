import Unit from './Unit';

export default class Meter {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public unit: Unit = new Unit()
  ) {  }
}
