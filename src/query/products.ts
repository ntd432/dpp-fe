export function queryProductByCompanyQuery(companyID: string): string {
  return `
    prefix dpp-core: <https://ntd432.github.io/dpp/models/dpp-core.ttl#>
    prefix schema: <https://schema.org/>
    prefix dpp-product-info: <https://ntd432.github.io/dpp/models/dpp-product-info.ttl#>

    select ?name ?gtin ?serial ?country ?documentation ?productionDate
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
        ?dp  dpp-product-info:name ?name;
    }
    optional{
        ?dp  dpp-product-info:gtin ?gtin;
    }
    optional  {
        ?dp dpp-product-info:serial ?serial.
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
    order by ?name
  `;
}

export function queryProductByGTINQuery(gtin: string): string {
  return `
    PREFIX dpp-core:          <https://ntd432.github.io/dpp/models/dpp-core.ttl#>
    PREFIX dpp-product-info:  <https://ntd432.github.io/dpp/models/dpp-product-info.ttl#>
    PREFIX dpp-compliance:    <https://ntd432.github.io/dpp/models/dpp-compliance.ttl#>
    PREFIX dpp-supply-chain:  <https://ntd432.github.io/dpp/models/dpp-supply-chain.ttl#>
    PREFIX dpp-sustainability:<https://ntd432.github.io/dpp/models/dpp-sustainability.ttl#>
    PREFIX dpp-eol:           <https://ntd432.github.io/dpp/models/dpp-eol.ttl#>
    PREFIX dpp-guidelines:    <https://ntd432.github.io/dpp/models/dpp-guidelines.ttl#>
    PREFIX dpp-usage:         <https://ntd432.github.io/dpp/models/dpp-usage.ttl#>
    PREFIX schema:            <https://schema.org/>
    PREFIX rdfs:              <http://www.w3.org/2000/01/rdf-schema#>

    SELECT
    # DPP
    ?dppLabel
    # PII
    ?gtin ?name ?serial ?country ?documentation ?productionDate
    # Manufacturer
    ?manufacturerName ?manufacturerUrl ?manufacturerIdentifier
    # Material
    ?materialComposition ?materialBills ?recycledReusedContent
    # Spare parts, hazardous, substances of concern
    ?sparePartsAvailability
    ?hazSubName ?hazSubDesc
    ?substancesOfConcern
    # Spec, test, assembly, production method
    ?productSpecification ?testReports
    ?assemblyProcess ?productionMethod
    # Commercial, quality, risk
    ?image ?lifetimeExpectancy
    ?qualityAssessment ?identifiedRisk
    # Compliance
    ?regulationName ?regulationId
    ?labelName
    ?productStatus ?productStatusDesc
    ?certName ?certDesc
    ?dmmName ?dmmDesc
    # Supply chain
    ?traceActionName ?traceActionType ?traceTime ?traceLocation
    ?recyclingPartnerName
    ?returnChannelName
    ?componentSupplierName
    # Sustainability
    ?envFootprint ?resourceConsumption
    ?decomposability
    ?criticalRawMaterial ?lca
    ?renewableContent
    ?labourConditions
    ?envDeclaration
    # End-of-life
    ?recyclingReusePotential ?disposalOptions ?expectedWaste
    ?reusability ?repairability ?refurbishability
    ?upgradeOptions ?numberOfLifecycles
    ?wastePrevention ?separateCollection ?collectionInfo ?eolReport
    # Guidelines
    ?assemblyGuideUrl ?disassemblyGuideUrl
    ?productManualUrl ?storageGuideUrl
    ?safetyUrl ?maintenanceUrl ?wasteSortingUrl
    ?accessibility ?utilizationCharacteristic
    # Usage
    ?maintActionName ?maintTime
    ?usageActionName ?usageTime
    ?incidentActionName ?incidentTime
    WHERE {

    # ── Identify product by GTIN ───────────────────────────────────────
    ?product a dpp-core:Product ;
            dpp-core:dpp ?dpp ;
            dpp-core:dataGroup ?piGroup .

    ?piGroup dpp-core:dataPoint ?piiDP .
    ?piiDP a dpp-product-info:ProductIdentificationInformation ;
            dpp-product-info:gtin "${gtin}" .

    OPTIONAL { ?dpp rdfs:label ?dppLabel }

    # ════════════════════════════════════════════════════════════════════
    # 1. PRODUCT INFORMATION  (all from ?piGroup)
    # ════════════════════════════════════════════════════════════════════

    # ── PII ──
    OPTIONAL { ?piiDP dpp-product-info:gtin            ?gtin }
    OPTIONAL { ?piiDP dpp-product-info:name            ?name }
    OPTIONAL { ?piiDP dpp-product-info:serial          ?serial }
    OPTIONAL { ?piiDP dpp-product-info:documentation   ?documentation }
    OPTIONAL { ?piiDP dpp-product-info:productionDate  ?productionDate }
    OPTIONAL {
        ?piiDP dpp-product-info:countryOfOrigin ?countryData .
        ?countryData schema:name ?country .
    }

    # ── Manufacturer ──
    OPTIONAL {
        ?piGroup dpp-core:dataPoint ?mfDP .
        ?mfDP a dpp-product-info:Manufacturer ;
            dpp-product-info:manufacturer ?mfData .
        ?mfData schema:name ?manufacturerName .
        OPTIONAL { ?mfData schema:url        ?manufacturerUrl }
        OPTIONAL { ?mfData schema:identifier ?manufacturerIdentifier }
    }

    # ── Material Information ──
    OPTIONAL {
        ?piGroup dpp-core:dataPoint ?matDP .
        ?matDP a dpp-product-info:MaterialInformation .
        OPTIONAL { ?matDP dpp-product-info:materialComposition   ?materialComposition }
        OPTIONAL { ?matDP dpp-product-info:materialBills         ?materialBills }
        OPTIONAL { ?matDP dpp-product-info:recycledReusedContent ?recycledReusedContent }
    }

    # ── Spare Parts ──
    OPTIONAL {
        ?piGroup dpp-core:dataPoint ?spDP .
        ?spDP a dpp-product-info:SparePartsAvailability ;
            dpp-product-info:sparePartsAvailability ?sparePartsAvailability .
    }

    # ── Hazardous Substances ──
    OPTIONAL {
        ?piGroup dpp-core:dataPoint ?hazDP .
        ?hazDP a dpp-product-info:HazardousSubstances ;
            dpp-product-info:hazardousSubstances ?hazSub .
        OPTIONAL { ?hazSub schema:name        ?hazSubName }
        OPTIONAL { ?hazSub schema:description ?hazSubDesc }
    }

    # ── Substances of Concern ──
    OPTIONAL {
        ?piGroup dpp-core:dataPoint ?socDP .
        ?socDP a dpp-product-info:SubstancesOfConcern ;
            dpp-product-info:substancesOfConcern ?substancesOfConcern .
    }

    # ── Product Specification ──
    OPTIONAL {
        ?piGroup dpp-core:dataPoint ?specDP .
        ?specDP a dpp-product-info:ProductSpecification ;
                dpp-product-info:productSpecification ?productSpecification .
    }

    # ── Test Reports ──
    OPTIONAL {
        ?piGroup dpp-core:dataPoint ?testDP .
        ?testDP a dpp-product-info:TestReports ;
                dpp-product-info:testReports ?testReports .
    }

    # ── Assembly Process ──
    OPTIONAL {
        ?piGroup dpp-core:dataPoint ?asmDP .
        ?asmDP a dpp-product-info:AssemblyProcess ;
            dpp-product-info:assemblyProcess ?assemblyProcess .
    }

    # ── Production Method ──
    OPTIONAL {
        ?piGroup dpp-core:dataPoint ?pmDP .
        ?pmDP a dpp-product-info:ProductionMethod ;
            dpp-product-info:productionMethod ?productionMethod .
    }

    # ── Commercial Information ──
    OPTIONAL {
        ?piGroup dpp-core:dataPoint ?commDP .
        ?commDP a dpp-product-info:ProductCommercialInformation .
        OPTIONAL { ?commDP dpp-product-info:image              ?image }
        OPTIONAL { ?commDP dpp-product-info:lifetimeExpectancy ?lifetimeExpectancy }
    }

    # ── Quality Assessment ──
    OPTIONAL {
        ?piGroup dpp-core:dataPoint ?qualDP .
        ?qualDP a dpp-product-info:QualityAssessment ;
                dpp-product-info:qualityAssessment ?qualityAssessment .
    }

    # ── Identified Risk ──
    OPTIONAL {
        ?piGroup dpp-core:dataPoint ?riskDP .
        ?riskDP a dpp-product-info:IdentifiedRisk ;
                dpp-product-info:identifiedRisk ?identifiedRisk .
    }

    # ════════════════════════════════════════════════════════════════════
    # 2. COMPLIANCE
    # ════════════════════════════════════════════════════════════════════
    OPTIONAL {
        ?product dpp-core:dataGroup ?compGroup .
        ?compGroup a dpp-compliance:Compliance .

        OPTIONAL {
        ?compGroup dpp-core:dataPoint ?regDP .
        ?regDP a dpp-compliance:Regulation ;
                dpp-compliance:regulation ?regData .
        OPTIONAL { ?regData schema:name       ?regulationName }
        OPTIONAL { ?regData schema:identifier ?regulationId }
        }
        OPTIONAL {
        ?compGroup dpp-core:dataPoint ?lblDP .
        ?lblDP a dpp-compliance:Label ;
                dpp-compliance:label ?lblData .
        ?lblData schema:name ?labelName .
        }
        OPTIONAL {
        ?compGroup dpp-core:dataPoint ?psaDP .
        ?psaDP a dpp-compliance:ProductStatusAssessment ;
                dpp-compliance:productStatusAssessment ?psaData .
        ?psaData schema:name ?productStatus .
        OPTIONAL { ?psaData schema:description ?productStatusDesc }
        }
        OPTIONAL {
        ?compGroup dpp-core:dataPoint ?certDP .
        ?certDP a dpp-compliance:Certification ;
                dpp-compliance:certification ?certData .
        ?certData schema:name ?certName .
        OPTIONAL { ?certData schema:description ?certDesc }
        }
        OPTIONAL {
        ?compGroup dpp-core:dataPoint ?dmmDP .
        ?dmmDP a dpp-compliance:DataManagementMethod ;
                dpp-compliance:dataManagementMethod ?dmmData .
        ?dmmData schema:name ?dmmName .
        OPTIONAL { ?dmmData schema:description ?dmmDesc }
        }
    }

    # ════════════════════════════════════════════════════════════════════
    # 3. SUPPLY CHAIN
    # ════════════════════════════════════════════════════════════════════
    OPTIONAL {
        ?product dpp-core:dataGroup ?scGroup .
        ?scGroup a dpp-supply-chain:SupplyChain .

        OPTIONAL {
        ?scGroup dpp-core:dataPoint ?trDP .
        ?trDP a dpp-supply-chain:ProductTraceability ;
                dpp-supply-chain:traceabilityEvent ?trEvent .
        OPTIONAL { ?trEvent dpp-core:actionName ?traceActionName }
        OPTIONAL { ?trEvent dpp-core:actionType ?traceActionType }
        OPTIONAL { ?trEvent dpp-core:time       ?traceTime }
        OPTIONAL {
            ?trEvent dpp-core:location ?traceLoc .
            ?traceLoc schema:name ?traceLocation .
        }
        }
        OPTIONAL {
        ?scGroup dpp-core:dataPoint ?rpDP .
        ?rpDP a dpp-supply-chain:RecyclingPartner ;
                dpp-supply-chain:participant ?rpOrg .
        ?rpOrg schema:name ?recyclingPartnerName .
        }
        OPTIONAL {
        ?scGroup dpp-core:dataPoint ?rcDP .
        ?rcDP a dpp-supply-chain:CustomerReturnChannel ;
                dpp-supply-chain:participant ?rcOrg .
        ?rcOrg schema:name ?returnChannelName .
        }
        OPTIONAL {
        ?scGroup dpp-core:dataPoint ?csDP .
        ?csDP a dpp-supply-chain:ComponentSupplier ;
                dpp-supply-chain:participant ?csOrg .
        ?csOrg schema:name ?componentSupplierName .
        }
    }

    # ════════════════════════════════════════════════════════════════════
    # 4. SUSTAINABILITY
    # ════════════════════════════════════════════════════════════════════
    OPTIONAL {
        ?product dpp-core:dataGroup ?susGroup .
        ?susGroup a dpp-sustainability:SustainabilityInformation .

        OPTIONAL {
        ?susGroup dpp-core:dataPoint ?spDP2 .
        ?spDP2 a dpp-sustainability:SustainabilityPerformance .
        OPTIONAL {
            ?spDP2 dpp-sustainability:environmentalFootprint ?efNode .
            ?efNode rdfs:label ?envFootprint .
        }
        OPTIONAL {
            ?spDP2 dpp-sustainability:resourceConsumption ?rcNode .
            ?rcNode rdfs:label ?resourceConsumption .
        }
        }
        OPTIONAL {
        ?susGroup dpp-core:dataPoint ?dcDP .
        ?dcDP a dpp-sustainability:Decomposability ;
                dpp-sustainability:decomposability ?decomposability .
        }
        OPTIONAL {
        ?susGroup dpp-core:dataPoint ?crDP .
        ?crDP a dpp-sustainability:CriticalRawMaterial .
        OPTIONAL { ?crDP dpp-sustainability:criticalRawMaterial  ?criticalRawMaterial }
        OPTIONAL { ?crDP dpp-sustainability:lifeCycleAssessment  ?lca }
        }
        OPTIONAL {
        ?susGroup dpp-core:dataPoint ?rnDP .
        ?rnDP a dpp-sustainability:RenewableNonRenewableContent ;
                dpp-sustainability:renewableNonRenewableContent ?renewableContent .
        }
        OPTIONAL {
        ?susGroup dpp-core:dataPoint ?siDP .
        ?siDP a dpp-sustainability:SocialIndicator ;
                dpp-sustainability:labourConditions ?labourConditions .
        }
        OPTIONAL {
        ?susGroup dpp-core:dataPoint ?edDP .
        ?edDP a dpp-sustainability:EnvironmentDeclaration ;
                dpp-sustainability:environmentDeclaration ?envDeclaration .
        }
    }

    # ════════════════════════════════════════════════════════════════════
    # 5. END OF LIFE
    # ════════════════════════════════════════════════════════════════════
    OPTIONAL {
        ?product dpp-core:dataGroup ?eolGroup .
        ?eolGroup a dpp-eol:EndOfLifeData .

        OPTIONAL {
        ?eolGroup dpp-core:dataPoint ?rpotDP .
        ?rpotDP a dpp-eol:RecyclingReusePotential ;
                dpp-eol:recyclingReusePotential ?recyclingReusePotential .
        }
        OPTIONAL {
        ?eolGroup dpp-core:dataPoint ?disDP .
        ?disDP a dpp-eol:DisposalOptions ;
                dpp-eol:disposalOptions ?disposalOptions .
        }
        OPTIONAL {
        ?eolGroup dpp-core:dataPoint ?ewDP .
        ?ewDP a dpp-eol:ExpectedWaste ;
                dpp-eol:expectedWaste ?expectedWaste .
        }
        OPTIONAL {
        ?eolGroup dpp-core:dataPoint ?reuDP .
        ?reuDP a dpp-eol:Reusability ;
                dpp-eol:reusability ?reusability .
        }
        OPTIONAL {
        ?eolGroup dpp-core:dataPoint ?repDP .
        ?repDP a dpp-eol:Repairability ;
                dpp-eol:repairability ?repairability .
        }
        OPTIONAL {
        ?eolGroup dpp-core:dataPoint ?refDP .
        ?refDP a dpp-eol:Refurbrishability ;
                dpp-eol:refurbrishability ?refurbishability .
        }
        OPTIONAL {
        ?eolGroup dpp-core:dataPoint ?upgDP .
        ?upgDP a dpp-eol:UpgradeOptions ;
                dpp-eol:upgradeOptions ?upgradeOptions .
        }
        OPTIONAL {
        ?eolGroup dpp-core:dataPoint ?nlDP .
        ?nlDP a dpp-eol:NumberOfLifecycles ;
                dpp-eol:numberOfLifecycles ?numberOfLifecycles .
        }
        OPTIONAL {
        ?eolGroup dpp-core:dataPoint ?eiDP .
        ?eiDP a dpp-eol:EndOfLifeInformation .
        OPTIONAL { ?eiDP dpp-eol:wastePrevention       ?wastePrevention }
        OPTIONAL { ?eiDP dpp-eol:separateCollection    ?separateCollection }
        OPTIONAL { ?eiDP dpp-eol:collectionInformation  ?collectionInfo }
        OPTIONAL { ?eiDP dpp-eol:endOfLifeReport       ?eolReport }
        }
    }

    # ════════════════════════════════════════════════════════════════════
    # 6. GUIDELINES & MANUALS
    # ════════════════════════════════════════════════════════════════════
    OPTIONAL {
        ?product dpp-core:dataGroup ?glGroup .
        ?glGroup a dpp-guidelines:GuidelinesAndManuals .

        OPTIONAL {
        ?glGroup dpp-core:dataPoint ?agDP .
        ?agDP a dpp-guidelines:AssemblyGuideline ;
                dpp-guidelines:assemblyGuideline ?agRes .
        ?agRes schema:url ?assemblyGuideUrl .
        }
        OPTIONAL {
        ?glGroup dpp-core:dataPoint ?dgDP .
        ?dgDP a dpp-guidelines:NonDestructiveDisassemblyGuideline ;
                dpp-guidelines:nonDestructiveDisassemblyGuideline ?dgRes .
        ?dgRes schema:url ?disassemblyGuideUrl .
        }
        OPTIONAL {
        ?glGroup dpp-core:dataPoint ?pmDP2 .
        ?pmDP2 a dpp-guidelines:ProductManual ;
                dpp-guidelines:productManual ?pmRes .
        ?pmRes schema:url ?productManualUrl .
        }
        OPTIONAL {
        ?glGroup dpp-core:dataPoint ?sgDP .
        ?sgDP a dpp-guidelines:StorageAndTransportGuideline ;
                dpp-guidelines:storageAndTransportGuideline ?sgRes .
        ?sgRes schema:url ?storageGuideUrl .
        }
        OPTIONAL {
        ?glGroup dpp-core:dataPoint ?ciDP .
        ?ciDP a dpp-guidelines:CommercialInstruction .
        OPTIONAL {
            ?ciDP dpp-guidelines:safetyInstruction ?sfRes .
            ?sfRes schema:url ?safetyUrl .
        }
        OPTIONAL {
            ?ciDP dpp-guidelines:maintenanceInstruction ?miRes .
            ?miRes schema:url ?maintenanceUrl .
        }
        OPTIONAL {
            ?ciDP dpp-guidelines:wasteSortingInstruction ?wsRes .
            ?wsRes schema:url ?wasteSortingUrl .
        }
        }
        OPTIONAL {
        ?glGroup dpp-core:dataPoint ?accDP .
        ?accDP a dpp-guidelines:Accessibility ;
                dpp-guidelines:accessibility ?accessibility .
        }
        OPTIONAL {
        ?glGroup dpp-core:dataPoint ?ucDP .
        ?ucDP a dpp-guidelines:UtilizationCharacteristic ;
                dpp-guidelines:utilizationCharacteristic ?utilizationCharacteristic .
        }
    }

    # ════════════════════════════════════════════════════════════════════
    # 7. USAGE
    # ════════════════════════════════════════════════════════════════════
    OPTIONAL {
        ?product dpp-core:dataGroup ?usGroup .
        ?usGroup a dpp-usage:UsageInformation .

        OPTIONAL {
        ?usGroup dpp-core:dataPoint ?mlDP .
        ?mlDP a dpp-usage:MaintenanceLog ;
                dpp-usage:maintenanceLog ?mlEvent .
        OPTIONAL { ?mlEvent dpp-core:actionName ?maintActionName }
        OPTIONAL { ?mlEvent dpp-core:time       ?maintTime }
        }
        OPTIONAL {
        ?usGroup dpp-core:dataPoint ?uhDP .
        ?uhDP a dpp-usage:UsageHistory ;
                dpp-usage:usageHistory ?uhEvent .
        OPTIONAL { ?uhEvent dpp-core:actionName ?usageActionName }
        OPTIONAL { ?uhEvent dpp-core:time       ?usageTime }
        }
        OPTIONAL {
        ?usGroup dpp-core:dataPoint ?ieDP .
        ?ieDP a dpp-usage:IncidentsAndErrors ;
                dpp-usage:incidentsAndErrors ?ieEvent .
        OPTIONAL { ?ieEvent dpp-core:actionName ?incidentActionName }
        OPTIONAL { ?ieEvent dpp-core:time       ?incidentTime }
        }
    }
    }`;
}