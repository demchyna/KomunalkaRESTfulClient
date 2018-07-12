export default class Indicator {
  constructor(
    public id?: number,
    public current?: number,
    public date?: string,
    public description?: string,
    public previous?: number,
    public meterId?: number
  ) {  }
}
