import { getCode } from 'country-list';

export class EUCountryHelper {

  private static countries = [
    'Austria', 'Belgium', 'Bulgaria',
    'Croatia', 'Cyprus', 'Czech Republic',
    'Denmark', 'Estonia', 'Finland',
    'France', 'Germany', 'Greece',
    'Hungary', 'Ireland', 'Italy',
    'Latvia', 'Lithuania', 'Luxembourg',
    'Malta', 'Netherlands', 'Poland',
    'Portugal', 'Romania', 'Slovakia',
    'Slovenia', 'Spain', 'Sweden'
  ];

  public static countryCode() {
    const codes = EUCountryHelper.countries.map(c => {
      if (c === 'Czech Republic') {
        c = 'CZ';
      } else {
        c = getCode(c);
      }
      return c.toLowerCase();
    });
    return codes;
  }

  public static countryName() {
    return EUCountryHelper.countries.map(c => c.toLowerCase());
  }

}
