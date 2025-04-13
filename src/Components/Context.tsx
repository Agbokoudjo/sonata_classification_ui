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
import { BaseClassifications, ClassificationOptions, SelectBaseClassficationConfig, SelectClassificationType } from "../interfaces";
import { OptionsCollectionItemClassification, ErrorState, ErrorMessageState } from "../types";
import React, { memo,Fragment, useState, useEffect } from "react";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box'
import {
    FormInputValidator, escapeHtmlBalise, ApiError,
    addParamToUrl, mapStatusToResponseType, httpFetchHandler
} from "@wlindabla/form_validator";
import Swal from 'sweetalert2'
const formInputValidator = FormInputValidator.getInstance();
import { ValidatorErrorField } from "@wlindabla/sonata_shared";
import { onSubmitContext } from "../hooks/hooks";
import Autocomplete from '@mui/material/Autocomplete';
export interface ContextInterface extends BaseClassifications {
    id: string | number;
    createdAt: Date|string;
    updatedAt: Date|string;
}

export interface ContextOptions extends ClassificationOptions{
    optionscollectionitem: OptionsCollectionItemClassification;
}
export const SonataContext: React.FC<ContextOptions> = memo(function SonataContext({
        classNameButtonOpen,
        styleButtonOpen,
        childrenButtonOpen,
        classNameDialog,
        urlAction,
        styleDialog,
        childrenDialogTitle,
        classNameForm,
        childrenCancelButton,
        optionscollectionitem,
        formToken,
        childrenSubmitedButton,
        styleSubmitedButton,
        classNameSubmitButton,
        classNameDialogActionContainer,
        classNameCancelButton,
       formatSendData = "json",
        baseUrl,
        messageBeforeSendData,
        headersFetch
}: ContextOptions) {
    const [isOpenContext, setIsOpenContext] = useState(false);
    const handleOpenContext = (): void => { setIsOpenContext(true); }
    const handleCloseContext = (): void => { setIsOpenContext(false); }
    const [contextCollection, setContextCollection] = useState<BaseClassifications[]>([{ name: "", enabled: false }]);
     const [isdisabled, setIsDisabled] = useState<boolean>(false);
    const [changeLabelClose, setChangeLabelClose] = useState(childrenCancelButton);
    const [errorsClassification, setErrorsClassification] = useState<ErrorState>({});
    const [errormessagefieldClassification, setErrormessagefieldClassification] = useState<ErrorMessageState>({});
     /**
      * handle click event of the Add button
      */
    const handleAddContext = () => {
        setContextCollection([...contextCollection, { name: "", enabled: false }]);
         setChangeLabelClose(childrenCancelButton)
  };
    /**
     * remove un item of collection context
     * @param index 
     */
    const handleRemoveContext = (index: number)=>{
        const clone_context_collection = [...contextCollection];
        const tri_context = clone_context_collection.filter((_, indexFilter) => !(indexFilter === index));
        setContextCollection(tri_context);
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const { type, checked, id, value } = e.target as HTMLInputElement;
        const context_list = [...contextCollection];
         const old_base_classification = context_list[index];
        if (type === "checkbox") {
            old_base_classification.enabled = checked;
            context_list[index] = old_base_classification;
            setContextCollection(context_list)
            return;
        }
        if (type === "text" && value) {
            old_base_classification.name = escapeHtmlBalise(value, true) as string;
            context_list[index] = old_base_classification;
             setContextCollection(context_list)
        }
        if (errorsClassification[id]) {
            setErrorsClassification(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[id];
                return newErrors;
            });
        }
        if (errormessagefieldClassification[id]) {
            setErrormessagefieldClassification(prevErrormessagefield => {
                const newErrorMessages = { ...prevErrormessagefield };
                delete newErrorMessages[id];
                formInputValidator.clearError(id);
                return newErrorMessages;
            });
        }
        setIsDisabled(false);
        setChangeLabelClose(childrenCancelButton);
        return;
    }
    const onBlurHandle = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, i: number) => {
        const refInputCurrent = event.target as HTMLInputElement;
        const valueInput = refInputCurrent.value;
        if (valueInput.length <= 0) { console.log(`name_${i}`); return; }
       formInputValidator.textValidator(valueInput.trim(), refInputCurrent.id,
            optionscollectionitem.nameFieldOptions?.optionsValidatorField ||
            {
                minLength: 3, maxLength: 50, regexValidator: /^[a-zA-ZÀ-ÿ0-9À-ÖØ-öø-ÿŒœÆæ\s]+$/i,
                escapestripHtmlAndPhpTags: true,
                errorMessageInput: `the name ${valueInput} of context name is invalid`,
                egAwait:"context"
            }
       )
        if (formInputValidator.hasErrorsField(refInputCurrent.id)=== false) {
            setErrorsClassification(prevErrors => ({
            ...prevErrors,
            [refInputCurrent.id]:true
          }));
          setErrormessagefieldClassification(prevErrormessagefield => ({
            ...prevErrormessagefield,
            [refInputCurrent.id]: formInputValidator.getErrorMessageField(refInputCurrent.id)
          }));
          setIsDisabled(true);
        }
    }
    const resertField = () => {
        setContextCollection([{name: "",enabled: false,}])
    }
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
        if (Object.hasOwn(all_errors, 'name')) {
            for (const [name, messages] of Object.entries(all_errors)) {
             setErrorsClassification(prevErrors => ({
            ...prevErrors,
            [name]: true
          }));
          setErrormessagefieldClassification(prevErrormessagefield => ({
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
                type="button" onClick={handleOpenContext}
                style={styleButtonOpen || { backgroundColor: '#283c63' }}>
                {childrenButtonOpen || <span>Add the context</span>}
            </Button>
            <Dialog open={isOpenContext} onClose={handleCloseContext}  component="div"
                className={classNameDialog?.join(" ") || "modal-dialog-contex"}
                id="sonata_classification_context_form"
                style={styleDialog || { justifyContent: "center" }}>
                <Box sx={{backgroundColor: '#283c63',color:"#fff"}}>
                 <DialogTitle component="div" id="responsive-dialog-title">
                    {childrenDialogTitle}
                </DialogTitle>
                <DialogContent>
                    <div className="centered">
                        <form className={classNameForm?.join(" ") || "form sonata_classification"}
                                id="sonata_classification_context"
                                name="sonata_classification_context"
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const form = e.target as HTMLFormElement;
                                     form.addEventListener("formSubmissionError", handleFormError as EventListener);
                                    await onSubmitContext(
                                        form,
                                        contextCollection,
                                        urlAction,
                                        formatSendData ?? 'json',
                                        resertField,
                                        baseUrl,
                                        messageBeforeSendData,
                                        headersFetch,
                                    )
                                    form.removeEventListener("formSubmissionError", handleFormError as EventListener);
                                }}
                                
                            >  
                            <div className="form-field-context">
                                {
                                    contextCollection.map((item_context, position) => {
                                        return (
                                            <div className={optionscollectionitem.classNameClassificationItem?.join(" ") || "container-classification context-item"}
                                                key={position}>
                                                <div className={
                                                    optionscollectionitem.classNameClassificationContainerTitle?.join(" ") ||
                                                    "text-warning fw-bolder text-center mt-1"
                                                }>CONTEXT { position +1}</div>
                                                <div className={optionscollectionitem.classNameContainerDelete?.join((" "))
                                                    || "float-sm-end mb-2 d-flex flex-column justify-content-end me-2"}>
                                                    {
                                                        contextCollection.length !== 1 && (
                                                            <button type="button"
                                                                className={optionscollectionitem.classNameButtonDelete?.join(" ") ||
                                                                    "mr10 btn btn-danger text-white fw-bold"}
                                                                onClick={() => handleRemoveContext(position)}
                                                            >
                                                                <DeleteIcon color="inherit" className={optionscollectionitem.classNameIconDelete?.join(" ") || "fw-bold"}>
                                                                </DeleteIcon><span>{optionscollectionitem.labelButtonDelete || "remove context"} {position +1} </span>
                                                        </button>
                                                    )}                                                     
                                                </div>
                                                <div className={optionscollectionitem.nameFieldOptions?.classNameRowContainer?.join(" ") || "row bg-transparent d-flex flex-column"}>
                                                    <div className={optionscollectionitem.nameFieldOptions?.classNameTextFieldContainer?.join(" ")|| "col me-1"}>
                                                        <label htmlFor={`name_${position}`}
                                                            className={optionscollectionitem.nameFieldOptions?.classNameLabelTextField?.join(" ") || "form-label text-white fw-bold me-1"}>
                                                                {optionscollectionitem.nameFieldOptions?.labelTextField || "Name"}
                                                        </label>
                                                        <TextField
                                                            id={`name_${position}`}
                                                            type="text"
                                                            name={`name_${position}`}
                                                            key={position}
                                                            fullWidth
                                                            autoFocus
                                                            placeholder={`${optionscollectionitem.nameFieldOptions?.placeholder || "Context"} ${position +1}`}
                                                            slotProps={{
                                                                htmlInput: 
                                                                    optionscollectionitem.nameFieldOptions?.htmlInputOptions || {
                                                                         minLength:"3",maxLength:"50",className:'form-control name'
                                                                    }
                                                            }}
                                                            value={item_context.name}
                                                            required={true}
                                                            onChange={(e) => handleInputChange(e,position)}
                                                            onBlur={(e) => onBlurHandle(e, position)}
                                                            error={errorsClassification[`name_${position}`]}
                                                            helperText=
                                                            {errorsClassification[`name_${position}`] &&
                                                                <ValidatorErrorField
                                                                    errordisplay={true}
                                                                    messageerror={errormessagefieldClassification[`name_${position}`] as string[]}
                                                                    classnameerror={["fw-bold", "text-danger", "mt-2","error-message"]}
                                                                />
                                                            }
                                                        >
                                                        </TextField>
                                                    </div>
                                                    <div className={
                                                        optionscollectionitem.optionsCheckbox?.classNameContainer?.join(" ") ||
                                                        "col ms-2 form-check mt-1"
                                                    }>
                                                        <label htmlFor={`enabled_${position}`}
                                                            className={optionscollectionitem.optionsCheckbox?.classNameLabel?.join(" ") ||
                                                                "form-check-label text-white fw-bolder"}
                                                        >
                                                                {optionscollectionitem.optionsCheckbox?.labelCheckbox || "enabled"}
                                                        </label>
                                                        <Checkbox slotProps={
                                                            optionscollectionitem.optionsCheckbox?.htmlInputOptionsCheckbox || 
                                                                {
                                                                    className: 'form-check-input'
                                                                }
                                                            }
                                                            required={false}
                                                            key={position}
                                                            checked={item_context.enabled}
                                                            onChange={(e) => handleInputChange(e,position)}
                                                            name={`enabled_${position}`}
                                                            color="primary"
                                                            id={`enabled_${position}`}
                                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />

                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                <div className={
                                    optionscollectionitem.classNameContainerAdd?.join(" ") || 
                                    "col-auto mt-3 float-sm-start mb-3"
                                }>
                                    <button type="button" onClick={handleAddContext}
                                        className={
                                            optionscollectionitem.classNameButtonAdd?.join(" ") || 
                                            "btn btn-info border-info text-white fw-bold border rounded-3 text-center"
                                        }>
                                        <Icon color='info' baseClassName="fas"
                                            className={
                                                optionscollectionitem.classNameIconAdd?.join(" ") ??
                                                "fa-plus-circle me-2"
                                            }></Icon>
                                        {
                                            optionscollectionitem.labelButtonAdd || "Add"
                                        }
                                    </button>
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
                        id={`sonata_classification_context_cancel`}
                        onClick={handleCloseContext}
                        disabled={isdisabled}
                        className={classNameCancelButton?.join("  ") ||
                                    "btn btn-secondary text-white fw-bold border me-2 ms-1 border-secondary  rounded-3 "}>
                        { changeLabelClose }
                        </button>
                        <Button type="submit"
                            form='sonata_classification_context'
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
    );
});
/**
 * Select Context
 */

export const SelectContext: React.FC<SelectBaseClassficationConfig> = memo(function SelectContext({
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
    const [completeList, setCompleteList] = useState<SelectClassificationType[]>([]);
     const [nextUrl,setNextUrl]=useState<string>(addParamToUrl(urlRoute,{'page':1},true,baseUrl) as string)
    const loadMoreHandle = () => {
        setNextUrl(document.querySelector('#loadMoreContext')!.getAttribute('url-action')!)
     }
    const refreshDataHandle = () => {
        setRefreshData(true); 
        setNextUrl(addParamToUrl(urlRoute,{'page':1},true,baseUrl) as string)
    }
    useEffect(() => {
        const fetchContext = async () => {
            setLoading(true)
            try {
                const response_data_context = await httpFetchHandler({
                url:nextUrl,
                optionsheaders: {
                    'Accept': "application/ld+json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                timeout:9000
            })
                const status_type = mapStatusToResponseType(response_data_context.status);
                if (status_type === "error") {
                    throw new ApiError(response_data_context.data as string|Record<string, unknown>, response_data_context.status);
                }
                // si la status de la response est success
                const data = response_data_context.data as
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
                const context_list = [...completeList];
                data.member.map((item) => (
                    context_list.push({
                        id: item.id,
                        name:item.name
                    })
                ))
                setCompleteList(context_list);
                if (data.view) {
                    const url_recovery_data = data.view.next ?? data.view.last ?? nextUrl
                    document.querySelector('#loadMoreContext')!.setAttribute(
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
        fetchContext();
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
                options={completeList}
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
                            {option.name}
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
                        placeholder={labelPlaceholder ?? 'choose context'}
                        ></TextField>
                    )}
            /> 
            <div className="d-flex flex-row">
                <div className="loadMore mt-2 mb-2">
                    <Button className="btn bg-info text-white fw-800"
                        onClick={loadMoreHandle}
                        id="loadMoreContext"
                    >
                        {labelLoadMore ?? 'load more'}
                    </Button>
                </div>
                <div className="refreshData mt-2 mb-2 ms-2">
                    <Button className="btn bg-secondary text-white fw-800"
                        onClick={refreshDataHandle}
                        id="refreshData"
                    >
                        {labelRefreshData ?? 'refresh context'}
                    </Button>
                </div>
           </div>
        </Fragment>
    )
})