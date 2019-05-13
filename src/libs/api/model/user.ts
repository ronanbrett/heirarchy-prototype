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


export interface User { 
    roles?: Array<User.RolesEnum>;
    userId?: string;
}
export namespace User {
    export type RolesEnum = 'View_Only' | 'READONLY_PT' | 'BNP_Paribas_Administrator' | 'Analyst_PT' | 'Client_Ops_Member' | 'Performance_Member' | 'Analyst_AM_AND_PT' | 'Supervisor_PT' | 'Client_Ops_Manager' | 'Performance_Manager' | 'Supervisor_AM_AND_PT' | 'BNP_Paribas_Operational_Member' | 'IDM_Team_Member' | 'BNP_Paribas_Manager' | 'IDM_Team_Manager';
    export const RolesEnum = {
        ViewOnly: 'View_Only' as RolesEnum,
        READONLYPT: 'READONLY_PT' as RolesEnum,
        BNPParibasAdministrator: 'BNP_Paribas_Administrator' as RolesEnum,
        AnalystPT: 'Analyst_PT' as RolesEnum,
        ClientOpsMember: 'Client_Ops_Member' as RolesEnum,
        PerformanceMember: 'Performance_Member' as RolesEnum,
        AnalystAMANDPT: 'Analyst_AM_AND_PT' as RolesEnum,
        SupervisorPT: 'Supervisor_PT' as RolesEnum,
        ClientOpsManager: 'Client_Ops_Manager' as RolesEnum,
        PerformanceManager: 'Performance_Manager' as RolesEnum,
        SupervisorAMANDPT: 'Supervisor_AM_AND_PT' as RolesEnum,
        BNPParibasOperationalMember: 'BNP_Paribas_Operational_Member' as RolesEnum,
        IDMTeamMember: 'IDM_Team_Member' as RolesEnum,
        BNPParibasManager: 'BNP_Paribas_Manager' as RolesEnum,
        IDMTeamManager: 'IDM_Team_Manager' as RolesEnum
    };
}
