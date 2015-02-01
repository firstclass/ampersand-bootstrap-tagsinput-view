module.exports = {
    failed: function () {
        return {
            status: 'OK',
            results: [{
                AVC: 'U00-I22-P2-100',
                Address1: '02300',
                CountryName: 'United States',
                GeoAccuracy: 'U0',
                'ISO3166-2': 'US',
                'ISO3166-3': 'USA',
                'ISO3166-N': '840',
                PostalCode: '02300',
                PostalCodePrimary: '02300'
            }]
        };
    },
    success: function () {
        return {
            status: 'OK',
            results: [{
                AVC: 'V44-I44-P3-100',
                Address1: '2508 Crane Dr',
                Address2: 'West Richland WA 99353-5718',
                AdministrativeArea: 'WA',
                CountryName: 'United States',
                DeliveryAddress: '2508 Crane Dr',
                DeliveryAddress1: '2508 Crane Dr',
                GeoAccuracy: 'P4',
                GeoDistance: '5.0',
                'ISO3166-2': 'US',
                'ISO3166-3': 'USA',
                'ISO3166-N': '840',
                Latitude: '46.277900',
                Locality: 'West Richland',
                Longitude: '-119.353180',
                MatchRuleLabel: '1a',
                PostalCode: '99353-5718',
                PostalCodePrimary: '99353',
                PostalCodeSecondary: '5718',
                Premise: '2508',
                PremiseNumber: '2508',
                SubAdministrativeArea: 'Benton',
                Thoroughfare: 'Crane Dr',
                ThoroughfareName: 'Crane',
                ThoroughfareTrailingType: 'Dr',
                ThoroughfareType: 'Dr'
            }]
        };
    }
};
