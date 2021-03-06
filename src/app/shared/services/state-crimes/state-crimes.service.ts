import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { StateCrimesModel, IStateCrimes, CrimesState } from './state-crimes.model';
import BaseService from '../base.service';

@Injectable()
export class StateCrimesService extends BaseService {

  constructor(protected _http: Http) {
    super(_http);
  }

  private _apiUrl: string = 'https://data.gov.in/node/89971/datastore/export/json';

  /**
   * Utility to shorten other calls
   * Call all function keys on passed in list
   */
  private _objectBasedMap = (objectMap: any) =>
    (dataList: any, fieldList: any) =>
      dataList.map((data, index) =>
        Object.keys(objectMap).reduce((memo, key) => {
          memo[key] = objectMap[key].apply(objectMap, [data, fieldList, index]);
            return memo;
        }, {}));

  private _simpleData = this._objectBasedMap(StateCrimesModel);
  private _transformedData = (data: any, fields: any) => {
    return this._simpleData(data, fields);
  };

  protected _extractData(res: Response) {
    let rsData = res.json();
    return rsData || {};
  };

  getCrimesData(): Observable<any> {
    const lastMoment = (response: IStateCrimes) => this._transformedData(response.data, response.fields);
    return this.getAPIData(this._apiUrl).map(lastMoment);
  }
}
