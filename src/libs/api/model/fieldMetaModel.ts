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
import { AccountMetaModel } from './accountMetaModel';
import { ListItem } from './listItem';


export interface FieldMetaModel { 
    description?: string;
    enums?: Array<ListItem>;
    fourEyeCheck?: boolean;
    initValue?: string;
    isAutoGen?: boolean;
    isContainsDerivatives?: boolean;
    isContainsOTCDerivatives?: boolean;
    isCoreAccount?: boolean;
    isCurrency?: boolean;
    isDate?: boolean;
    isEmail?: boolean;
    isList?: boolean;
    isMultiple?: boolean;
    isPerformance?: boolean;
    isPresentForAccount?: boolean;
    isPresentForClosingOrClosedOrInactive?: boolean;
    isPresentForEntity?: boolean;
    isPresentForFund?: boolean;
    isPresentForGroupAccount?: boolean;
    isRequiredForAccount?: boolean;
    isRequiredForAccountAndPrivateMarket?: boolean;
    isRequiredForClosingOrClosedOrInactive?: boolean;
    isRequiredForEntity?: boolean;
    isRequiredForFund?: boolean;
    isRequiredForGroupAccount?: boolean;
    isRequiredForNotAccountAndIsShell?: boolean;
    maxLength?: string;
    metaModel?: AccountMetaModel;
    minLength?: string;
    pickList?: Array<ListItem>;
}
