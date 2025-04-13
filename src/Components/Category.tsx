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
import React, { memo, Fragment, useState, useCallback, useEffect } from "react";
import { ClassificationOptions, SelectBaseClassficationConfig,SelectClassificationType } from "../interfaces";
import Swal from 'sweetalert2'
import { ErrorState, ErrorMessageState, CheckboxClassification } from "../types";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box'
import {
    ApiError, FormInputValidator, addParamToUrl,
    httpFetchHandler,mapStatusToResponseType
} from "@wlindabla/form_validator";
const formInputValidator = FormInputValidator.getInstance();
import { ValidatorErrorField} from "@wlindabla/sonata_shared";
import { onSubmitFormCategory } from "../hooks/hooks";
import { SelectContext } from "./Context";
export interface CategoryOptions extends ClassificationOptions{
    optionsCheckbox?:CheckboxClassification
    classNameRowContainer?: string[];
    classNameTextFieldContainer?: string[];
    classNameLabelTextField?: string[];
    labelTextField?: string[];
    textFieldPlaceholder?: string;
    htmlInputOptions?: Record<string, unknown>;
    classNameLabelTextarea?: string[];
    placeholderTextarea?: string;
    regexTextarea?: RegExp;
    regexTextField?: RegExp;
    maxLengthTextarea?: number;
    maxLengthNameCategory?: number;
    minLengthNameCategory?: number;
    htmlInputTextareaOptions?: Record<string, unknown>;
    labelTextarea?: string; //le text label du champ textarea dedier a la saisi de la description du category
    context_options:SelectBaseClassficationConfig;//le context de creation de category par exemple pour les medias video comme youtube,et video on peut donner comme nom video
}
export const SonataCategory: React.FC<CategoryOptions> = memo(function SonataCategory({
    labelTextarea,
    classNameButtonOpen,
    styleButtonOpen,
    childrenButtonOpen,
    classNameDialog,
    urlAction,
    styleDialog,
    childrenDialogTitle,
    classNameForm,
    childrenCancelButton,
    formToken,
    childrenSubmitedButton,
    styleSubmitedButton,
    classNameSubmitButton,
    classNameDialogActionContainer,
    classNameCancelButton,
    classNameTextFieldContainer,
    classNameRowContainer,
    classNameLabelTextField,
    labelTextField,
    textFieldPlaceholder, 
    classNameLabelTextarea,
    htmlInputOptions,
    htmlInputTextareaOptions,
    placeholderTextarea,
    regexTextarea,
    regexTextField,
    optionsCheckbox,
    maxLengthNameCategory,
     minLengthNameCategory,
    formatSendData = "json",
    baseUrl,
    messageBeforeSendData,
    headersFetch,
    maxLengthTextarea,
    context_options
}: CategoryOptions) {
      const [isClickCategory, setIsClickCategory] = useState<boolean>(false);
      const handleOpenCategory = (): void => { setIsClickCategory(true); }
      const handleCloseCategory = (): void => { setIsClickCategory(false); }
      const [errors, setErrors] = useState<ErrorState>({});
    const [errormessagefield, setErrormessagefield] = useState<ErrorMessageState>({});
    const [isdisabled, setIsDisabled] = useState<boolean>(false);
    const [changeLabelClose, setChangeLabelClose] = useState(childrenCancelButton ?? 'Cancel');
     const onChangeHandle = useCallback((eventchange: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            eventchange.preventDefault();
         const { value, name, type } = eventchange.target as HTMLInputElement | HTMLTextAreaElement;
         if (type === "checkbox") {
             
             return;
         }
         if (value.length <= 0 || !errors[name] || !errormessagefield[name]) { return; }
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
         setErrormessagefield(prevErrormessagefield => {
             const newErrorMessages = { ...prevErrormessagefield };
             delete newErrorMessages[name];
             formInputValidator.clearError(name);
             return newErrorMessages;
         });
         setIsDisabled(false);
         setChangeLabelClose(childrenCancelButton ?? "Cancel");
         return;
  }, [errors, errormessagefield]);
    const onBlurHandle = useCallback((event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        event.preventDefault();
        const { value, name} = event.target as HTMLInputElement | HTMLTextAreaElement;
        if (value.length <= 0) { return; }
        if (name ==='name') {
          formInputValidator.textValidator(value.trim(),name,
            {
                minLength: minLengthNameCategory ?? 6, maxLength: maxLengthNameCategory ?? 200,
                regexValidator: regexTextField ?? /^[a-zA-ZÀ-ÿ0-9À-ÖØ-öø-ÿŒœÆæ_\s]+$/i,
              escapestripHtmlAndPhpTags:true,
              errorMessageInput: `the name ${value} of category name is invalid`,
              egAwait:'Category'
            });
        } else if (name === 'description') {
            formInputValidator.textValidator(value.trim(),name,
            {
                minLength: 10, maxLength: maxLengthTextarea ?? 20000, 
                typeInput: 'textarea',
              regexValidator: regexTextarea ?? /^[A-Za-z0-9*#+À-ÖØ-öø-ÿŒœÆæ.,:()!'@_"|\n\r\s-]+$/i,
              escapestripHtmlAndPhpTags:false,
                errorMessageInput: `the content of field description is invalid`,
                requiredInput:false
            });
        }
        if (formInputValidator.hasErrorsField(name) === false) {
          setErrors(prevErrors => ({
            ...prevErrors,
            [name]: true
          }));
          setErrormessagefield(prevErrormessagefield => ({
            ...prevErrormessagefield,
            [name]: formInputValidator.getErrorMessageField(name)
          }));
            setIsDisabled(true);
        }
        return;
    }, [errors]);
    // Ajouter un écouteur d'événement temporaire
    const handleFormError = (event: CustomEvent) => {
        const apiError = event.detail.apiError as ApiError;
        const all_errors = apiError.allViolations;
        Swal.fire({
            title: `Error ${apiError.status ?? 500}`,
            html: `<div class="alert alert-danger" role="alert">
                        ${apiError.name}
                </div>`,
            icon: "error",
            animation: true,
            allowOutsideClick: false,
            allowEscapeKey: false, 
            background: "#283c63",
            color: "#fff",
            didOpen: () => {
                    document.querySelector<HTMLElement>('.swal2-container')!.style.zIndex = '99999';  
                },
        });
        if (Object.hasOwn(all_errors, 'name') ||
            Object.hasOwn(all_errors, 'description')) {
            for (const [name, messages] of Object.entries(all_errors)) {
            setErrors(prevErrors => ({
            ...prevErrors,
            [name]: true
          }));
          setErrormessagefield(prevErrormessagefield => ({
            ...prevErrormessagefield,
            [name]: messages
          }));
            
        }
        setIsDisabled(true);
        }
    };
    return (
        <Fragment>
            <Button className={classNameButtonOpen?.join(" ") || "btn-category-click text-white btn fw-bold"}
                type="button" onClick={handleOpenCategory}
                style={styleButtonOpen || { backgroundColor: '#283c63' }}>
                {childrenButtonOpen || <span>Add a new category</span>}
            </Button>
             <Dialog open={isClickCategory} onClose={handleCloseCategory}  component="div"
                className={classNameDialog?.join(" ") || "modal-dialog-category"}
                id="sonata_classification_category_form"
                style={styleDialog || { justifyContent: "center" }}>
                <Box sx={{backgroundColor: '#283c63',color:"#fff"}}>
                 <DialogTitle component="div" id="responsive-dialog-title">
                    {childrenDialogTitle}
                </DialogTitle>
                <DialogContent>
                    <div className="centered">
                        <form className={classNameForm?.join(" ") || "form sonata_classification"}
                                id="sonata_classification_category"
                                name="sonata_classification_category"
                                method="POST"
                                onSubmit={async (e) => {
                                    e.preventDefault()
                                     const form = e.target as HTMLFormElement;
                                     form.addEventListener("formSubmissionError", handleFormError as EventListener);
                                    await onSubmitFormCategory(
                                        form,
                                        urlAction,
                                        formatSendData ?? "json",
                                        baseUrl,
                                        messageBeforeSendData,
                                        headersFetch
                                    )
                                     form.removeEventListener("formSubmissionError", handleFormError as EventListener);
                                }}
                            >  
                                <div  className={classNameRowContainer?.join(" ") ?? "row d-flex flex-column"}>
                                    <div className={classNameTextFieldContainer?.join(" ") ?? "col-12 mb-3"}>
                                        <label htmlFor="name"
                                            className={classNameLabelTextField?.join(" ") ??
                                                " control-label form-label text-warning fw-bold me-1"}>
                                                {labelTextField ?? "Name"}
                                        </label>
                                        <TextField
                                            id="name"
                                            type="text"
                                            name="name"
                                            fullWidth
                                            autoFocus
                                            placeholder={textFieldPlaceholder ?? "name of category Eg:Education"}
                                            slotProps={{
                                                htmlInput: 
                                                   htmlInputOptions ?? {
                                                         minLength: 4, maxLength: 200,
                                                        className: "name",
                                                        pattern: "^[a-zA-ZÀ-ÿ0-9_\\s]+$"
                                                    }
                                            }}
                                            required={true}
                                            error={errors['name']}
                                            onChange={(e) => onChangeHandle(e)}
                                            onBlur={(e) => onBlurHandle(e)}
                                            helperText=
                                            {errors[`name`] &&
                                                <ValidatorErrorField
                                                    errordisplay={true}
                                                    messageerror={errormessagefield[`name`] ?? []}
                                                    classnameerror={["fw-bold", "text-danger", "mt-2","error-message"]}
                                                />
                                            }
                                            variant="filled"
                                        >
                                        </TextField>
                                    </div>
                                    <div className="col-12 mb-4">
                                         <label htmlFor="description"
                                            className={classNameLabelTextarea?.join(" ") ??
                                                "control-label form-label text-warning fw-bold"}>
                                            {labelTextarea ?? 'Description'}
                                        </label>
                                        <TextField
                                            multiline
                                            fullWidth
                                            minRows={4}
                                            autoFocus
                                            type="text"
                                            id="description"
                                            name="description"
                                             variant="filled"
                                            onChange={(e) => onChangeHandle(e)}
                                            onBlur={(e) => onBlurHandle(e)}
                                            placeholder={placeholderTextarea ?? "Description"}
                                            slotProps={{
                                                htmlInput: htmlInputTextareaOptions ??
                                                {
                                                minLength: 10, maxLength: 20000,
                                                className: "form-control description"
                                                }
                                            }}
                                            required={false}
                                            error={errors['description']}
                                            helperText={errors['description'] &&
                                                <ValidatorErrorField
                                                    errordisplay={true}
                                                    messageerror={errormessagefield['description'] ?? []}
                                                    classnameerror={["fw-bold", "text-danger", "mt-2","error-message"]}
                                                />
                                            }
                                            >
                                            </TextField>
                                    </div>
                                    <div className={optionsCheckbox?.classNameContainer?.join(" ") ??
                                                        "col ms-2 form-check mt-1"
                                                    }>
                                        <label htmlFor={`enabled`}
                                            className={optionsCheckbox?.classNameLabel?.join(" ") ??
                                                "form-check-label text-white fw-bold"}
                                        >
                                                {optionsCheckbox?.labelCheckbox ?? "Enabled"}
                                        </label>
                                        <Checkbox slotProps={
                                            optionsCheckbox?.htmlInputOptionsCheckbox ??
                                            {
                                                className: 'form-check-input'
                                            }
                                            }
                                            required={false}
                                            name={`enabled`}
                                            color="primary"
                                            id={`enabled`}
                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />
                                    </div>
                                    <div className="col-12 mb-4 border border-1 border-white context-container">
                                         <label htmlFor="context"
                                            className="control-label form-label text-warning fw-bold text-center">
                                           Context
                                        </label>
                                        <SelectContext
                                        nameSelect="context[name]"
                                        urlRoute={context_options.urlRoute}
                                        baseUrl={baseUrl}
                                        labelSelect="Context"
                                        labelLoadMore={context_options.labelLoadMore}
                                        labelRefreshData={context_options.labelRefreshData}
                                        labelPlaceholder={context_options.labelPlaceholder}
                                    />
                                    </div>
                                    <TextField type="hidden" name="_token" value={formToken || "formToken"} />
                                </div>
                        </form>
                    </div>
                </DialogContent>
                <DialogActions>
                        <div className={classNameDialogActionContainer?.join(" ") ||
                            "d-flex flex-row justify-content-md-around actions-container"}>
                        <button type="button"
                        id={`sonata_classification_category_cancel`}
                        onClick={handleCloseCategory}
                        disabled={isdisabled}
                        className={classNameCancelButton?.join("  ") ||
                                    "btn btn-secondary text-white fw-bold border me-2 ms-1 border-secondary  rounded-3 "}>
                        { changeLabelClose }
                        </button>
                        <Button type="submit"
                            form='sonata_classification_category'
                            variant="contained"
                            disabled={isdisabled}
                            sx={{ borderRadius: '40px' }} // Bordures arrondies
                            endIcon={<SendIcon />}
                                className={classNameSubmitButton?.join(" ") ||
                                    "btn text-white btn-primary  border-primary  rounded-3"}
                            style={styleSubmitedButton || {fontWeight:"bold"}}
                        >
                            {childrenSubmitedButton || "Send"}
                        </Button>
                    </div>
                    </DialogActions>
                    </Box>
            </Dialog>
        </Fragment>
    )
}) 
export const SelectCategory: React.FC<SelectBaseClassficationConfig> = memo(function SelectCategory({
  nameSelect,
    urlRoute,
  baseUrl,
  labelSelect,
  labelPlaceholder,
  colorItem,
   labelLoadMore,
  labelRefreshData
}: SelectBaseClassficationConfig) {
    const [loading, setLoading] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [completeCategoryList, setCompleteCategoryList] = useState<SelectClassificationType[]>([]);
     const [nextUrl,setNextUrl]=useState<string>(addParamToUrl(urlRoute,{'page':1},true,baseUrl) as string)
    const loadMoreHandle = () => {
        setNextUrl(document.querySelector('#loadMoreCategory')!.getAttribute('url-action')!)
     }
    const refreshDataHandle = () => {
        setRefreshData(true); 
        setNextUrl(addParamToUrl(urlRoute,{'page':1},true,baseUrl) as string)
    }
    useEffect(() => {
        const fetchCategory = async () => {
            setLoading(true)
            try {
                const response_data_category= await httpFetchHandler({
                url:nextUrl,
                optionsheaders: {
                    'Accept': "application/ld+json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                timeout:9000
            })
                const status_type = mapStatusToResponseType(response_data_category.status);
                if (status_type === "error") {
                    throw new ApiError(response_data_category.data as string|Record<string, unknown>, response_data_category.status);
                }
                // si la status de la response est success
                const data = response_data_category.data as
                    {
                        member: [{ id: string, name: string }],
                        totalItems: number,
                         view?: {
                            '@id':string,
                            first: string,
                            last?: string,
                            previous?: string,
                            next?: string
                            },
                    };
                const category_list = [...completeCategoryList];
                data.member.map((item) => (
                    category_list.push({
                        id: item.id,
                        name:item.name
                    })
                ))
                setCompleteCategoryList(category_list);
                console.log((category_list))
                if (data.view) {
                    const url_recovery_data = data.view.next ?? data.view.last ?? nextUrl
                    document.querySelector('#loadMoreCategory')!.setAttribute(
                        'url-action',
                        addParamToUrl(url_recovery_data,null,true,baseUrl) as string);
              }
            } catch (error) {
                console.log('Error:', error)
                let status = 404;
                let message = "An error occurred:<br/>";
                if (error instanceof ApiError) {
                    status = error.status;
                    message = error.name;
                   }
                    Swal.fire({
                        title: `Error ${status ?? 404}`,
                        html: `<div class="alert alert-danger" role="alert">
                                ${message}
                        </div>`,
                        icon: "error",
                        animation: true,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        background: "#283c63",
                        color: "#fff",
                        didOpen: () => {
                            document.querySelector<HTMLElement>('.swal2-container')!.style.zIndex = '99999';  
                        },
                    });
            }
            finally {setLoading(false);}
        }
        fetchCategory();
    }, [refreshData,nextUrl])
    return (
        <Fragment>
             <Autocomplete 
                id={nameSelect}
                loading={loading}
                loadingText={'loading in progress...'}
                autoHighlight
                fullWidth={true}
                autoSelect
                autoComplete={true}
                sx={{ width: '100%' }}
                options={completeCategoryList}
                multiple={false}
                getOptionLabel={(option: SelectClassificationType) => option.name}
                getOptionKey={(option: SelectClassificationType) => option.id}
                renderOption={(props, option: SelectClassificationType) => {
                    const { key, ...optionProps } = props;
                    return (
                        <Box
                            key={key}
                            component="li"
                        sx = {{ color: colorItem ?? 'black', fontWeight:'bolder' }
                    }
                        {...optionProps}
                        >
                            {option.name} {option.id}
                        </Box>
                        )
                }}
                 renderInput={(params) => (
                        <TextField
                        {...params}
                         label={labelSelect}
                         name={nameSelect}
                        type="text"
                        slotProps={{
                            htmlInput: {
                            ...params.inputProps,
                            className: 'form-control',
                            autoComplete:'on'
                            }
                        }}
                        fullWidth={true}
                        placeholder={labelPlaceholder ?? 'choose category'}
                        ></TextField>
                    )}
            /> 
            <div className="d-flex flex-row">
                <div className="loadMore mt-2 mb-2">
                    <Button className="btn bg-info text-white fw-800"
                        onClick={loadMoreHandle}
                        id="loadMoreCategory"
                    >
                        {labelLoadMore ?? 'load more'}
                    </Button>
                </div>
                <div className="refreshData mt-2 mb-2 ms-2">
                    <Button className="btn bg-secondary text-white fw-800"
                        onClick={refreshDataHandle}
                        id="refreshData"
                    >
                        {labelRefreshData ?? 'refresh category'}
                    </Button>
                </div>
           </div>
        </Fragment>
    )
}) 
