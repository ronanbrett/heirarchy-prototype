/**
 * Api Documentation
 * Api Documentation
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Approval } from './approval';
import { BusinessRule } from './businessRule';
import { PolicyTree } from './policyTree';


export interface Account { 
    accountBaseCurrency?: string;
    accountGroup?: string;
    accountId?: string;
    accountName?: string;
    accountOpenedDate?: string;
    accountPurpose?: string;
    accountSetupStatus?: string;
    accountType?: string;
    address?: string;
    aliasName?: string;
    approvalHistory?: Array<Approval>;
    assetClass?: string;
    borVersions?: Array<string>;
    businessRules?: Array<BusinessRule>;
    cashSweepType?: string;
    children?: Array<string>;
    clientAccountStatus?: string;
    clientId?: string;
    closingDate?: string;
    comment?: string;
    comments1?: string;
    comments2?: string;
    comments3?: string;
    commitmentAmountLocal?: string;
    commitmentDate?: string;
    contactAddress?: string;
    contactEmail?: string;
    contactFax?: string;
    contactName?: string;
    contactPhone?: string;
    containsDerivatives?: string;
    containsEquitiesBonds?: string;
    containsMortgageBackedSecurities?: string;
    containsOTCDerivatives?: string;
    containsPrivateMarketSingleLineAsset?: string;
    custodyAccountCode?: string;
    custodyAccountName?: string;
    directParentAccount?: string;
    entityType?: string;
    expectedNetMOICPrivateEquityOnly?: string;
    foClearingAccountCode?: string;
    fund?: string;
    fundClientDirected?: string;
    fundManager?: string;
    fundingInstructions?: string;
    futureFundInvestingEntity?: string;
    futuresClearingAccount?: string;
    gSTReclaimRate?: string;
    groupId?: string;
    hasSectorHierarchy?: string;
    index?: number;
    initialFundingDate?: string;
    investmentName?: string;
    investmentPartnerName?: string;
    investmentStrategy?: string;
    investmentTeamName?: string;
    investmentType?: string;
    ioInvestmentTeamName?: string;
    isFutureFundManagedAccount?: string;
    legalAgreementExecutionDate?: string;
    legalEntity?: string;
    legalEntityAddress?: string;
    legalEntityTFN?: string;
    lienableAccount?: string;
    linkedSecurity?: string;
    liquidityAccount?: string;
    mCALanguage?: string;
    managementFeeAccrual?: string;
    managementFeeRate?: string;
    managerBenchmark?: string;
    managerRatingBusiness?: string;
    managerRatingFeesTermsandGovernance?: string;
    managerRatingPeopleAndCulture?: string;
    managerRatingPerformance?: string;
    managerRatingProcess?: string;
    managerReportingCurrency?: string;
    managerStrategy?: string;
    operatingFundingCurrency?: string;
    otcClearingAccountCode?: string;
    otherAccountInstructions?: string;
    otherPerformanceBenchmark?: string;
    overallRating?: string;
    partnershipName?: string;
    passportReportingConsolidations?: string;
    pendingApproval?: Approval;
    performanceContactEmail?: string;
    performanceContactName?: string;
    performanceContactPhone?: string;
    performanceEndDate?: string;
    performanceFeeRate?: string;
    performanceInceptionDate?: string;
    performanceMeasurement?: string;
    performanceMethodology?: string;
    pmeAssociatedBenchmark?: string;
    policyTree?: PolicyTree;
    policyTreeLevel1?: string;
    policyTreeLevel2?: string;
    policyTreeLevel3?: string;
    policyTreeLevel4?: string;
    policyTreeLevel5?: string;
    policyTreeLevel6?: string;
    policyTreeLevel7?: string;
    primaryPerformanceBenchmark?: string;
    privateMarket?: string;
    privateMarketSubType?: string;
    proxySharedAccessRequired?: string;
    proxyVotingRegions?: string;
    proxyVotingRequired?: string;
    reconciliationName?: string;
    recordEndDate?: string;
    recordStartDate?: string;
    relatedAccounts?: string;
    reportingCurrency?: string;
    reportingFrequency?: string;
    reportingName?: string;
    secondaryPerformanceBenchmark?: string;
    sector?: string;
    shell?: string;
    sourceAccountId?: string;
    sourceAccountType?: string;
    sourceId?: string;
    statementSource?: string;
    strategy?: string;
    subSector?: string;
    sweepAccount?: string;
    targetReturnPA?: string;
    taxFileNumber?: string;
    terminationDate?: string;
    thirdPartyAdministrator?: string;
    usdNifRequired?: string;
    valuationReportingDate?: string;
    valuationReportingDateYearEnd?: string;
    vintageYear?: string;
}
