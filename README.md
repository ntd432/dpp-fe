# Digital Product Passport (DPP) Proof of Concept (PoC)
Frontend repository for DPP project, written in Javascript using Nextjs

Master's thesis project by [James Nguyen](https://www.linkedin.com/in/ntd432/)

Software Engineering for Green Deals (SE4GD) Erasmus Mundus programme, Cohort 4, 2024-2026 

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). A deployed version on [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) can be found [here](https://ntd432-dpp.vercel.app/)

A Digital Product Passport (DPP) is a structured digital record that follows a product across its lifecycle. It connects key facts such as identity, materials, compliance, sustainability, maintenance history, and end-of-life guidance so everyone in the value chain can access trusted data.

This PoC demonstrates three use case scenarios:
* Add product information (either manually or drag/drop from existing file systems)
* Add DPP linked to a product
* View DPP information from a scannable QR code or the DPP ID

The database used in this project is [TriplyDB](https://triplydb.com/), allowing the storage of linked data knowledge graphs, a product by [Triply](https://triply.cc/en-US).

## Getting Started

Configure prefix for ontology files
```
CORE_PREFIX='https://ntd432.github.io/dpp/models/dpp-core.ttl#'
PRODUCT_INFO_PREFIX='https://ntd432.github.io/dpp/models/dpp-product-info.ttl#'
SUSTAINABILITY_PREFIX="https://ntd432.github.io/dpp/models/dpp-sustainability.ttl#"
EOL_PREFIX="https://ntd432.github.io/dpp/models/dpp-eol.ttl#"
GUIDELINES_PREFIX = "https://ntd432.github.io/dpp/models/dpp-guidelines.ttl#"
COMPLIANCE_PREFIX = "https://ntd432.github.io/dpp/models/dpp-compliance.ttl#"
SUPPLY_CHAIN_PREFIX = "https://ntd432.github.io/dpp/models/dpp-supply-chain.ttl#"
USAGE_PREFIX = "https://ntd432.github.io/dpp/models/dpp-usage.ttl#"
```

Configure TriplyDB API
```
API_BASE_URL=<your-api-base> (https://api.dpp.triplydb.com/queries/<username>)
QUERY_BASE_URL=<your-query> (https://api.dpp.triplydb.com/datasets/<username>/<dataset-name>/sparql)
TRIPLYDB_TOKEN=<your-token>
DATASET_NAME=<dataset-name>
```

Other configuration
```
URL = <host-address>
COMPANY_NAME = <company-name> (Product and DPP data will be stored in this graph)
```