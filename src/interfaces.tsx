/*
 * This file is part of the project by AGBOKOUDJO Franck.
 *
 * (c) AGBOKOUDJO Franck <franckagbokoudjo301@gmail.com>
 * Phone: +229 0167 25 18 86
 * LinkedIn: https://www.linkedin.com/in/internationales-web-services-120520193/
 * Company: INTERNATIONALES WEB SERVICES
 * [GitHub - Agbokoudjo/sonata_classification_ui](https://github.com/Agbokoudjo/sonata_classification_ui)
 * For more information, please feel free to contact the author.
 */
import { CSSProperties, ReactNode } from "react";
export interface ClassificationOptions{
    classNameButtonOpen?: string[];
    childrenButtonOpen?: ReactNode|string;
    styleButtonOpen?:CSSProperties;
    classNameDialog?: string[];
    styleDialog?: CSSProperties;
    childrenDialogTitle?:  ReactNode|string;
    urlAction: string;
    baseUrl?: string | URL;
    methodSend?: string;
    classNameForm?: string[];
    classNameCancelButton?: string[];
    childrenCancelButton?: ReactNode|string;
    classNameDialogActionContainer?: string[];
    classNameSubmitButton?: string[];
    styleSubmitedButton?: CSSProperties;
    childrenSubmitedButton?: ReactNode|string;
    formToken?: string;
    formatSendData?: "json" | "formdata";
    messageBeforeSendData?: string,
    headersFetch?:HeadersInit
}
export interface BaseClassifications{
    name: string;
    enabled: boolean;
}
export interface SelectClassificationType {
  id: number|string;
  name: string;
}
export interface SelectBaseClassficationConfig{
  readonly nameSelect: string;
 readonly urlRoute: string;
  readonly baseUrl?: string|URL;
  readonly multipleItem?: boolean;
  readonly labelSelect: string;
  readonly labelPlaceholder?: string,
  readonly colorItem?: string;
  readonly labelLoadMore?: string;
  readonly labelRefreshData?: string;
}