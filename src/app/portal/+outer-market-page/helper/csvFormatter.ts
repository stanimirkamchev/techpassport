import { switchMap, map, catchError, withLatestFrom, tap, filter } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';

export const CSVToArray = (strData: any, strDelimiter: string) => {
  strDelimiter = (strDelimiter || ',');
  const objPattern = new RegExp(
    (
      // Delimiters.
      '(\\' + strDelimiter + '|\\r?\\n|\\r|^)' +

      // Quoted fields.
      '(?:"([^"]*(?:""[^"]*)*)"|' +

      // Standard fields.
      '([^"\\' + strDelimiter + '\\r\\n]*))'
    ),
    'gi'
  );

  const arrData = [[]];
  let arrMatches = null;

  while (arrMatches = objPattern.exec(strData)) {

    const strMatchedDelimiter = arrMatches[1];

    if (
      (strMatchedDelimiter as any).length &&
      strMatchedDelimiter !== strDelimiter
    ) {

      arrData.push([]);

    }

    let strMatchedValue;

    if (arrMatches[2]) {
      strMatchedValue = arrMatches[2].replace(
        new RegExp('""', 'g'),
        '"'
      );

    } else {
      strMatchedValue = arrMatches[3];

    }

    arrData[arrData.length - 1].push(strMatchedValue);
  }

  return (arrData);
};

export const transformCsv = (outerMarketData: string) => {
  const delimiterType = outerMarketData.split('Record Status;').length === 2 ? ';' : ',';
  const outerMarketArray = CSVToArray(outerMarketData, delimiterType);
  const outerMarketObject = outerMarketArray.map(rows => {
    const obj = {
      recordStatus: rows[0] || null,
      orgId: rows[1] || null,
      company: rows[2] || '',
      url: rows[3] || '',
      description: rows[4] || '',
      taxonomy: rows[5] || '',
      country: rows[6] || '',
      totalFunding: rows[7] || null,
      latestFundingRound: rows[8] || '',
      latestFundingDate: rows[9] || '',
      latestFundingAmount: rows[10] || null,
      investors: rows[11] && rows[11].length > 0 ? rows[11].split(', ') : [],
      latestValuation: rows[12] || null,
      acquirers: rows[13] && rows[13].length > 0 ? rows[13].split(', ') : [],
      latestRevenueMin: rows[14] || null,
      latestRevenueMax: rows[15] || null,
      revenueTimePeriod: rows[16] || '',
      latestRevenueMultipleMin: rows[17] || null,
      latestRevenueMultipleMax: rows[18] || null,
      competitors: rows[19] && rows[19].length > 0 ? rows[19].split(', ') : [],
      mosaic: rows[20] || null,
      invitationStatus: rows[21] && rows[21].length > 0 ? rows[21] : 'not invited',
      isFreezed: rows[22] && rows[22].length > 0 ? rows[22] : false
    };
    return obj;
  });

  outerMarketObject.shift();

  return outerMarketObject.filter(e => e.orgId && e.orgId.length > 0);
};
