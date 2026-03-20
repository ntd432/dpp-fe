export function queryProductByCompanyQuery(companyID: string): string {
  return `
prefix dpp-core: <https://ntd432.github.io/dpp/models/dpp-core.ttl#>
prefix schema: <https://schema.org/>
prefix dpp-product-info: <https://ntd432.github.io/dpp/models/dpp-product-info.ttl#>
prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

select ?name ?gtin ?country ?documentation ?productionDate
where {
  ?product a dpp-core:Product ;
    dpp-core:dataGroup ?dataGroup .

  ?dataGroup dpp-core:dataPoint ?dp .
  ?dp a dpp-product-info:ProductIdentificationInformation .

  ?dataGroup dpp-core:dataPoint ?manufacturerDP .
  ?manufacturerDP dpp-product-info:manufacturer ?m .
  ?m a schema:Organization ;
    schema:identifier "${companyID}" .

  optional {
    ?dp  dpp-product-info:productName ?name;
  }
  optional {
    ?dp  dpp-product-info:gtin ?gtin;
  }
  optional {
    ?dp  dpp-product-info:documentation ?documentation;
  }
  optional {
    ?dp dpp-product-info:productionDate ?productionDate;
  }
  optional {
    ?dp dpp-product-info:countryOfOrigin ?countryData.
    ?countryData schema:name ?country.
  }
}
order by ?name ?dpLabel
  `;
}