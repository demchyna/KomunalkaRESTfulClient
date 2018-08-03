export default class Indicator {
  constructor(
    public id?: number,
    public current?: number,
    public date?: string,
    public previous?: number,
    public previousId?: number,
    public meterId?: number,
    public tariffId?: number,
    public status?: boolean,
    public price?: number,
    public description?: string,
  ) {  }
}
